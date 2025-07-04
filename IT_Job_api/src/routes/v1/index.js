import express from 'express'
import { userRoutes } from './userRoute'
import { employerRoute } from './employerRoute'
import { jobRoute } from './jobRoute'
import { applyRoute } from './appliesRoute'
import { StatusCodes } from 'http-status-codes'
import { testRoutes } from './testRoutes'
import { interviewManagementRoute } from './interviewManagementRoute.js'
import { notiRoute } from './notificationRoute'

const Router = express.Router()

Router.get('/status', (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'Connected to API', code: StatusCodes.OK })
})

Router.use('/users', userRoutes)
Router.use('/employers', employerRoute)
Router.use('/jobs', jobRoute)
Router.use('/apply', applyRoute)
Router.use('/tests', testRoutes)
Router.use('/interview-management', interviewManagementRoute)
Router.use('/notifications', notiRoute)

export const v1Router = Router