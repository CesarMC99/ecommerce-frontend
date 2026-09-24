// Token de acceso SOLO en memoria: se pierde al recargar (a propósito).
// La persistencia real es la cookie httpOnly del refresh token.
let accessToken: string | null = null

export const getAuthToken = () => accessToken
export const setAuthToken = (token: string | null) => {
   accessToken = token
}
