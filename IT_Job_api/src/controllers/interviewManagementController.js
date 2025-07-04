import { StatusCodes } from 'http-status-codes'
import { interviewManagementService } from '~/services/interviewManagementService'

// Get all jobs with interview rounds
const getJobsWithInterviewRounds = async (req, res, next) => {
    try {
        const { employerId } = req.params

        if (!employerId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                errors: 'Employer ID is required'
            })
        }

        const jobs = await interviewManagementService.getJobsWithInterviewRounds(employerId)

        return res.status(StatusCodes.OK).json({
            jobs
        })
    } catch (error) {
        next(error)
    }
}

// Get qualified applicants for a job
const getQualifiedApplicants = async (req, res, next) => {
    try {
        const { jobId } = req.params

        if (!jobId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                errors: 'Job ID is required'
            })
        }

        const applicants = await interviewManagementService.getQualifiedApplicants(jobId)

        return res.status(StatusCodes.OK).json({
            applicants
        })
    } catch (error) {
        next(error)
    }
}

// Get all interviews for a job
const getInterviewsByJobId = async (req, res, next) => {
    try {
        const { jobId } = req.params

        if (!jobId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                errors: 'Job ID is required'
            })
        }

        const interviews = await interviewManagementService.getInterviewsByJobId(jobId)

        return res.status(StatusCodes.OK).json({
            interviews
        })
    } catch (error) {
        next(error)
    }
}

// Create a new interview round
const createInterviewRound = async (req, res, next) => {
    try {
        const { jobId } = req.params
        const roundData = req.body

        if (!jobId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                errors: 'Job ID is required'
            })
        }

        if (!roundData.name || !roundData.order) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                errors: 'Round name and order are required'
            })
        }

        const newRound = await interviewManagementService.createInterviewRound(jobId, roundData)

        return res.status(StatusCodes.CREATED).json({
            round: newRound
        })
    } catch (error) {
        next(error)
    }
}

// Save interview (create, edit, or evaluate)
const saveInterview = async (req, res, next) => {
    try {
        const { dialogType, formData, jobId, applicantId, roundId, interviewId } = req.body

        if (!dialogType || !jobId || !applicantId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                errors: 'Dialog type, job ID, and applicant ID are required'
            })
        }

        // Get job and applicant details
        const job = { id: jobId }
        const applicant = { id: applicantId }

        // Get interview if editing or evaluating
        let interview = null
        if (interviewId) {
            interview = { id: interviewId }
        }

        const result = await interviewManagementService.saveInterview(
            dialogType,
            formData,
            job,
            applicant,
            roundId,
            interview
        )

        return res.status(StatusCodes.OK).json({
            result
        })
    } catch (error) {
        next(error)
    }
}

// Delete an interview
const deleteInterview = async (req, res, next) => {
    try {
        const { interviewId } = req.params

        if (!interviewId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                errors: 'Interview ID is required'
            })
        }

        const result = await interviewManagementService.deleteInterview(interviewId)

        return res.status(StatusCodes.OK).json({
            message: 'Interview deleted successfully',
            result
        })
    } catch (error) {
        next(error)
    }
}

// Send interview invitation
const sendInvitation = async (req, res, next) => {
    try {
        const { interviewId } = req.params

        if (!interviewId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                errors: 'Interview ID is required'
            })
        }

        const result = await interviewManagementService.sendInvitation(interviewId)

        return res.status(StatusCodes.OK).json({
            message: 'Invitation sent successfully',
            result
        })
    } catch (error) {
        next(error)
    }
}

// Get applicants for a specific round
const getApplicantsForRound = async (req, res, next) => {
    try {
        const { jobId, roundId } = req.params

        if (!jobId || !roundId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                errors: 'Job ID and Round ID are required'
            })
        }

        const applicants = await interviewManagementService.getApplicantsForRound(jobId, roundId)

        return res.status(StatusCodes.OK).json({
            applicants
        })
    } catch (error) {
        next(error)
    }
}

// Get interviews for a specific round
const getRoundInterviews = async (req, res, next) => {
    try {
        const { jobId, roundId } = req.params

        if (!jobId || !roundId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                errors: 'Job ID and Round ID are required'
            })
        }

        const interviews = await interviewManagementService.getRoundInterviews(jobId, roundId)

        return res.status(StatusCodes.OK).json({
            interviews
        })
    } catch (error) {
        next(error)
    }
}

// Get applicant by ID
const getApplicantById = async (req, res, next) => {
    try {
        const { applicantId } = req.params

        if (!applicantId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                errors: 'Applicant ID is required'
            })
        }

        const applicant = await interviewManagementService.getApplicantById(applicantId)

        return res.status(StatusCodes.OK).json({
            applicant
        })
    } catch (error) {
        next(error)
    }
}

const getQualifiedApplicantsByEmployer = async (req, res, next) => {
    try {
        const { employerId } = req.params; // Lấy employerId từ URL parameters

        if (!employerId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                errors: 'Employer ID is required'
            });
        }

        const applicants = await interviewManagementService.getQualifiedApplicantsByEmployerId(employerId) //

        return res.status(StatusCodes.OK).json({
            applicants // Trả về danh sách applicants
        });
    } catch (error) {
        next(error); // Chuyển lỗi cho middleware xử lý lỗi
    }
};

export const interviewManagementController = {
    getJobsWithInterviewRounds,
    getQualifiedApplicants,
    getInterviewsByJobId,
    createInterviewRound,
    saveInterview,
    deleteInterview,
    sendInvitation,
    getApplicantsForRound,
    getRoundInterviews,
    getApplicantById,
    getQualifiedApplicantsByEmployer
}