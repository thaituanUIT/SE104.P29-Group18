import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { EMAIL_RULE, PHONE_NUMBER_RULE, EMAIL_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE, PHONE_NUMBER_RULE_MESSAGE } from '~/utils/validator'

const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        email: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE).required(),
        password: Joi.string().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE).required(),
        fullName: Joi.string().min(3).max(50).strict().required(),
        position: Joi.string().min(3).max(100).strict().required(),
        phoneNumber: Joi.string().pattern(PHONE_NUMBER_RULE).message(PHONE_NUMBER_RULE_MESSAGE).required(),
        workEmail: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE).required(),
        companyName: Joi.string().min(3).max(100).required(),
        companyURL: Joi.string().required(),
        companyLocation: Joi.string().min(3).max(50).required(),
        companyCountry: Joi.string().min(3).max(100).required()
    })

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    }
}

const verify = async (req, res, next) => {
    const correctCondition = Joi.object({
        email: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE).required(),
        token: Joi.string().required()
    })

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    }
}

const login = async (req, res, next) => {
    const correctCondition = Joi.object({
        email: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE).required(),
        password: Joi.string().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE).required()
    })

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    }
}

const updateEmployer = async(req, res, next) => {
    const correctCondition = Joi.object({
        email: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
        password: Joi.string().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE),
        fullName: Joi.string().min(3).max(50).strict(),
        position: Joi.string().min(3).max(100).strict(),
        phoneNumber: Joi.string().pattern(PHONE_NUMBER_RULE).message(PHONE_NUMBER_RULE_MESSAGE),
        workEmail: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
        companyName: Joi.string().min(3).max(100),
        companyURL: Joi.string(),
        companyLocation: Joi.string().min(3).max(50),
        companyCountry: Joi.string().min(3).max(100),
        companySize: Joi.string(),
        industry: Joi.string().min(3).max(50),
        linkedln: Joi.string(),
        companyAddress: Joi.string(),
        companyDescription: Joi.string()
    })
    try {
        await correctCondition.validateAsync(req.body, {abortEarly: false, allowUnknown: true})
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    }
}

export const employerValidation = {
    createNew,
    login,
    verify,
    updateEmployer
}