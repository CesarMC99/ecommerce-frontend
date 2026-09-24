import { CombinedGraphQLErrors } from '@apollo/client'

// Códigos que el GraphqlExceptionFilter del backend pone en extensions.code
export type GraphQLErrorCode =
   | 'UNAUTHENTICATED'
   | 'BAD_USER_INPUT'
   | 'CONFLICT'
   | 'FORBIDDEN'
   | 'NOT_FOUND'
   | 'INTERNAL_SERVER_ERROR'

const NETWORK_ERROR_MESSAGE =
   'No pudimos conectar con el servidor. Inténtalo de nuevo en unos segundos.'

// Los formularios reaccionan al CÓDIGO (estable, pensado para máquinas) y
// no al mensaje (texto para humanos que puede cambiar en cualquier momento)
export function getGraphQLErrorCode(
   error: unknown,
): GraphQLErrorCode | undefined {
   if (!CombinedGraphQLErrors.is(error)) return undefined
   const code = error.errors[0]?.extensions?.code
   return typeof code === 'string' ? (code as GraphQLErrorCode) : undefined
}

// Mensaje listo para mostrar. Si el backend respondió, su mensaje ya está
// en español ("Credenciales inválidas"); si ni siquiera respondió (backend
// caído, sin internet), se muestra un mensaje genérico de conexión
export function getErrorMessage(error: unknown): string {
   if (CombinedGraphQLErrors.is(error)) {
      return error.errors[0]?.message ?? NETWORK_ERROR_MESSAGE
   }
   return NETWORK_ERROR_MESSAGE
}
