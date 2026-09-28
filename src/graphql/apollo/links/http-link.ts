import { GRAPHQL_ENDPOINT } from '@/lib/graphql-endpoint'
import { HttpLink } from '@apollo/client'

// Último eslabón de la cadena: el que de verdad hace la petición HTTP.
// (Antes lo hacía UploadHttpLink de apollo-upload-client; se quitó porque
// las imágenes se subirán directamente a Cloudinary con una firma del
// backend, sin pasar por GraphQL)
export const httpLink = new HttpLink({
   // Navegador → mismo dominio (proxy); servidor → backend directo
   uri: GRAPHQL_ENDPOINT,
   // Envía y acepta la cookie httpOnly del refresh token (otro puerto =
   // otro origen: sin esto el navegador no la mandaría)
   credentials: 'include',
})
