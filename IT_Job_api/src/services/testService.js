import { StatusCodes } from 'http-status-codes'
import { testModel } from '~/models/testModel'
import { testSeriesModel } from '~/models/testSeriesModel'
import { testProgressModel } from '~/models/testPregressModel'
import { applyModel } from '~/models/applyModel'
import { jobModel } from '~/models/jobModel'
import ApiError from '~/utils/ApiError'
import { BrevoProvider } from '~/providers/BrevoProvider'

// Test Series functions
const createTestSeries = async (data) => {
    try {
        const job = await jobModel.findOneById(data.jobId)
        if (!job) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Job not found')
        }

        const newTestSeries = await testSeriesModel.createNew({
            jobId: data.jobId,
            name: data.name,
            order: data.order,
            required: data.required
        })

        // Create test progress entries for all applicants of this job
        const applications = await applyModel.findByJobId(data.jobId)
        if (applications && applications.length > 0) {
            const progressPromises = applications.map((application) => {
                return testProgressModel.createNew({
                    applicationId: application._id.toString(),
                    testSeriesId: newTestSeries.insertedId.toString(),
                    status: 'Chưa gửi',
                    score: null,
                    result: null
                })
            })
            await Promise.all(progressPromises)
        }

        return newTestSeries
    } catch (error) {
        throw new ApiError(
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error.message || 'Error creating test series'
        )
    }
}

const getTestSeriesByJobId = async (jobId) => {
    try {
        const testSeries = await testSeriesModel.findByJobId(jobId)
        return testSeries
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to get test series')
    }
}

const updateTestSeries = async (testSeriesId, data) => {
    try {
        const testSeries = await testSeriesModel.findOneById(testSeriesId)
        if (!testSeries) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Test series not found')
        }

        const updatedTestSeries = await testSeriesModel.update(testSeriesId, {
            ...data,
            updatedAt: Date.now()
        })

        return updatedTestSeries
    } catch (error) {
        throw new ApiError(
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error.message || 'Error updating test series'
        )
    }
}

const deleteTestSeries = async (testSeriesId) => {
    try {
        const testSeries = await testSeriesModel.findOneById(testSeriesId)
        if (!testSeries) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Test series not found')
        }

        const result = await testSeriesModel.deleteTestSeries(testSeriesId)
        return result
    } catch (error) {
        throw new ApiError(
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error.message || 'Error deleting test series'
        )
    }
}

// Test functions
const createTest = async (data) => {
    try {
        const job = await jobModel.findOneById(data.jobId)
        if (!job) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Job not found')
        }

        const newTest = await testModel.createNew({
            jobId: data.jobId,
            testSeriesId: data.testSeriesId,
            name: data.name,
            description: data.description || '',
            type: data.type,
            link: data.link,
            deadline: new Date(data.deadline),
            maxScore: data.maxScore,
            passingScore: data.passingScore
        })

        return newTest
    } catch (error) {
        throw new ApiError(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'Error creating test')
    }
}

const getTestsByJobId = async (jobId) => {
    try {
        const tests = await testModel.findByJobId(jobId)
        return tests
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to get tests')
    }
}

const getTestsByJobIdAndTestSeriesId = async (jobId, testSeriesId) => {
    try {
        const tests = await testModel.findByJobIdAndTestSeriesId(jobId, testSeriesId)
        return tests
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to get tests')
    }
}

const updateTest = async (testId, data) => {
    try {
        const test = await testModel.findOneById(testId)
        if (!test) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Test not found')
        }

        const updatedTest = await testModel.update(testId, {
            ...data,
            updatedAt: Date.now()
        })

        return updatedTest
    } catch (error) {
        throw new ApiError(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'Error updating test')
    }
}

const deleteTest = async (testId) => {
    try {
        const test = await testModel.findOneById(testId)
        if (!test) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Test not found')
        }

        const result = await testModel.deleteTest(testId)
        return result
    } catch (error) {
        throw new ApiError(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'Error deleting test')
    }
}

// Test Progress functions
const updateTestProgress = async (applicationId, testSeriesId, data) => {
    try {
    // Find the test progress entry
        const testProgress = await testProgressModel.findByApplicationId(applicationId)
        const progressEntry = testProgress.find((p) => p.testSeriesId.toString() === testSeriesId)

        if (!progressEntry) {
            // Create a new progress entry if it doesn't exist
            const newProgress = await testProgressModel.createNew({
                applicationId,
                testSeriesId,
                status: data.status,
                score: data.score,
                result: data.result,
                comments: data.comments
            })
            return newProgress
        }

        // Update existing progress entry
        const updatedProgress = await testProgressModel.update(progressEntry._id, {
            status: data.status,
            score: data.score,
            result: data.result,
            comments: data.comments,
            updatedAt: Date.now()
        })

        return updatedProgress
    } catch (error) {
        throw new ApiError(
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error.message || 'Error updating test progress'
        )
    }
}

const getTestProgressByApplicationId = async (applicationId) => {
    try {
        const testProgress = await testProgressModel.findByApplicationId(applicationId)
        return testProgress
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to get test progress')
    }
}

const getTestProgressByTestSeriesId = async (testSeriesId) => {
    try {
        const testProgress = await testProgressModel.findByTestSeriesId(testSeriesId)
        return testProgress
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to get test progress')
    }
}

// Email functions
const sendTestInvitation = async (applicationId, testSeriesId) => {
    try {
    // Get application details
        const application = await applyModel.findOneById(applicationId)
        if (!application) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Application not found')
        }

        // Get job details
        const job = await jobModel.findOneById(application.jobId)
        if (!job) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Job not found')
        }

        // Get test series details
        const testSeries = await testSeriesModel.findOneById(testSeriesId)
        if (!testSeries) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Test series not found')
        }

        // Get test details
        const tests = await testModel.findByJobIdAndTestSeriesId(job._id.toString(), testSeries._id.toString())

        if (!tests || tests.length === 0) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'No tests found for this test series')
        }

        // Update test progress status to "Đã gửi"
        await updateTestProgress(applicationId, testSeriesId, {
            status: 'Đã gửi',
            score: null,
            result: null
        })

        // In a real application, you would send an email here
        // BrevoProvider.sendEmail(application.email, "Thông báo làm bài test", )

        return { success: true, message: 'Test invitation sent successfully' }
    } catch (error) {
        throw new ApiError(
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error.message || 'Error sending test invitation'
        )
    }
}

const sendTestResultEmail = async (applicationId, testSeriesId, result) => {
    try {
    // Get application details
        const application = await applyModel.findOneById(applicationId)
        if (!application) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Application not found')
        }

        // Get job details
        const job = await jobModel.findOneById(application.jobId)
        if (!job) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Job not found')
        }

        // Get test series details
        const testSeries = await testSeriesModel.findOneById(testSeriesId)
        if (!testSeries) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Test series not found')
        }

        // In a real application, you would send an email here
        BrevoProvider.sendEmail(application.email, 'Test Reuslt', `Sending test result email to ${application.email} for job ${job.title}. Result: ${result}`)

        return { success: true, message: 'Test result email sent successfully' }
    } catch (error) {
        throw new ApiError(
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error.message || 'Error sending test result email'
        )
    }
}

const sendInterviewInvitation = async (applicationId) => {
    try {
    // Get application details
        const application = await applyModel.findOneById(applicationId)
        if (!application) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Application not found')
        }

        // Get job details
        const job = await jobModel.findOneById(application.jobId)
        if (!job) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Job not found')
        }

        // In a real application, you would send an email here


        return { success: true, message: 'Interview invitation sent successfully' }
    } catch (error) {
        throw new ApiError(


            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error.message || 'Error sending interview invitation'
        )
    }
}

// Check if applicant has passed all required tests
const checkApplicantPassedAllRequiredTests = async (applicationId, jobId) => {
    try {
    // Get all test series for this job
        const testSeries = await testSeriesModel.findByJobId(jobId)
        const requiredTestSeries = testSeries.filter((ts) => ts.required)

        // Get test progress for this application
        const testProgress = await testProgressModel.findByApplicationId(applicationId)

        // Check if applicant has passed all required tests
        const passedAllRequired = requiredTestSeries.every((ts) => {
            const progress = testProgress.find((p) => p.testSeriesId.toString() === ts._id.toString())
            return progress && progress.result === 'Đạt'
        })

        return passedAllRequired
    } catch (error) {
        throw new ApiError(
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error.message || 'Error checking if applicant passed all required tests'
        )
    }
}

export const testService = {
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
    sendTestResultEmail,
    sendInterviewInvitation,

    // Utilities
    checkApplicantPassedAllRequiredTests
}
