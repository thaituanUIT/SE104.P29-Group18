import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import Joi from 'joi'

const TEST_SERIES_COLLECTION_NAME = 'testSeries'

const TEST_SERIES_COLLECTION_SCHEMA = Joi.object({
    jobId: Joi.string()
        .required()
        .custom((value, helpers) => {
            if (!ObjectId.isValid(value)) {
                return helpers.error('any.invalid', { message: 'jobId must be a valid ObjectId' })
            }
            return new ObjectId(value)
        }),
    name: Joi.string().required(),
    order: Joi.number().required(),
    required: Joi.boolean().default(true),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
    return await TEST_SERIES_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        const newTestSeries = await GET_DB().collection(TEST_SERIES_COLLECTION_NAME).insertOne(validData)
        return newTestSeries
    } catch (error) {
        throw new Error(error)
    }
}

const findByJobId = async (jobId) => {
    try {
        const testSeries = await GET_DB()
            .collection(TEST_SERIES_COLLECTION_NAME)
            .find({ jobId: new ObjectId(jobId), _destroy: false })
            .sort({ order: 1 })
            .toArray()
        return testSeries
    } catch (error) {
        throw new Error(error)
    }
}

const findOneById = async (testSeriesId) => {
    try {
        const testSeries = await GET_DB()
            .collection(TEST_SERIES_COLLECTION_NAME)
            .findOne({ _id: new ObjectId(testSeriesId) })
        return testSeries
    } catch (error) {
        throw new Error(error)
    }
}

const update = async (testSeriesId, testSeriesData) => {
    try {
        const result = await GET_DB()
            .collection(TEST_SERIES_COLLECTION_NAME)
            .findOneAndUpdate({ _id: new ObjectId(testSeriesId) }, { $set: testSeriesData }, { returnDocument: 'after' })
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const deleteTestSeries = async (testSeriesId) => {
    try {
        const result = await GET_DB()
            .collection(TEST_SERIES_COLLECTION_NAME)
            .findOneAndUpdate(
                { _id: new ObjectId(testSeriesId) },
                { $set: { _destroy: true, updatedAt: Date.now() } },
                { returnDocument: 'after' }
            )
        return result
    } catch (error) {
        throw new Error(error)
    }
}

export const testSeriesModel = {
    TEST_SERIES_COLLECTION_NAME,
    createNew,
    findByJobId,
    findOneById,
    update,
    deleteTestSeries
}
