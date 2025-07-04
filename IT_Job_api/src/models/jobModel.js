import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import Joi from 'joi'

const JOB_COLLECTION_NAME = 'jobs'

const JOB_COLLECTION_SCHEMA = Joi.object({
    employerId: Joi.string().required(),
    title: Joi.string().required(),
    position: Joi.string().required(),
    workplace: Joi.string().valid('remote', 'at-office').required(),
    jobType: Joi.string().valid('full-time', 'part-time', 'internship').required(),
    salary: Joi.object({
        min: Joi.number().min(0).required(),
        max: Joi.number().min(Joi.ref('min')).required()
    }).required(),
    deadline: Joi.date().iso().required(),
    jobDescription: Joi.string().required(),
    jobRequirement: Joi.string().required(),
    benefits: Joi.string().required(),
    locations: Joi.array().items(Joi.string()).min(1).required(),
    skills: Joi.array().items(Joi.string()),
    acceptFresher: Joi.boolean().default(false),

    // Add these fields to your JOB_COLLECTION_SCHEMA
    department: Joi.string().default('Engineering'), // Department like "Engineering"
    applicantsCount: Joi.number().default(0), // Count of applicants
    status: Joi.string().valid('Đang tuyển', 'Đã đóng').default('Đang tuyển'), // Job status

    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
    return await JOB_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        const newJob = await GET_DB().collection(JOB_COLLECTION_NAME).insertOne({
            ...validData,
            employerId: new ObjectId(validData.employerId)
        })
        return newJob
    } catch (error) {
        throw new Error(error)
    }
}

const findOneById = async (jobId) => {
    try {
        const job = await GET_DB()
            .collection(JOB_COLLECTION_NAME)
            .findOne({ _id: new ObjectId(jobId) })
        return job
    } catch (error) {
        throw new Error(error)
    }
}

const update = async (jobId, jobData) => {
    try {
        const job = await GET_DB().collection(JOB_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(jobId) },
            { $set: jobData },
            { returnDocument: 'after' }
        )
        return job
    } catch (error) {
        throw new Error(error)
    }
}

const findByEmployerId = async (employerId) => {
    return await GET_DB()
        .collection(JOB_COLLECTION_NAME)
        .find({ employerId: new ObjectId(employerId), _destroy: false })
        .toArray()
}

const getNewJobs = async () => {
    try {
        const jobs = await GET_DB()
            .collection(JOB_COLLECTION_NAME)
            .aggregate([
                {
                    $match: { _destroy: false }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $limit: 26
                },
                {
                    $lookup: {
                        from: 'employers',
                        localField: 'employerId',
                        foreignField: '_id',
                        as: 'employerName'
                    }
                },
                {
                    $unwind: {
                        path: '$employerName',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        skills: 1,
                        employerId: 1,
                        companyName: '$employerName.companyName',
                        logoURL: '$employerName.logoURL'
                    }
                }
            ])
            .toArray()

        return jobs
    } catch (error) {
        throw new Error(error.message || error)
    }
}

const findByIds = async (jobIds) => {
    try {
        // Validate jobIds
        if (!Array.isArray(jobIds) || jobIds.length === 0) {
            throw new Error('jobIds must be a non-empty array')
        }
        const objectIds = jobIds.map(id => {
            try {
                return new ObjectId(id)
            } catch (error) {
                throw new Error(`Invalid ObjectId: ${id}`)
            }
        })

        const jobs = await GET_DB()
            .collection(JOB_COLLECTION_NAME)
            .aggregate([
                {
                    $match: {
                        _id: { $in: objectIds },
                        _destroy: false
                    }
                },
                {
                    $lookup: {
                        from: 'employers',
                        localField: 'employerId',
                        foreignField: '_id',
                        as: 'employer'
                    }
                },
                {
                    $lookup: {
                        from: 'applies',
                        localField: '_id',
                        foreignField: 'jobId',
                        as: 'applications'
                    }
                },
                {
                    $unwind: {
                        path: '$employer',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        department: 1,
                        position: 1,
                        companyName: '$employer.companyName',
                        logo: '$employer.logoURL',
                        location: { $arrayElemAt: ['$locations', 0] }, // First location
                        locations: 1, // All locations
                        workplace: 1,
                        jobType: 1,
                        status: { $cond: { if: '$_destroy', then: 'Đã đóng', else: 'Đang tuyển' } },
                        skills: 1,
                        salary: 1,
                        deadline: 1,
                        createdAt: 1,
                        jobDescription: 1,
                        jobRequirement: 1,
                        benefits: 1,
                        acceptFresher: 1,
                        employerId: 1,
                        applicantsCount: { $size: '$applications' }
                    }
                }
            ])
            .toArray()

        return jobs
    } catch (error) {
        throw new Error(error.message || error)
    }
}

const updateApplicationCount = async (jobId) => {
    try {
        // Count applications for this job
        const applicationCount = await GET_DB()
            .collection('applies') // Assuming your applications collection is named 'applications'
            .countDocuments({ jobId: new ObjectId(jobId), _destroy: false })

        // Update the job with the new count
        await GET_DB()
            .collection(JOB_COLLECTION_NAME)
            .updateOne(
                { _id: new ObjectId(jobId) },
                { $set: { applicantsCount: applicationCount } }
            )

        return applicationCount
    } catch (error) {
        throw new Error(error)
    }
}

const getJobsWithFilters = async (filters = {}, sortOptions = {}, pagination = {}) => {
    try {
        const query = { _destroy: false }

        // Lọc theo skills
        if (filters.skills) {
            query.skills = { $in: [filters.skills] }
        }

        // Lọc theo location
        if (filters.city) {
            query.locations = filters.city
        }

        // Lọc theo acceptFresher
        if (filters.acceptFresher !== undefined) {
            query.acceptFresher = filters.acceptFresher
        }

        // Lọc theo jobType
        if (filters.jobType) {
            query.jobType = filters.jobType
        }

        // Pipeline aggregation để join với employers và tính toán
        const pipeline = [
            { $match: query },
            {
                $lookup: {
                    from: 'employers',
                    localField: 'employerId',
                    foreignField: '_id',
                    as: 'employer'
                }
            },
            {
                $lookup: {
                    from: 'applies',
                    localField: '_id',
                    foreignField: 'jobId',
                    as: 'applications'
                }
            },
            {
                $unwind: {
                    path: '$employer',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    department: 1,
                    position: 1,
                    companyName: '$employer.companyName',
                    logo: '$employer.logoURL',
                    location: { $arrayElemAt: ['$locations', 0] },
                    locations: 1,
                    workplace: 1,
                    jobType: 1,
                    status: { $cond: { if: '$_destroy', then: 'Đã đóng', else: 'Đang tuyển' } },
                    skills: 1,
                    salary: 1,
                    deadline: 1,
                    createdAt: 1,
                    jobDescription: 1,
                    jobRequirement: 1,
                    benefits: 1,
                    acceptFresher: 1,
                    employerId: 1,
                    applicantsCount: { $size: '$applications' }
                }
            }
        ]

        // Thêm sắp xếp
        if (Object.keys(sortOptions).length > 0) {
            pipeline.push({ $sort: sortOptions })
        }

        // Thêm phân trang
        if (pagination.skip !== undefined && pagination.limit !== undefined) {
            pipeline.push({ $skip: pagination.skip })
            pipeline.push({ $limit: pagination.limit })
        }

        const jobs = await GET_DB()
            .collection(JOB_COLLECTION_NAME)
            .aggregate(pipeline)
            .toArray()

        // Tính tổng số công việc (để hỗ trợ phân trang)
        const totalJobs = await GET_DB()
            .collection(JOB_COLLECTION_NAME)
            .countDocuments(query)

        return { jobs, totalJobs }
    } catch (error) {
        throw new Error(error.message || error)
    }
}

export const jobModel = {
    JOB_COLLECTION_NAME,
    JOB_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    update,
    findByEmployerId,
    getNewJobs,
    findByIds,
    updateApplicationCount,
    getJobsWithFilters
}