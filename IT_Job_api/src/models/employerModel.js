import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import Joi from 'joi'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE } from '~/utils/validator'

const EMPLOYER_COLLECTION_NAME = 'employers'

const EMPLOYER_COLLECTION_SCHEMA = Joi.object({
    email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    password: Joi.string().required(),

    fullName: Joi.string().required().trim().strict(),
    phoneNumber: Joi.string().required().trim(),
    position: Joi.string().min(3).max(100).strict().required(),
    workEmail: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE).required(),
    companyName: Joi.string().required().trim(),
    companyLocation: Joi.string().min(3).max(50).required(),
    companyURL: Joi.string().required(),
    companyCountry: Joi.string().min(3).max(100).required(),

    role: Joi.string().valid('employer', 'admin').default('employer'),

    isActive: Joi.boolean().default(false),
    verifyToken: Joi.string(),
    tokenLinkExpiration: Joi.date().timestamp('javascript'),

    logoURL: Joi.string(),
    backgroundURL: Joi.string(),

    createAt: Joi.date().timestamp('javascript').default(Date.now),
    updateAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})


const validateBeforeCreate = async (data) => {
    return await EMPLOYER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        const newEmployer = await GET_DB().collection(EMPLOYER_COLLECTION_NAME).insertOne(validData)
        return newEmployer
    } catch (error) {
        throw new Error(error)
    }
}

const findOneById = async (employerId) => {
    try {
        const employer = await GET_DB()
            .collection(EMPLOYER_COLLECTION_NAME)
            .findOne({ _id: new ObjectId(employerId) })
        return employer
    } catch (error) {
        throw new Error(error)
    }
}

const findOneByEmail = async (employerMail) => {
    try {
        const employer = await GET_DB().collection(EMPLOYER_COLLECTION_NAME).findOne({ email: employerMail })
        return employer
    } catch (error) {
        throw new Error(error)
    }
}

const update = async (employerId, employerData) => {
    try {
        const employer = await GET_DB().collection(EMPLOYER_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(employerId) },
            { $set: employerData },
            { returnDocument: 'after' }
        )
        return employer
    } catch (error) {
        throw new Error(error)
    }
}

const findByIds = async (ids) => {
    const objectIds = ids.map(id => new ObjectId(id))
    return await GET_DB().collection('employers')
        .find({ _id: { $in: objectIds } })
        .toArray()
}

const findRandomEmployers = async () => {
    try {
        const employers = await GET_DB()
            .collection(EMPLOYER_COLLECTION_NAME)
            .aggregate([{ $sample: { size: 5 } }])
            .toArray()

        console.log("heheh")
        return employers
    } catch (error) {
        throw new Error(error)
    }
}


export const employerModel = {
    EMPLOYER_COLLECTION_NAME,
    EMPLOYER_COLLECTION_SCHEMA,
    createNew,
    findOneByEmail,
    findOneById,
    update,
    findByIds,
    findRandomEmployers
}
