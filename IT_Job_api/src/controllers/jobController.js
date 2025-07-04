import { StatusCodes } from 'http-status-codes'
import { jobService } from '~/services/jobService'
import { jobModel } from '~/models/jobModel'
import ApiError from '~/utils/ApiError'

const createNewJob = async (req, res, next) => {
    try {
        const jobData = req.body

        const newJob = await jobService.createNew( jobData)
        return res.status(StatusCodes.OK).json(newJob)
    } catch (error) {
        next(error)
    }
}


const getNewJobs = async(req, res, next) => {
    try {

        const jobs = await jobModel.getNewJobs()
        res.status(StatusCodes.OK).json(jobs)
    } catch (error) {
        next (error)
    }
}

const getJobById = async(req, res, next) => {
    try {
        const job = await jobService.getJobById(req.params.id)
        return res.status(StatusCodes.OK).json(job)
    } catch (error) {
        next(error)
    }
}

const getJobsByEmployerId = async(req, res, next) =>
{
    try {
        const employerId = req.params.employerId
        const jobs = await jobService.getJobsByEmployerId(employerId)
        return res.status(StatusCodes.OK).json(jobs)
    } catch (error) {
        next(error)
    }
}

const getJobsByIds = async (req, res) => {
    try {
        const { jobIds } = req.query
        // Kiểm tra jobIds có tồn tại và là chuỗi
        if (!jobIds || typeof jobIds !== 'string') {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'jobIds must be a non-empty string of comma-separated IDs')
        }

        // Làm sạch và split jobIds
        const cleanedJobIds = jobIds.trim().replace(/[\[\]\s]/g, '') // Loại bỏ dấu ngoặc và khoảng trắng
        if (!cleanedJobIds) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'jobIds cannot be empty')
        }

        const ids = cleanedJobIds.split(',').filter(id => id.trim())
        if (ids.length === 0) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'No valid jobIds provided')
        }


        const jobs = await jobModel.findByIds(ids)
        res.status(StatusCodes.OK).json({ data: jobs })
    } catch (error) {
        throw new ApiError(
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error.message || 'Failed to fetch jobs'
        )
    }
}

const getAllJobs = async (req, res) => {
    try {
        // Lấy các query parameters từ request
        const {
            skills,
            city,
            acceptFresher,
            jobType,
            sortBy = 'newest', // Mặc định sắp xếp theo newest
            page = 1,
            limit = 10 // Mặc định 10 công việc mỗi trang
        } = req.query

        // Chuẩn bị object filters
        const filters = {}
        if (skills) filters.skills = skills
        if (city) filters.city = city
        if (acceptFresher !== undefined) filters.acceptFresher = acceptFresher
        if (jobType) filters.jobType = jobType

        // Gọi service để lấy danh sách công việc
        const result = await jobService.getAllJobs(filters, sortBy, page, limit)

        // Trả về response thành công
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Jobs fetched successfully',
            data: result
        })
    } catch (error) {
        // Xử lý lỗi và trả về response lỗi
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'Failed to fetch jobs'
        })
    }
}

export const jobController = {
    createNewJob,
    getJobById,
    getJobsByEmployerId,
    getNewJobs,
    getJobsByIds,
    getAllJobs
}