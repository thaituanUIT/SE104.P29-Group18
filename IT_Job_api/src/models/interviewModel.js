import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import Joi from 'joi'

const INTERVIEW_COLLECTION_NAME = 'interviews'

const INTERVIEW_COLLECTION_SCHEMA = Joi.object({
    jobId: Joi.string().required().custom((value, helpers) => {
        if (!ObjectId.isValid(value)) {
            return helpers.error('any.invalid', { message: 'jobId must be a valid ObjectId' })
        }
        return new ObjectId(value)
    }),
    applicantId: Joi.string().required().custom((value, helpers) => {
        if (!ObjectId.isValid(value)) {
            return helpers.error('any.invalid', { message: 'applicantId must be a valid ObjectId' })
        }
        return new ObjectId(value)
    }),
    roundId: Joi.string().required().custom((value, helpers) => {
        if (!ObjectId.isValid(value)) {
            return helpers.error('any.invalid', { message: 'roundId must be a valid ObjectId' })
        }
        return new ObjectId(value)
    }),
    date: Joi.date().required(),
    type: Joi.string().valid('Online', 'Offline').required(),
    platform: Joi.string().when('type', {
        is: 'Online',
        then: Joi.string().required(),
        otherwise: Joi.string().allow('').optional()
    }),
    link: Joi.string().when('type', {
        is: 'Online',
        then: Joi.string().required(),
        otherwise: Joi.string().allow('').optional()
    }),
    location: Joi.string().when('type', {
        is: 'Offline',
        then: Joi.string().required(),
        otherwise: Joi.string().allow('').optional()
    }),
    interviewers: Joi.array().items(Joi.string()).default([]),
    notes: Joi.string().allow('').default(''),
    status: Joi.string().valid('Chờ xác nhận', 'Đã xác nhận', 'Đã hoàn thành', 'Đã hủy').default('Chờ xác nhận'),
    evaluation: Joi.object({
        result: Joi.string().valid('Đạt', 'Không đạt').required(),
        strengths: Joi.string().allow('').default(''),
        weaknesses: Joi.string().allow('').default(''),
        comments: Joi.string().allow('').default('')
    }).optional().allow(null),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
    return await INTERVIEW_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        const newInterview = await GET_DB().collection(INTERVIEW_COLLECTION_NAME).insertOne(validData)
        return newInterview
    } catch (error) {
        throw new Error(error)
    }
}

const findByJobId = async (jobId) => {
    try {
        const interviews = await GET_DB()
            .collection(INTERVIEW_COLLECTION_NAME)
            .find({ jobId: new ObjectId(jobId), _destroy: false })
            .toArray()
        return interviews
    } catch (error) {
        throw new Error(error)
    }
}

const findByApplicantId = async (applicantId) => {
    try {
        const interviews = await GET_DB()
            .collection(INTERVIEW_COLLECTION_NAME)
            .find({ applicantId: new ObjectId(applicantId), _destroy: false })
            .toArray()
        return interviews
    } catch (error) {
        throw new Error(error)
    }
}

const findByRoundId = async (roundId) => {
    try {
        const interviews = await GET_DB()
            .collection(INTERVIEW_COLLECTION_NAME)
            .find({ roundId: new ObjectId(roundId), _destroy: false })
            .toArray()
        return interviews
    } catch (error) {
        throw new Error(error)
    }
}

const findOneById = async (interviewId) => {
    try {
        const interview = await GET_DB()
            .collection(INTERVIEW_COLLECTION_NAME)
            .findOne({ _id: new ObjectId(interviewId), _destroy: false })
        return interview
    } catch (error) {
        throw new Error(error)
    }
}

const update = async (interviewId, updateData) => {
    try {
        const result = await GET_DB()
            .collection(INTERVIEW_COLLECTION_NAME)
            .findOneAndUpdate(
                { _id: new ObjectId(interviewId) },
                { $set: { ...updateData, updatedAt: new Date() } },
                { returnDocument: 'after' }
            )
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const deleteInterview = async (interviewId) => {
    try {
        const result = await GET_DB()
            .collection(INTERVIEW_COLLECTION_NAME)
            .findOneAndUpdate(
                { _id: new ObjectId(interviewId) },
                { $set: { _destroy: true, updatedAt: new Date() } },
                { returnDocument: 'after' }
            )
        return result
    } catch (error) {
        throw new Error(error)
    }
}

export const interviewModel = {
    INTERVIEW_COLLECTION_NAME,
    createNew,
    findByJobId,
    findByApplicantId,
    findByRoundId,
    findOneById,
    update,
    deleteInterview
}