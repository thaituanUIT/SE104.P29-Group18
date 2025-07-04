import { GET_DB } from '~/config/mongodb'
import Joi from 'joi'

const NOTIFICATION_COLLECTION_NAME = 'notifications'

const NOTIFICATION_COLLECTION_SCHEMA = Joi.object({
    userEmail: Joi.string().email().required(),
    title: Joi.string().required(),
    companyName: Joi.string().required(),
    logoURL: Joi.string(),
    jobId: Joi.string().required(),
    companyId: Joi.string().required(),
    isRead: Joi.boolean().default(false),
    createdAt: Joi.date().default(() => new Date())
})

const validateBeforeCreate = async (data) => {
    return await NOTIFICATION_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const insertMany = async (notifications) => {
    const validated = await Promise.all(notifications.map(validateBeforeCreate))
    console.log(validated)
    return await GET_DB().collection(NOTIFICATION_COLLECTION_NAME).insertMany(validated)
}

const getByUserEmail = async (email) => {
    return await GET_DB().collection(NOTIFICATION_COLLECTION_NAME)
        .find({ userEmail: email })
        .sort({ createdAt: -1 })
        .limit(30)
        .toArray()
}

const markAllAsRead = async (email) => {
    return await GET_DB().collection(NOTIFICATION_COLLECTION_NAME).updateMany(
        { userEmail: email, isRead: false },
   { $set: { isRead: true } }
    )
}

export const notificationModel = {
    insertMany,
    getByUserEmail,
    markAllAsRead
}
