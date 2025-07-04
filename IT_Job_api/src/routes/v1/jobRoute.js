import express from 'express'
import { jobController } from '~/controllers/jobController'
import { jobValidation } from '~/validations/jobValidation'
import { authMiddleware } from '~/middlewares/authEmployer'

const Router = express.Router()

// Router.route('/getAllJobOfCompany')
//     .get(jobController.getAllJobOfCompany)

Router.route('/createNewJob')
    .post(authMiddleware.isAuthorized, jobValidation.createNew, jobController.createNewJob)

Router.route('/findJob')
    .get(jobController.getAllJobs)

Router.route('/by-employer/:employerId')
    .get(authMiddleware.isAuthorized, jobController.getJobsByEmployerId)

Router.route('/getNewJobs')
    .get(jobController.getNewJobs)

Router.route('/multiple')
    .get(jobController.getJobsByIds)

Router.route('/:id')
    .get( jobController.getJobById)

export const jobRoute = Router