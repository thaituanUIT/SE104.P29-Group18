import express from 'express'
import { interviewManagementController } from '~/controllers/interviewManagementController'

const router = express.Router()

// Get all jobs with interview rounds
router.get('/jobs/:employerId', interviewManagementController.getJobsWithInterviewRounds)

// Get qualified applicants for a job
router.get('/applicants/:jobId', interviewManagementController.getQualifiedApplicants)

// Get all interviews for a job
router.get('/interviews/:jobId', interviewManagementController.getInterviewsByJobId)

// Create a new interview round
router.post('/rounds/:jobId', interviewManagementController.createInterviewRound)

// Save interview (create, edit, or evaluate)
router.post('/interviews', interviewManagementController.saveInterview)

// Delete an interview
router.delete('/interviews/:interviewId', interviewManagementController.deleteInterview)

// Send interview invitation
router.post('/interviews/:interviewId/send-invitation', interviewManagementController.sendInvitation)

// Get applicants for a specific round
router.get('/rounds/:jobId/:roundId/applicants', interviewManagementController.getApplicantsForRound)

// Get interviews for a specific round
router.get('/rounds/:jobId/:roundId/interviews', interviewManagementController.getRoundInterviews)

// Get applicant by ID
router.get('/applicant/:applicantId', interviewManagementController.getApplicantById)

router.get('/qualified-applicants-by-employer/:employerId', interviewManagementController.getQualifiedApplicantsByEmployer)

export const interviewManagementRoute = router