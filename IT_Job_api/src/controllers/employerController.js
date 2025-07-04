import { StatusCodes } from 'http-status-codes'
import { employerService } from '~/services/employerService'
import { JwtProvider } from '~/providers/JwtProvider'
import ms from 'ms'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'
import { employerModel } from '~/models/employerModel'

const createNew = async (req, res, next) => {
    try {
        const createEmployer = await employerService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createEmployer)
    } catch (error) {
        next(error)
    }
}

const verify = async (req, res, next) => {
    try {
        const result = await employerService.verify(req.body)
        res.status(StatusCodes.CREATED).json(result)
    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        const result = await employerService.login(req.body)
        // Trả về 2 token cho FE (JWT)
        res.cookie('accessToken', result.accessToken, {
            secure: true,
            httpOnly: true,
            sameSite: 'none',
            maxAge: ms('7d')
        })

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: ms('7d')
        })
        res.status(StatusCodes.OK).json(result)
    } catch (error) {
        next(error)
    }
}

const logout = async(req, res, next) => {
    try {
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')
        res.status(StatusCodes.OK).json({ message: 'log out successfully' })
    } catch (error) {
        next(error)
    }
}

const refreshToken = async(req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken

        const refreshTokenDecoded = await JwtProvider.verifyToken(refreshToken, env.REFRESH_TOKEN_SIGNATURE)
        const employerInfo = {
            _id: refreshTokenDecoded._id,
            email: refreshTokenDecoded.email
        }

        const newAccessToken = await JwtProvider.generateToken(employerInfo, env.ACCESS_TOKEN_SIGNATURE, '1h')
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: ms('7d')
        })

        res.status(StatusCodes.OK).json({ accessToken: newAccessToken })
    } catch (error) {
        next(new ApiError(StatusCodes.UNAUTHORIZED, 'Please login again'))
    }
}

const updateEmployer = async(req, res, next) => {
    try {
        const employerId = req.jwtDecoded._id
        const logoFile = req.files?.logo?.[0]
        const backgroundFile = req.files?.background?.[0]

        const response = await employerService.updateEmployer(employerId, req.body, logoFile, backgroundFile)
        res.status(StatusCodes.OK).json(response)
    } catch (error) {
        next(error)
    }
}

const getEmployerById = async(req, res, next) => {
    try {
        const response = await employerService.getEmployerById(req.params.id)
        res.status(StatusCodes.OK).json(response)
    } catch (error) {
        next(error)
    }
}

const getRandomEmployers = async (req, res, next) => {
    try {
        const data = await employerService.getRandomEmployers()
        res.status(StatusCodes.OK).json(data)
    } catch (error) {
        next(error)
    }
}

export const employerController = {
    createNew,
    login,
    verify,
    logout,
    refreshToken,
    updateEmployer,
    getEmployerById,
    getRandomEmployers
}