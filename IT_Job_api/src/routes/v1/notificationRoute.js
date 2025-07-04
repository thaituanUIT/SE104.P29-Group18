import express from 'express'
import { notificationController } from '~/controllers/notificationController'

const Router = express.Router()

Router.route('/createNewNoti')
    .post(notificationController.notifyFollowers)

Router.route('/getNotifications')
    .get(notificationController.getJobNotifications)

Router.route('/mark-read')
    .post(notificationController.markAllJobNotificationsAsRead)

export const notiRoute = Router