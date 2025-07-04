import JWT from 'jsonwebtoken'

const generateToken = async (employerInfo, privateSignature, tokenLife) => {
    try {
        return JWT.sign(employerInfo, privateSignature, { algorithm: 'HS256', expiresIn: tokenLife })
    } catch (error) {
        throw new Error(error)
    }
}

const verifyToken = async (token, privateSignature) => {
    try {
        return JWT.verify(token, privateSignature)
    } catch (error) {
        throw new Error(error)
    }
}

export const JwtProvider = {
    generateToken,
    verifyToken
}