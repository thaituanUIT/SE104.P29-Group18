import { notificationService } from '~/services/notificationService'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const notifyFollowers = async(req, res) => {

    
    console.log("conacaca",req.body)
    const respone = await notificationService.notifyFollowers(req.body)
    res.status(StatusCodes.OK).json(respone)
}

const getJobNotifications = async (req, res) => {
    const { email } = req.query
    if (!email) throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing email')
        console.log(email)
    const notifications = await notificationService.getNotificationsByEmail(email)
    res.status(StatusCodes.OK).json(notifications)
}

const markAllJobNotificationsAsRead = async (req, res) => {
    const { email } = req.body
    if (!email) throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing email')

    await notificationService.markNotificationsAsRead(email)
    res.status(StatusCodes.OK).json({ message: 'Marked all as read' })
}

export const notificationController = {
    getJobNotifications,
    markAllJobNotificationsAsRead,
    notifyFollowers
}