import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { EMAIL_RULE, PHONE_NUMBER_RULE, EMAIL_RULE_MESSAGE, PHONE_NUMBER_RULE_MESSAGE } from '~/utils/validator'


const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        employerId: Joi.string().required(),
        title: Joi.string().required(),
        position: Joi.string().required(),
        workplace: Joi.string()
            .valid('remote', 'at-office', 'hybrid')
            .required(),
        jobType: Joi.string()
            .valid('full-time', 'part-time', 'internship')
            .required(),
        salary: Joi.object({
            min: Joi.number().min(0).required(),
            max: Joi.number().min(Joi.ref('min')).required()
        }).required(),
        deadline: Joi.date().iso().required(),
        jobDescription: Joi.string().required(),
        jobRequirement: Joi.string().required(),
        benefits: Joi.string().required(),
        locations: Joi.array().items(Joi.string()).min(1).required(),
        skills: Joi.array().items(Joi.string()).min(1).max(3).required(),
        acceptFresher: Joi.boolean().required()

    })

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    }
}


export const jobValidation = {
    createNew

}