import express from 'express'
import { testController } from '~/controllers/testController'
// import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Test Series Routes
Router.route('/test-series')
    .post(testController.createTestSeries)

Router.route('/test-series/job/:jobId')
    .get(testController.getTestSeriesByJobId)

Router.route('/test-series/:testSeriesId')
    .put(testController.updateTestSeries)
    .delete(testController.deleteTestSeries)

// Test Routes
Router.route('/tests')
    .post(testController.createTest)

Router.route('/tests/job/:jobId')
    .get(testController.getTestsByJobId)

Router.route('/tests/job/:jobId/test-series/:testSeriesId')
    .get(testController.getTestsByJobIdAndTestSeriesId)

Router.route('/tests/:testId')
    .put(testController.updateTest)
    .delete(testController.deleteTest)

// Test Progress Routes
Router.route('/test-progress/:applicationId/:testSeriesId')
    .put(testController.updateTestProgress)

Router.route('/test-progress/application/:applicationId')
    .get(testController.getTestProgressByApplicationId)

Router.route('/test-progress/test-series/:testSeriesId')
    .get(testController.getTestProgressByTestSeriesId)

// Email Routes
Router.route('/send-test-invitation/:applicationId/:testSeriesId')
    .post(testController.sendTestInvitation)

Router.route('/send-test-invitation-to-all/:jobId/:testSeriesId')
    .post(testController.sendTestInvitationToAll)

export const testRoutes = Router
