import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import Joi from 'joi'

const TEST_COLLECTION_NAME = 'tests'

const TEST_COLLECTION_SCHEMA = Joi.object({
    jobId: Joi.string()
        .required()
        .custom((value, helpers) => {
            if (!ObjectId.isValid(value)) {
                return helpers.error('any.invalid', { message: 'jobId must be a valid ObjectId' })
            }
            return new ObjectId(value)
        }),
    testSeriesId: Joi.required().custom((value,helpers) => {
        if (!ObjectId.isValid(value)) {
            return helpers.error('any.invalid', {message: 'testSeriesid must be a valid ObjectId'})
        }
        return new ObjectId(value)
    }),
    name: Joi.string().required(),
    description: Joi.string().allow(''),
    type: Joi.string().required(),
    link: Joi.string().required(),
    deadline: Joi.date().required(),
    maxScore: Joi.number().min(0).required(),
    passingScore: Joi.number().min(0).max(Joi.ref('maxScore')).required(),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
    return await TEST_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        const newTest = await GET_DB().collection(TEST_COLLECTION_NAME).insertOne(validData)
        return newTest
    } catch (error) {
        throw new Error(error)
    }
}

const findByJobId = async (jobId) => {
    try {
        const tests = await GET_DB()
            .collection(TEST_COLLECTION_NAME)
            .find({ jobId: new ObjectId(jobId), _destroy: false })
            .toArray()
        return tests
    } catch (error) {
        throw new Error(error)
    }
}

const findByJobIdAndTestSeriesId = async (jobId, testSeriesId) => {
    try {
        const tests = await GET_DB()
            .collection(TEST_COLLECTION_NAME)
            .find({
                jobId: new ObjectId(jobId),
                testSeriesId: new ObjectId(testSeriesId),
                _destroy: false
            })
            .toArray()
        return tests
    } catch (error) {
        throw new Error(error)
    }
}

const findOneById = async (testId) => {
    try {
        const test = await GET_DB()
            .collection(TEST_COLLECTION_NAME)
            .findOne({ _id: new ObjectId(testId) })
        return test
    } catch (error) {
        throw new Error(error)
    }
}

const update = async (testId, testData) => {
    try {
        const result = await GET_DB()
            .collection(TEST_COLLECTION_NAME)
            .findOneAndUpdate({ _id: new ObjectId(testId) }, { $set: testData }, { returnDocument: 'after' })
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const deleteTest = async (testId) => {
    try {
        const result = await GET_DB()
            .collection(TEST_COLLECTION_NAME)
            .findOneAndUpdate(
                { _id: new ObjectId(testId) },
                { $set: { _destroy: true, updatedAt: Date.now() } },
                { returnDocument: 'after' }
            )
        return result
    } catch (error) {
        throw new Error(error)
    }
}

export const testModel = {
    TEST_COLLECTION_NAME,
    createNew,
    findByJobId,
    findByJobIdAndTestSeriesId,
    findOneById,
    update,
    deleteTest
}
