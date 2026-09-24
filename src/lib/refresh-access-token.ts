import type { RefreshTokensMutation } from '@/graphql/generated/graphql'
import { REFRESH_TOKENS } from '@/graphql/modules/auth/fragments/refresh-tokens.fragment'
import { print } from 'graphql'
import { setAuthToken } from './auth-token'

// Single-flight: si 5 queries fallan a la vez con el token vencido,
// se hace UN solo refresh y las 5 esperan la misma promesa.
// (El backend ROTA el refresh token: dos refresh simultáneos harían
// que el segundo llegara con una cookie ya revocada)
let refreshInFlight: Promise<string | null> | null = null

async function requestNewAccessToken(): Promise<string | null> {
   try {
      // fetch "a pelo" y no el cliente Apollo, por dos razones:
      // 1) los links se crean ANTES de que exista el cliente (circular)
      // 2) si el refresh pasara por el propio errorLink, un fallo
      //    podría disparar otro refresh en bucle
      const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_API_URL!, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         credentials: 'include', // aquí viaja la cookie httpOnly
         body: JSON.stringify({ query: print(REFRESH_TOKENS) }),
      })
      const { data } = (await res.json()) as {
         data: RefreshTokensMutation | null
      }
      const token = data?.refreshTokens.accessToken ?? null
      setAuthToken(token)
      return token
   } catch {
      // Red caída o backend abajo: sin token, que el error original fluya
      setAuthToken(null)
      return null
   }
}

export function refreshAccessToken(): Promise<string | null> {
   if (refreshInFlight == null) {
      refreshInFlight = requestNewAccessToken().finally(() => {
         refreshInFlight = null
      })
   }
   return refreshInFlight
}
