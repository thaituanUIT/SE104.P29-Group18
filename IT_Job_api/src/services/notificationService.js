import { userModel } from '~/models/userModel'
import { notificationModel } from '~/models/notificationModel'

const notifyFollowers = async (data) => {
    const allUsers = await userModel.getAllUsers()
    const followers = allUsers.filter(user =>
        Array.isArray(user.saveCompany) && user.saveCompany.includes(data.employerId)
    )

    if (!followers.length) return

    const notifications = followers.map(user => ({
        userEmail: user.email,
        title: data.jobTitle,
        companyName: data.companyName,
        logoURL: data.logoURL,
        jobId: data.jobId,
        companyId: data.employerId,
        isRead: false,
        createdAt: new Date()
    }))

    await notificationModel.insertMany(notifications)
    return notifications
}

const getNotificationsByEmail = async (email) => {
    return await notificationModel.getByUserEmail(email)
}

const markNotificationsAsRead = async (email) => {
    return await notificationModel.markAllAsRead(email)
}

export const notificationService = {
    notifyFollowers,
    getNotificationsByEmail,
    markNotificationsAsRead
}