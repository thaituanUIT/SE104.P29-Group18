import express from 'express'
import { employerValidation } from '~/validations/employerValidation'
import { employerController } from '~/controllers/employerController'
import { authMiddleware } from '~/middlewares/authEmployer'
import { uploadMiddleware } from '~/middlewares/uploadMiddleware'

const Router = express.Router()

Router.route('/register')
    .post(employerValidation.createNew, employerController.createNew)

Router.route('/verify_account')
    .put(employerValidation.verify, employerController.verify)

Router.route('/login')
    .post(employerValidation.login, employerController.login)

Router.route('/logout')
    .delete(employerController.logout)

Router.route('/refresh_token')
    .put(employerController.refreshToken)

Router.route('/getEmployer')
    .get(employerController.getRandomEmployers)

Router.route('/updateEmployer')
    .put(authMiddleware.isAuthorized, uploadMiddleware.upload.fields([
        { name: 'logo', maxCount: 1 },
        { name: 'background', maxCount: 1 }
    ]), employerValidation.updateEmployer, employerController.updateEmployer)

Router.route('/:id')
    .get(employerController.getEmployerById)
export const employerRoute = Router