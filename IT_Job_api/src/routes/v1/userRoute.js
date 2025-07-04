import express from 'express'
import { userController } from '~/controllers/userController'
import { uploadMiddleware } from '~/middlewares/uploadMiddleware'

const Router = express.Router()

Router.route('/login')
    .post(userController.createNew)

Router.route('/save-job')
    .post(userController.toggleSaveJobController)

Router.route('/dashboard-overview')
    .get(userController.getDashboardOverview)

Router.route('/saved-jobs')
    .get(userController.getSavedJobsDetail)

Router.route('/followCompany')
    .post(userController.followCompanyController)

Router.route('/:userId')
    .get(userController.getUserById)
    .post(uploadMiddleware.upload.single('cv'), userController.updateProfile)


Router.route('/email/:email')
    .get(userController.getUserByEmail)

// Education
Router.route('/:userId/education')
    .post(userController.addEducation)

Router.route('/:userId/education/:educationId')
    .post(userController.updateEducation)
    .delete(userController.deleteEducation)

// Experience
Router.route('/:userId/experience')
    .post(userController.addExperience)

Router.route('/:userId/experience/:experienceId')
    .post(userController.updateExperience)
    .delete(userController.deleteExperience)

// Certificates
Router.route('/:userId/certificates')
    .post(userController.addCertificate)

Router.route('/:userId/certificates/:certificateId')
    .post(userController.updateCertificate)
    .delete(userController.deleteCertificate)

Router.route('/:userId')
    .get(userController.getUserById)
    .post(uploadMiddleware.upload.single('cv'), userController.updateProfile)


export const userRoutes = Router