import express from 'express'
import { applyController } from '~/controllers/applyController'
import { uploadMiddleware } from '~/middlewares/uploadMiddleware' // middleware multer xử lý file

const Router = express.Router()

Router.route('/applyNewJob')
    .post(uploadMiddleware.upload.single('cv'), applyController.applyJob)

Router.route('/applied-jobs')
    .get(applyController.getAppliedJobs)

Router.route('/applied/:email')
    .get(applyController.getAppliedJobsByEmail)

Router.route('/getApplicationGrouped')
    .get(applyController.getApplicationsByEmailGrouped)

// Check if user has applied to a job
Router.route('/check/:email/:jobId')
    .get(applyController.checkIfApplied)

// Get all applications for an employer in CV phase
Router.route('/employer-cvPhase/:employerId')
    .get(applyController.getApplicationsByEmployerIdInCVPhase)

Router.route('/employer-interviewPhase/:employerId')
    .get(applyController.getApplicationsInInterviewPhaseByEmployer)

// Get all applications for an employer
Router.route('/employer/:employerId')
    .get(applyController.getApplicationsByEmployerId)

    // Get all applications for an employer
Router.route('/employer/fetchApplicant/:employerId')
    .get(applyController.getApplicationsByEmployerIdDashboard)

// Get all applications for a job
Router.route('/job/:jobId')
    .get(applyController.getApplicationsByJobId)

//move applicant to new Round
Router.route('/moveToInterviewRoute/:applicantId')
    .post(applyController.moveApplicantToInterviewRound)

// Update application status
Router.route('/:applicationId/status')
    .post(applyController.updateApplicationStatus)

// Delete an application
Router.route('/:applicationId')
    .get(applyController.getApplicationById)
    .delete(applyController.deleteApplication)

export const applyRoute = Router