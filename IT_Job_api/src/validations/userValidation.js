import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '~/utils/validator'

const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        user_id: Joi.string().required(), // ID từ Auth0
        email: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE).required(),
        email_verified: Joi.boolean().default(false),
        name: Joi.string().required().min(2).max(50).trim().strict(),
        nickname: Joi.string().required().min(2).max(50),
        picture: Joi.string().uri().optional(),
    })

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    }
}

export const userValidation = {
    createNew
}
