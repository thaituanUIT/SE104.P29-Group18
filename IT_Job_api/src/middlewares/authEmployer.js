import { JwtProvider } from '~/providers/JwtProvider'
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'

const isAuthorized = async(req, res, next) => {
    const accessTokenFromCookie = req.cookies?.accessToken

    if (!accessTokenFromCookie) {
        next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized, token not found'))
        return
    }

    try {
        const accessTokenDecoded = await JwtProvider.verifyToken(accessTokenFromCookie, env.ACCESS_TOKEN_SIGNATURE)
        req.jwtDecoded = accessTokenDecoded
        next()
    } catch (error) {
        if (error.message?.includes('expired')) {
            next(new ApiError(StatusCodes.GONE, 'Token is expired, please refresh token'))
            return
        }
        next(new ApiError(StatusCodes.UNAUTHORIZED, 'login again'))
        return
    }

}

export const authMiddleware = {
    isAuthorized
}