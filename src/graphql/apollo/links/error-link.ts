import { refreshAccessToken } from '@/lib/refresh-access-token'
import { CombinedGraphQLErrors, CombinedProtocolErrors } from '@apollo/client'
import { ErrorLink } from '@apollo/client/link/error'
// rxjs ya viene con Apollo Client 4 (sus links son Observables de rxjs):
// no estamos agregando ninguna dependencia nueva
import { from, switchMap, throwError } from 'rxjs'

// Operaciones que NUNCA deben disparar un refresh al recibir UNAUTHENTICATED.
// En ellas ese código no significa "tu token venció", sino "credenciales
// incorrectas" (Login) o "sesión inválida" (RefreshTokens). Si se
// refrescara, un login con contraseña errónea se reintentaría en silencio
// en vez de mostrar "Credenciales inválidas" al usuario.
const SKIP_REFRESH_OPERATIONS = new Set([
   'Login',
   'Register',
   'LoginWithGoogle',
   'RefreshTokens',
   'Logout',
])

export const errorLink = new ErrorLink(({ error, operation, forward }) => {
   if (CombinedGraphQLErrors.is(error)) {
      const isUnauthenticated = error.errors.some(
         (e) => e.extensions?.code === 'UNAUTHENTICATED',
      )

      // Token vencido → refrescar y reintentar UNA vez.
      if (
         isUnauthenticated &&
         !SKIP_REFRESH_OPERATIONS.has(operation.operationName ?? '')
      ) {
         return from(refreshAccessToken()).pipe(
            switchMap((token) =>
               token
                  ? // Reintento: la operación vuelve a pasar por authLink,
                    // que ya leerá el token NUEVO de memoria
                    forward(operation)
                  : // El refresh también falló (sesión expirada de verdad):
                    // propagamos el error original para que la UI reaccione
                    throwError(() => error),
            ),
         )
      }

      error.errors.forEach(({ message, locations, path }) =>
         console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
         ),
      )
   } else if (CombinedProtocolErrors.is(error)) {
      error.errors.forEach(({ message, extensions }) =>
         console.log(
            `[Protocol error]: Message: ${message}, Extensions: ${JSON.stringify(
               extensions,
            )}`,
         ),
      )
   } else {
      console.error(`[Network error]: ${error}`)
   }
})
