import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import Joi from 'joi'

const APPLICANT_PROGRESS_COLLECTION_NAME = 'applicantProgress'

const APPLICANT_PROGRESS_COLLECTION_SCHEMA = Joi.object({
    applicantId: Joi.string().required().custom((value, helpers) => {
        if (!ObjectId.isValid(value)) {
            return helpers.error('any.invalid', { message: 'applicantId must be a valid ObjectId' })
        }
        return new ObjectId(value)
    }),
    jobId: Joi.string().required().custom((value, helpers) => {
        if (!ObjectId.isValid(value)) {
            return helpers.error('any.invalid', { message: 'jobId must be a valid ObjectId' })
        }
        return new ObjectId(value)
    }),
    currentRound: Joi.string().custom((value, helpers) => {
        if (!ObjectId.isValid(value)) {
            return helpers.error('any.invalid', { message: 'currentRound must be a valid ObjectId' })
        }
        return new ObjectId(value)
    }).allow(null),
    currentOverallStatus: Joi.string().valid(
        'Đạt',
        'Không đạt',
        'Đang đánh giá',
        'Chờ phỏng vấn',
    ).default('Đang đánh giá'),
    interviewProgress: Joi.array().items(
        Joi.object({
            roundId: Joi.string().required().custom((value, helpers) => {
                if (!ObjectId.isValid(value)) {
                    return helpers.error('any.invalid', { message: 'roundId must be a valid ObjectId' })
                }
                return new ObjectId(value)
            }),
            status: Joi.string().valid('Chờ xác nhận', 'Đã xác nhận', 'Đã hoàn thành', null).allow(null),
            result: Joi.string().valid('Đạt', 'Không đạt', null).allow(null)
        })
    ).default([]),
    skills: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            rating: Joi.number().min(1).max(5).required()
        })
    ).default([]),
    overallNotes: Joi.string().allow('').default(''),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
    return await APPLICANT_PROGRESS_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        const newProgress = await GET_DB().collection(APPLICANT_PROGRESS_COLLECTION_NAME).insertOne(validData)
        return newProgress
    } catch (error) {
        throw new Error(error)
    }
}

const findByApplicantAndJob = async (applicantId, jobId) => {
    try {
        const progress = await GET_DB()
            .collection(APPLICANT_PROGRESS_COLLECTION_NAME)
            .findOne({
                applicantId: new ObjectId(applicantId),
                jobId: new ObjectId(jobId),
                _destroy: false
            })
        return progress
    } catch (error) {
        throw new Error(error)
    }
}

const findByJobId = async (jobId) => {
    try {
        const progress = await GET_DB()
            .collection(APPLICANT_PROGRESS_COLLECTION_NAME)
            .find({
                jobId: new ObjectId(jobId),
                _destroy: false
            })
            .toArray()
        return progress
    } catch (error) {
        throw new Error(error)
    }
}

const update = async (progressId, updateData) => {
    try {
        const result = await GET_DB()
            .collection(APPLICANT_PROGRESS_COLLECTION_NAME)
            .findOneAndUpdate(
                { _id: new ObjectId(progressId) },
                { $set: { ...updateData, updatedAt: new Date() } },
                { returnDocument: 'after' }
            )
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const updateByApplicantAndJob = async (applicantId, jobId, updateData) => {
    try {
        const result = await GET_DB()
            .collection(APPLICANT_PROGRESS_COLLECTION_NAME)
            .findOneAndUpdate(
                {
                    applicantId: new ObjectId(applicantId),
                    jobId: new ObjectId(jobId),
                    _destroy: false
                },
                { $set: { ...updateData, updatedAt: new Date() } },
                { returnDocument: 'after' }
            )
        return result
    } catch (error) {
        throw new Error(error)
    }
}

export const interviewApplicantProgressModel = {
    APPLICANT_PROGRESS_COLLECTION_NAME,
    createNew,
    findByApplicantAndJob,
    findByJobId,
    update,
    updateByApplicantAndJob
}