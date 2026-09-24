import UploadHttpLink from 'apollo-upload-client/UploadHttpLink.mjs'

export const uploadLink = new UploadHttpLink({
   uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
   credentials: 'include', // envía/acepta la cookie httpOnly del refresh token
})
