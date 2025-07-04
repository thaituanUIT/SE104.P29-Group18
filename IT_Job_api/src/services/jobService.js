import { StatusCodes } from 'http-status-codes'
import { jobModel } from '~/models/jobModel'
import ApiError from '~/utils/ApiError'

const createNew = async (data) => {
    try {
        const newJob = await jobModel.createNew(data)
        return newJob
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error)
    }
}

// const getAllJobs = async (filter = {}, options = {}) => {
//     try {
//         const jobs = await jobModel.find(filter, null, options).sort({ createdAt: -1 })
//         return jobs
//     } catch (error) {
//         throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Không thể lấy danh sách job')
//     }
// }

const getJobById = async (jobId) => {
    try {
        const job = await jobModel.findOneById(jobId)
        if (!job) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Can not find any job with id')
        }
        return job
    } catch (error) {
        throw new ApiError(
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error.message || 'Error when get job detail'
        )
    }
}

const getJobsByEmployerId = async(employerId) => {
    try {
        const jobs = await jobModel.findByEmployerId(employerId)
        return jobs
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to get jobs')
    }
}

const getAllJobs = async (filters = {}, sortBy = 'newest', page = 1, limit = 10) => {
    try {
        // Chuẩn bị bộ lọc
        const filterOptions = {}
        if (filters.skills) filterOptions.skills = filters.skills
        if (filters.city) filterOptions.city = filters.city
        if (filters.acceptFresher !== undefined) filterOptions.acceptFresher = filters.acceptFresher === 'true'
        if (filters.jobType) filterOptions.jobType = filters.jobType

        // Chuẩn bị sắp xếp
        const sortOptions = {}
        switch (sortBy) {
        case 'newest':
            sortOptions.createdAt = -1
            break
        case 'salary_high':
            sortOptions['salary.max'] = -1
            break
        case 'applicants':
            sortOptions.applicantsCount = 1
            break
        default:
            sortOptions.createdAt = -1
        }

        // Chuẩn bị phân trang
        const pagination = {
            skip: (page - 1) * limit,
            limit: parseInt(limit)
        }

        const { jobs, totalJobs } = await jobModel.getJobsWithFilters(filterOptions, sortOptions, pagination)

        return {
            jobs,
            totalJobs,
            totalPages: Math.ceil(totalJobs / limit),
            currentPage: parseInt(page)
        }
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Không thể lấy danh sách job')
    }
}

export const jobService= {
    createNew,
    getAllJobs,
    getJobById,
    getJobsByEmployerId
}
