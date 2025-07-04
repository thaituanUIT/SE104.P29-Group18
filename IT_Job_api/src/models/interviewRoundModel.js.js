import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import Joi from 'joi'

const INTERVIEW_ROUND_COLLECTION_NAME = 'interviewRounds'

const INTERVIEW_ROUND_COLLECTION_SCHEMA = Joi.object({
    jobId: Joi.string().required().custom((value, helpers) => {
        if (!ObjectId.isValid(value)) {
            return helpers.error('any.invalid', { message: 'jobId must be a valid ObjectId' })
        }
        return new ObjectId(value)
    }),
    name: Joi.string().required(),
    order: Joi.number().required(),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
    return await INTERVIEW_ROUND_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        const newInterviewRound = await GET_DB().collection(INTERVIEW_ROUND_COLLECTION_NAME).insertOne(validData)
        return newInterviewRound
    } catch (error) {
        throw new Error(error)
    }
}

const findByJobId = async (jobId) => {
    try {
        const interviewRounds = await GET_DB()
            .collection(INTERVIEW_ROUND_COLLECTION_NAME)
            .find({ jobId: new ObjectId(jobId), _destroy: false })
            .sort({ order: 1 })
            .toArray()
        return interviewRounds
    } catch (error) {
        throw new Error(error)
    }
}

const findOneById = async (roundId) => {
    try {
        const round = await GET_DB()
            .collection(INTERVIEW_ROUND_COLLECTION_NAME)
            .findOne({ _id: new ObjectId(roundId), _destroy: false })
        return round
    } catch (error) {
        throw new Error(error)
    }
}

const update = async (roundId, updateData) => {
    try {
        const result = await GET_DB()
            .collection(INTERVIEW_ROUND_COLLECTION_NAME)
            .findOneAndUpdate(
                { _id: new ObjectId(roundId) },
                { $set: { ...updateData, updatedAt: new Date() } },
                { returnDocument: 'after' }
            )
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const deleteRound = async (roundId) => {
    try {
        const result = await GET_DB()
            .collection(INTERVIEW_ROUND_COLLECTION_NAME)
            .findOneAndUpdate(
                { _id: new ObjectId(roundId) },
                { $set: { _destroy: true, updatedAt: new Date() } },
                { returnDocument: 'after' }
            )
        return result
    } catch (error) {
        throw new Error(error)
    }
}

export const interviewRoundModel = {
    INTERVIEW_ROUND_COLLECTION_NAME,
    createNew,
    findByJobId,
    findOneById,
    update,
    deleteRound
}