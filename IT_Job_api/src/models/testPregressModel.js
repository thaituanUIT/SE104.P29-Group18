import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import Joi from 'joi'

const TEST_PROGRESS_COLLECTION_NAME = 'testProgress'

const TEST_PROGRESS_COLLECTION_SCHEMA = Joi.object({
    applicationId: Joi.string()
        .required()
        .custom((value, helpers) => {
            if (!ObjectId.isValid(value)) {
                return helpers.error('any.invalid', { message: 'applicationId must be a valid ObjectId' })
            }
            return new ObjectId(value)
        }),
    testSeriesId: Joi.string()
        .required()
        .custom((value, helpers) => {
            if (!ObjectId.isValid(value)) {
                return helpers.error('any.invalid', { message: 'testSeriesId must be a valid ObjectId' })
            }
            return new ObjectId(value)
        }),
    status: Joi.string().default('Chưa gửi'),
    score: Joi.number().allow(null),
    result: Joi.string().valid('Đạt', 'Không đạt', null).default(null),
    round: Joi.number().default(1),
    comments: Joi.string().allow('', null),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
    return await TEST_PROGRESS_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        const newTestProgress = await GET_DB().collection(TEST_PROGRESS_COLLECTION_NAME).insertOne(validData)
        return newTestProgress
    } catch (error) {
        throw new Error(error)
    }
}

const findByApplicationId = async (applicationId) => {
    try {
        const testProgress = await GET_DB()
            .collection(TEST_PROGRESS_COLLECTION_NAME)
            .find({ applicationId: new ObjectId(applicationId), _destroy: false })
            .toArray()
        return testProgress
    } catch (error) {
        throw new Error(error)
    }
}

const findByTestSeriesId = async (testSeriesId) => {
    try {
        const testProgress = await GET_DB()
            .collection(TEST_PROGRESS_COLLECTION_NAME)
            .find({ testSeriesId: new ObjectId(testSeriesId), _destroy: false })
            .toArray()
        return testProgress
    } catch (error) {
        throw new Error(error)
    }
}

const update = async (progressId, progressData) => {
    try {
        const result = await GET_DB()
            .collection(TEST_PROGRESS_COLLECTION_NAME)
            .findOneAndUpdate({ _id: new ObjectId(progressId) }, { $set: progressData }, { returnDocument: 'after' })
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const findOneById = async (progressId) => {
    try {
        const progress = await GET_DB()
            .collection(TEST_PROGRESS_COLLECTION_NAME)
            .findOne({ _id: new ObjectId(progressId) })
        return progress
    } catch (error) {
        throw new Error(error)
    }
}

const findByTestSeriesIdAndRound = async (testSeriesId, round) => {
    try {
        const testProgress = await GET_DB()
            .collection(TEST_PROGRESS_COLLECTION_NAME)
            .find({
                testSeriesId: new ObjectId(testSeriesId),
                round: Number(round),
                _destroy: false
            })
            .toArray()
        return testProgress
    } catch (error) {
        throw new Error(error)
    }
}

export const testProgressModel = {
    TEST_PROGRESS_COLLECTION_NAME,
    createNew,
    findByApplicationId,
    findByTestSeriesId,
    update,
    findOneById,
    findByTestSeriesIdAndRound
}
