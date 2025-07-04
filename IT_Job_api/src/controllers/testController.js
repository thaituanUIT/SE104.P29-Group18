import { StatusCodes } from 'http-status-codes'
import { testService } from '~/services/testService'
import { applyService } from '~/services/applyService'

// Test Series Controllers
const createTestSeries = async (req, res, next) => {
    try {
        const result = await testService.createTestSeries(req.body)
        res.status(StatusCodes.CREATED).json({
            status: 'success',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const getTestSeriesByJobId = async (req, res, next) => {
    try {
        const { jobId } = req.params
        const testSeries = await testService.getTestSeriesByJobId(jobId)
        res.status(StatusCodes.OK).json({
            status: 'success',
            data: testSeries
        })
    } catch (error) {
        next(error)
    }
}

const updateTestSeries = async (req, res, next) => {
    try {
        const { testSeriesId } = req.params
        const result = await testService.updateTestSeries(testSeriesId, req.body)
        res.status(StatusCodes.OK).json({
            status: 'success',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const deleteTestSeries = async (req, res, next) => {
    try {
        const { testSeriesId } = req.params
        const result = await testService.deleteTestSeries(testSeriesId)
        res.status(StatusCodes.OK).json({
            status: 'success',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

// Test Controllers
const createTest = async (req, res, next) => {
    try {
        const result = await testService.createTest(req.body)
        res.status(StatusCodes.CREATED).json({
            status: 'success',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const getTestsByJobId = async (req, res, next) => {
    try {
        const { jobId } = req.params
        const tests = await testService.getTestsByJobId(jobId)
        res.status(StatusCodes.OK).json({
            status: 'success',
            data: tests
        })
    } catch (error) {
        next(error)
    }
}

const getTestsByJobIdAndTestSeriesId = async (req, res, next) => {
    try {
        const { jobId, testSeriesId } = req.params
        const tests = await testService.getTestsByJobIdAndTestSeriesId(jobId, testSeriesId)
        res.status(StatusCodes.OK).json({
            status: 'success',
            data: tests
        })
    } catch (error) {
        next(error)
    }
}

const updateTest = async (req, res, next) => {
    try {
        const { testId } = req.params
        const result = await testService.updateTest(testId, req.body)
        res.status(StatusCodes.OK).json({
            status: 'success',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const deleteTest = async (req, res, next) => {
    try {
        const { testId } = req.params
        const result = await testService.deleteTest(testId)
        res.status(StatusCodes.OK).json({
            status: 'success',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

// Test Progress Controllers
const updateTestProgress = async (req, res, next) => {
    try {
        const { applicationId, testSeriesId } = req.params
        const result = await testService.updateTestProgress(applicationId, testSeriesId, req.body)

        // Check if the applicant has passed all required tests
        const application = await applyService.getApplicationById(applicationId)
        const passedAllRequired = await testService.checkApplicantPassedAllRequiredTests(applicationId, application.jobId)

        // If the applicant has passed all required tests, send interview invitation
        if (passedAllRequired) {
            await testService.sendInterviewInvitation(applicationId)
        }

        res.status(StatusCodes.OK).json({
            status: 'success',
            data: result,
            passedAllRequired
        })
    } catch (error) {
        next(error)
    }
}

const getTestProgressByApplicationId = async (req, res, next) => {
    try {
        const { applicationId } = req.params
        const testProgress = await testService.getTestProgressByApplicationId(applicationId)
        res.status(StatusCodes.OK).json({
            status: 'success',
            data: testProgress
        })
    } catch (error) {
        next(error)
    }
}

const getTestProgressByTestSeriesId = async (req, res, next) => {
    try {
        const { testSeriesId } = req.params
        const testProgress = await testService.getTestProgressByTestSeriesId(testSeriesId)
        res.status(StatusCodes.OK).json({
            status: 'success',
            data: testProgress
        })
    } catch (error) {
        next(error)
    }
}

// Email Controllers
const sendTestInvitation = async (req, res, next) => {
    try {
        const { applicationId, testSeriesId } = req.params
        const result = await testService.sendTestInvitation(applicationId, testSeriesId)
        res.status(StatusCodes.OK).json({
            status: 'success',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const sendTestInvitationToAll = async (req, res, next) => {
    try {
        const { jobId, testSeriesId } = req.params

        // Get all applications for this job
        const applications = await applyService.getApplicationsByJobId(jobId)

        // Send test invitation to all applicants
        const results = await Promise.all(
            applications.map((app) =>
                testService.sendTestInvitation(app.id, testSeriesId).catch((error) => ({
                    applicationId: app.id,
                    error: error.message
                }))
            )
        )

        res.status(StatusCodes.OK).json({
            status: 'success',
            data: {
                totalApplicants: applications.length,
                successCount: results.filter((r) => r.success).length,
                failedCount: results.filter((r) => r.error).length,
                results
            }
        })
    } catch (error) {
        next(error)
    }
}

export const testController = {
    // Test Series
    createTestSeries,
    getTestSeriesByJobId,
    updateTestSeries,
    deleteTestSeries,

    // Tests
    createTest,
    getTestsByJobId,
    getTestsByJobIdAndTestSeriesId,
    updateTest,
    deleteTest,

    // Test Progress
    updateTestProgress,
    getTestProgressByApplicationId,
    getTestProgressByTestSeriesId,

    // Email
    sendTestInvitation,
    sendTestInvitationToAll
}
