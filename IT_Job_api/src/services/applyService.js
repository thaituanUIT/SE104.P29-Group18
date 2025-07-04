import { applyModel } from '~/models/applyModel'
import { cloudinaryProvider } from '~/providers/cloudinaryProvider'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { jobModel } from '~/models/jobModel'
import { userModel } from '~/models/userModel'
import { testSeriesModel } from '~/models/testSeriesModel'
import { testProgressModel } from '~/models/testPregressModel'
import { employerModel } from '~/models/employerModel'

const validateFile = (file) => {
    if (!file) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Vui lòng gửi file CV')
    }
    const fileExtension = file.originalname.split('.').pop().toLowerCase()
    if (!['pdf', 'docx'].includes(fileExtension)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Chỉ chấp nhận file PDF hoặc DOCX')
    }
    if (file.size > 5 * 1024 * 1024) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'File phải nhỏ hơn 5MB')
    }
    return fileExtension
}

const calculateSkillMatch = (applicantSkills, jobSkills) => {
    if (!applicantSkills || !jobSkills || jobSkills.length === 0) return 0

    const matchedSkills = applicantSkills.filter((skill) =>
        jobSkills.some((jobSkill) => jobSkill.toLowerCase() === skill.toLowerCase())
    )

    return Math.round((matchedSkills.length / jobSkills.length) * 100)
}

const createApply = async (body, file) => {
    try {
    // Validate file và lấy fileExtension
        const fileExtension = validateFile(file)

        // Upload file lên Cloudinary
        const uploadResult = await cloudinaryProvider.streamUpLoadForCV(file.buffer, 'it_jobs/cv', fileExtension)

        // Chuẩn bị dữ liệu cho applyModel
        const applyDoc = {
            email: body.email,
            employerId: body.employerId,
            jobId: body.jobId,
            fullName: body.fullName,
            phoneNumber: body.phoneNumber,
            cvUrl: uploadResult.secure_url,
            status: 'pending'
        }

        // Lưu vào MongoDB
        const newApplication = await applyModel.createNew(applyDoc)

        // Create test progress entries for all test series of this job
        const testSeries = await testSeriesModel.findByJobId(body.jobId)
        if (testSeries && testSeries.length > 0) {
            const progressPromises = testSeries.map((ts) => {
                return testProgressModel.createNew({
                    applicationId: newApplication.insertedId.toString(),
                    testSeriesId: ts._id.toString(),
                    status: 'Chưa làm',
                    score: null,
                    result: null
                })
            })
            await Promise.all(progressPromises)
        }

        // Update applicants count for the job
        await jobModel.updateApplicationCount(body.jobId)

        return newApplication
    } catch (error) {
        if (error.name === 'ValidationError') {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Dữ liệu không hợp lệ: ' + error.message)
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Gửi hồ sơ thất bại: ' + error.message)
    }
}

const getAppliedJobsByEmail = async (email) => {
    try {
        if (!email) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Email is required')
        }
        const applications = await applyModel.findByEmail(email)
        if (!applications || applications.length === 0) {
            return []
        }
        const jobIds = applications.map((app) => app.jobId)
        return jobIds
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to fetch applied jobs: ' + error.message)
    }
}
const getApplicationsByEmployerIdInCVPhase = async (employerId) => {
    try {
        // Get all applications for this employer
        const applications = await applyModel.findByEmployerId(employerId)

        if (!applications.length) return []

        // Get unique jobId from applications
        const jobIds = [...new Set(applications.map((app) => app.jobId.toString()))]

        // Get jobs for these Ids
        const jobs = await jobModel.findByIds(jobIds)

        // Fetch testSeries for each job and attach to job objects
        const jobsWithTestSeries = await Promise.all(
            jobs.map(async (job) => {
                const testSeries = await testSeriesModel.findByJobId(job._id.toString())
                return {
                    ...job,
                    testSeries: testSeries
                        ? testSeries.map((ts) => ({
                            _id: ts._id.toString(),
                            jobId: ts.jobId.toString(),
                            name: ts.name,
                            order: ts.order,
                            required: ts.required,
                            createdAt: ts.createdAt,
                            updatedAt: ts.updatedAt,
                            _destroy: ts._destroy
                        }))
                        : [] // Ensure testSeries is always an array
                }
            })
        )

        // Create a map of jobDetail for quick lookup
        const jobMap = jobsWithTestSeries.reduce((map, job) => {
            map[job._id.toString()] = job
            return map
        }, {})

        // Get applicant profiles
        const applicantEmails = [...new Set(applications.map((app) => app.email))]
        const applicantProfiles = await Promise.all(
            applicantEmails.map((email) => userModel.findOneByEmail(email))
        )

        const profileMap = applicantProfiles.reduce((map, profile) => {
            if (profile) map[profile.email] = profile
            return map
        }, {})

        // Get test progress for all applications
        const testProgressPromises = applications.map((app) =>
            testProgressModel.findByApplicationId(app._id.toString())
        )
        const allTestProgress = await Promise.all(testProgressPromises)

        // Create a map of test progress for quick lookup
        const testProgressMap = {}
        applications.forEach((app, index) => {
            testProgressMap[app._id.toString()] = allTestProgress[index] || []
        })

        const detailedApplications = applications
            .filter((app) => app.status !== 'Rejected' && !app._destroy)
            .map((app) => {
                const profile = profileMap[app.email] || {}
                const testProgress = testProgressMap[app._id.toString()] || []

                // Calculate skill match if both job and applicant have skills
                const job = jobMap[app.jobId.toString()]
                const skillMatch = job?.skills && profile.skills
                    ? Math.min(
                        100,
                        Math.max(0, (profile.skills.filter((s) => job.skills.includes(s)).length / job.skills.length) * 100)
                    )
                    : 0 // Default to 0 if no skills data

                // Calculate if passed all required tests
                const passedAllRequiredTests = (() => {
                    // Kiểm tra điều kiện ban đầu
                    if (!job?.testSeries || !Array.isArray(job.testSeries) || job.testSeries.length === 0) {
                        return false // Trả về false nếu không có test series
                    }

                    // Lấy danh sách test series bắt buộc
                    const requiredTestSeries = job.testSeries.filter((ts) => ts.required === true)

                    // Nếu không có test bắt buộc nào, trả về false
                    if (requiredTestSeries.length === 0) {
                        return false
                    }

                    // Kiểm tra testProgress có tồn tại không
                    if (!testProgress || !Array.isArray(testProgress)) {
                        return false // Trả về false nếu testProgress không hợp lệ
                    }

                    // Kiểm tra xem tất cả test bắt buộc đã đạt chưa
                    const result = requiredTestSeries.every((ts) => {
                        const progress = testProgress.find((p) => p.testSeriesId.toString() === ts._id.toString())
                        return progress && progress.result === 'Đạt'
                    })
                    return result
                })()

                return {
                    id: app._id.toString(),
                    jobId: app.jobId.toString(),
                    name: app.fullName || profile.name || '',
                    email: app.email,
                    phone: app.phoneNumber || profile.phone || '',
                    avatar: profile.picture || '/placeholder.svg?height=100&width=100',
                    appliedDate: new Date(app.createdAt).toLocaleDateString('en-GB'),
                    status: app.status || 'Chờ xử lý',
                    cvLink: app.cvUrl || '',
                    title: profile.title || 'Job Seeker',
                    dob: profile.dob || '',
                    gender: profile.gender || '',
                    address: profile.address || '',
                    personalLink: profile.personalLink || '',
                    education: profile.education || [],
                    experience: profile.experience || [],
                    certificates: profile.certificates || [],
                    skills: profile.skills || [],
                    skillMatch: skillMatch,
                    testProgress: testProgress.map((tp) => ({
                        testSeriesId: tp.testSeriesId.toString(),
                        status: tp.status,
                        score: tp.score,
                        result: tp.result
                    })),
                    passedAllRequiredTests
                }
            })

        return detailedApplications
    } catch (error) {
        throw new Error(`Error getting applicants: ${error.message}`)
    }
}

const getApplicationsByEmployerId = async (employerId) => {
    try {
        // Get all applications for this employer
        const applications = await applyModel.findApplicantInTestPhaseByEmployerId(employerId)

        if (!applications.length) return []

        // Get unique jobId from applications
        const jobIds = [...new Set(applications.map((app) => app.jobId.toString()))]

        // Get jobs for these Ids
        const jobs = await jobModel.findByIds(jobIds)

        // Fetch testSeries for each job and attach to job objects
        const jobsWithTestSeries = await Promise.all(
            jobs.map(async (job) => {
                const testSeries = await testSeriesModel.findByJobId(job._id.toString())
                return {
                    ...job,
                    testSeries: testSeries
                        ? testSeries.map((ts) => ({
                            _id: ts._id.toString(),
                            jobId: ts.jobId.toString(),
                            name: ts.name,
                            order: ts.order,
                            required: ts.required,
                            createdAt: ts.createdAt,
                            updatedAt: ts.updatedAt,
                            _destroy: ts._destroy
                        }))
                        : [] // Ensure testSeries is always an array
                }
            })
        )

        // Create a map of jobDetail for quick lookup
        const jobMap = jobsWithTestSeries.reduce((map, job) => {
            map[job._id.toString()] = job
            return map
        }, {})

        // Get applicant profiles
        const applicantEmails = [...new Set(applications.map((app) => app.email))]
        const applicantProfiles = await Promise.all(
            applicantEmails.map((email) => userModel.findOneByEmail(email))
        )

        const profileMap = applicantProfiles.reduce((map, profile) => {
            if (profile) map[profile.email] = profile
            return map
        }, {})

        // Get test progress for all applications
        const testProgressPromises = applications.map((app) =>
            testProgressModel.findByApplicationId(app._id.toString())
        )
        const allTestProgress = await Promise.all(testProgressPromises)

        // Create a map of test progress for quick lookup
        const testProgressMap = {}
        applications.forEach((app, index) => {
            testProgressMap[app._id.toString()] = allTestProgress[index] || []
        })

        const detailedApplications = applications
            .filter((app) => app.status !== 'Rejected' && !app._destroy)
            .map((app) => {
                const profile = profileMap[app.email] || {}
                const testProgress = testProgressMap[app._id.toString()] || []

                // Calculate skill match if both job and applicant have skills
                const job = jobMap[app.jobId.toString()]
                const skillMatch = job?.skills && profile.skills
                    ? Math.min(
                        100,
                        Math.max(0, (profile.skills.filter((s) => job.skills.includes(s)).length / job.skills.length) * 100)
                    )
                    : 0 // Default to 0 if no skills data

                // Calculate if passed all required tests
                const passedAllRequiredTests = (() => {
                    // Kiểm tra điều kiện ban đầu
                    if (!job?.testSeries || !Array.isArray(job.testSeries) || job.testSeries.length === 0) {
                        return false // Trả về false nếu không có test series
                    }

                    // Lấy danh sách test series bắt buộc
                    const requiredTestSeries = job.testSeries.filter((ts) => ts.required === true)

                    // Nếu không có test bắt buộc nào, trả về false
                    if (requiredTestSeries.length === 0) {
                        return false
                    }

                    // Kiểm tra testProgress có tồn tại không
                    if (!testProgress || !Array.isArray(testProgress)) {
                        return false // Trả về false nếu testProgress không hợp lệ
                    }

                    // Kiểm tra xem tất cả test bắt buộc đã đạt chưa
                    const result = requiredTestSeries.every((ts) => {
                        const progress = testProgress.find((p) => p.testSeriesId.toString() === ts._id.toString())
                        return progress && progress.result === 'Đạt'
                    })
                    return result
                })()

                return {
                    id: app._id.toString(),
                    jobId: app.jobId.toString(),
                    name: app.fullName || profile.name || '',
                    email: app.email,
                    phone: app.phoneNumber || profile.phone || '',
                    avatar: profile.picture || '/placeholder.svg?height=100&width=100',
                    appliedDate: new Date(app.createdAt).toLocaleDateString('en-GB'),
                    status: app.status || 'Chờ xử lý',
                    cvLink: app.cvUrl || '',
                    title: profile.title || 'Job Seeker',
                    dob: profile.dob || '',
                    gender: profile.gender || '',
                    address: profile.address || '',
                    personalLink: profile.personalLink || '',
                    education: profile.education || [],
                    experience: profile.experience || [],
                    certificates: profile.certificates || [],
                    skills: profile.skills || [],
                    skillMatch: skillMatch,
                    testProgress: testProgress.map((tp) => ({
                        testSeriesId: tp.testSeriesId.toString(),
                        status: tp.status,
                        score: tp.score,
                        result: tp.result
                    })),
                    passedAllRequiredTests
                }
            })

        return detailedApplications
    } catch (error) {
        throw new Error(`Error getting applicants: ${error.message}`)
    }
}

const getApplicationsByEmployerIdDashboard = async (employerId) => {
    try {
        // Get all applications for this employer
        const applications = await applyModel.findApplicantByEmployerId(employerId)

        if (!applications.length) return []

        // Get unique jobId from applications
        const jobIds = [...new Set(applications.map((app) => app.jobId.toString()))]

        // Get jobs for these Ids
        const jobs = await jobModel.findByIds(jobIds)

        // Fetch testSeries for each job and attach to job objects
        const jobsWithTestSeries = await Promise.all(
            jobs.map(async (job) => {
                const testSeries = await testSeriesModel.findByJobId(job._id.toString())
                return {
                    ...job,
                    testSeries: testSeries
                        ? testSeries.map((ts) => ({
                            _id: ts._id.toString(),
                            jobId: ts.jobId.toString(),
                            name: ts.name,
                            order: ts.order,
                            required: ts.required,
                            createdAt: ts.createdAt,
                            updatedAt: ts.updatedAt,
                            _destroy: ts._destroy
                        }))
                        : [] // Ensure testSeries is always an array
                }
            })
        )

        // Create a map of jobDetail for quick lookup
        const jobMap = jobsWithTestSeries.reduce((map, job) => {
            map[job._id.toString()] = job
            return map
        }, {})

        // Get applicant profiles
        const applicantEmails = [...new Set(applications.map((app) => app.email))]
        const applicantProfiles = await Promise.all(
            applicantEmails.map((email) => userModel.findOneByEmail(email))
        )

        const profileMap = applicantProfiles.reduce((map, profile) => {
            if (profile) map[profile.email] = profile
            return map
        }, {})

        // Get test progress for all applications
        const testProgressPromises = applications.map((app) =>
            testProgressModel.findByApplicationId(app._id.toString())
        )
        const allTestProgress = await Promise.all(testProgressPromises)

        // Create a map of test progress for quick lookup
        const testProgressMap = {}
        applications.forEach((app, index) => {
            testProgressMap[app._id.toString()] = allTestProgress[index] || []
        })

        const detailedApplications = applications
            .map((app) => {
                const profile = profileMap[app.email] || {}
                const testProgress = testProgressMap[app._id.toString()] || []

                // Calculate skill match if both job and applicant have skills
                const job = jobMap[app.jobId.toString()]
                const skillMatch = job?.skills && profile.skills
                    ? Math.min(
                        100,
                        Math.max(0, (profile.skills.filter((s) => job.skills.includes(s)).length / job.skills.length) * 100)
                    )
                    : 0 // Default to 0 if no skills data

                // Calculate if passed all required tests
                const passedAllRequiredTests = (() => {
                    // Kiểm tra điều kiện ban đầu
                    if (!job?.testSeries || !Array.isArray(job.testSeries) || job.testSeries.length === 0) {
                        return false // Trả về false nếu không có test series
                    }

                    // Lấy danh sách test series bắt buộc
                    const requiredTestSeries = job.testSeries.filter((ts) => ts.required === true)

                    // Nếu không có test bắt buộc nào, trả về false
                    if (requiredTestSeries.length === 0) {
                        return false
                    }

                    // Kiểm tra testProgress có tồn tại không
                    if (!testProgress || !Array.isArray(testProgress)) {
                        return false // Trả về false nếu testProgress không hợp lệ
                    }

                    // Kiểm tra xem tất cả test bắt buộc đã đạt chưa
                    const result = requiredTestSeries.every((ts) => {
                        const progress = testProgress.find((p) => p.testSeriesId.toString() === ts._id.toString())
                        return progress && progress.result === 'Đạt'
                    })
                    return result
                })()

                return {
                    id: app._id.toString(),
                    jobId: app.jobId.toString(),
                    name: app.fullName || profile.name || '',
                    email: app.email,
                    phone: app.phoneNumber || profile.phone || '',
                    avatar: profile.picture || '/placeholder.svg?height=100&width=100',
                    appliedDate: new Date(app.createdAt).toLocaleDateString('en-GB'),
                    status: app.status || 'Chờ xử lý',
                    cvLink: app.cvUrl || '',
                    title: profile.title || 'Job Seeker',
                    dob: profile.dob || '',
                    gender: profile.gender || '',
                    address: profile.address || '',
                    personalLink: profile.personalLink || '',
                    education: profile.education || [],
                    experience: profile.experience || [],
                    certificates: profile.certificates || [],
                    skills: profile.skills || [],
                    skillMatch: skillMatch,
                    testProgress: testProgress.map((tp) => ({
                        testSeriesId: tp.testSeriesId.toString(),
                        status: tp.status,
                        score: tp.score,
                        result: tp.result
                    })),
                    passedAllRequiredTests
                }
            })

        return detailedApplications
    } catch (error) {
        throw new Error(`Error getting applicants: ${error.message}`)
    }
}


const updateApplicationStatus = async (applicationId, status, rejectionReason = '', phase = null) => {
    try {
        const updateData = {
            status,
            updatedAt: Date.now()
        }

        if (status === 'Reject' && rejectionReason) {
            updateData.rejectionReason = rejectionReason
        }

        if (phase) {
            updateData.phase = phase
        }

        const result = await applyModel.update(applicationId, updateData)

        return result
    } catch (error) {
        throw new Error(`Error updating application status: ${error.message}`)
    }
}

const getApplicationsByJobId = async (jobId) => {
    try {
        const applications = await applyModel.findByJobId(jobId)

        if (!applications.length) return []

        // Get applicant profiles
        const applicantEmails = [...new Set(applications.map((app) => app.email))]
        const applicantProfiles = await Promise.all(applicantEmails.map((email) => userModel.findOneByEmail(email)))

        // Create a map of applicant profiles for quick lookup
        const profileMap = applicantProfiles.reduce((map, profile) => {
            if (profile) map[profile.email] = profile
            return map
        }, {})

        // Get job details
        const job = await jobModel.findOneById(jobId)

        // Get test progress for all applications
        const testProgressPromises = applications.map((app) => testProgressModel.findByApplicationId(app._id.toString()))
        const allTestProgress = await Promise.all(testProgressPromises)

        // Create a map of test progress for quick lookup
        const testProgressMap = {}
        applications.forEach((app, index) => {
            testProgressMap[app._id.toString()] = allTestProgress[index] || []
        })

        // Combine data to create detailed application objects
        const detailedApplications = applications
            .filter((app) => app.status !== 'Rejected' && !app._destroy).map((app) => {
                const profile = profileMap[app.email] || {}
                const testProgress = testProgressMap[app._id.toString()] || []

                // Calculate skill match if both job and applicant have skills
                const skillMatch = 25

                // Calculate if passed all required tests
                const passedAllRequiredTests = (() => {
                    // Kiểm tra điều kiện ban đầu
                    if (!job?.testSeries || !Array.isArray(job.testSeries) || job.testSeries.length === 0) {
                        return false // Trả về false nếu không có test series
                    }

                    // Lấy danh sách test series bắt buộc
                    const requiredTestSeries = job.testSeries.filter((ts) => ts.required === true)

                    // Nếu không có test bắt buộc nào, trả về false hoặc true tùy theo logic mong muốn
                    if (requiredTestSeries.length === 0) {
                        return false // Hoặc true nếu bạn muốn coi đây là trường hợp hợp lệ
                    }

                    // Kiểm tra testProgress có tồn tại không
                    if (!testProgress || !Array.isArray(testProgress)) {
                        return false // Trả về false nếu testProgress không hợp lệ
                    }

                    // Kiểm tra xem tất cả test bắt buộc đã đạt chưa
                    return requiredTestSeries.every((ts) => {
                        const progress = testProgress.find((p) => p.testSeriesId === ts._id) // So sánh trực tiếp
                        return progress && progress.result === 'Đạt'
                    })
                })()

                return {
                    id: app._id.toString(),
                    jobId: app.jobId.toString(),
                    name: app.fullName || profile.name || '',
                    email: app.email,
                    phone: app.phoneNumber || profile.phone || '',
                    avatar: profile.picture || '/placeholder.svg?height=100&width=100',
                    appliedDate: new Date(app.createdAt).toLocaleDateString('en-GB'),
                    status: app.status || 'Chờ xử lý',
                    cvLink: app.cvUrl || '',
                    title: profile.title || 'Job Seeker',
                    dob: profile.dob || '',
                    gender: profile.gender || '',
                    address: profile.address || '',
                    personalLink: profile.personalLink || '',
                    education: profile.education || [],
                    experience: profile.experience || [],
                    certificates: profile.certificates || [],
                    skills: profile.skills || [],
                    skillMatch: skillMatch,
                    testProgress: testProgress.map((tp) => ({
                        testSeriesId: tp.testSeriesId.toString(),
                        status: tp.status,
                        score: tp.score,
                        result: tp.result
                    })),
                    passedAllRequiredTests
                }
            })

        return detailedApplications
    } catch (error) {
        throw new Error(`Error getting applications: ${error.message}`)
    }
}

const getApplicationById = async (applicationId) => {
    try {
        const application = await applyModel.findOneById(applicationId)
        if (!application) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Application not found')
        }

        // Get applicant profile
        const profile = await userModel.findOneByEmail(application.email)

        // Get job details
        const job = await jobModel.findOneById(application.jobId)

        // Get test progress
        const testProgress = await testProgressModel.findByApplicationId(applicationId)

        // Calculate skill match
        const skillMatch = 25

        // Calculate if passed all required tests
        const passedAllRequiredTests = job.testSeries
            ? job.testSeries
                .filter((ts) => ts.required)
                .every((ts) => {
                    const progress = testProgress.find((p) => p.testSeriesId.toString() === ts._id.toString())
                    return progress && progress.result === 'Đạt'
                })
            : false

        return {
            id: application._id.toString(),
            jobId: application.jobId.toString(),
            name: application.fullName || profile?.name || '',
            email: application.email,
            phone: application.phoneNumber || profile?.phone || '',
            avatar: profile?.picture || '/placeholder.svg?height=100&width=100',
            appliedDate: new Date(application.createdAt).toLocaleDateString('en-GB'),
            status: application.status || 'Chờ xử lý',
            cvLink: application.cvUrl || '',
            title: profile?.title || 'Job Seeker',
            dob: profile?.dob || '',
            gender: profile?.gender || '',
            address: profile?.address || '',
            personalLink: profile?.personalLink || '',
            education: profile?.education || [],
            experience: profile?.experience || [],
            certificates: profile?.certificates || [],
            skills: profile?.skills || [],
            skillMatch: skillMatch,
            jobTitle: job?.title || '',
            testProgress: testProgress.map((tp) => ({
                testSeriesId: tp.testSeriesId.toString(),
                status: tp.status,
                score: tp.score,
                result: tp.result
            })),
            passedAllRequiredTests
        }
    } catch (error) {
        throw error
    }
}

const deleteApplication = async (applicationId) => {
    try {
        const updateData = {
            _destroy: true,
            updatedAt: Date.now()
        }

        const result = await applyModel.update(applicationId, updateData)

        if (!result.value) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Application not found')
        }

        return result
    } catch (error) {
        throw error
    }
}

// Check if a user has already applied to a job
const checkIfApplied = async (email, jobId) => {
    try {
        const application = await applyModel.checkIfApplied(email, jobId)
        return !!application
    } catch (error) {
        throw new Error(`Error checking application: ${error.message}`)
    }
}

const moveApplicantToInterviewRound = async (applicantId, updateData) => {
    try {
        if (!applicantId) {
            throw new Error('Applicant not found ')
        }
        const result = await applyModel.update(applicantId, updateData)
        return result
    } catch (error)
    {
        throw new Error('Can not move applicant to nextx round')
    }
}

const getApplicationsInInterviewPhaseByEmployerId = async (employerId) => {
    try {
        // Fetch applications in the "interview" phase for the employer
        const applications = await applyModel.findApplicantsInInterviewPhaseByEmployerId(employerId)
        if (!applications.length) return []

        // Get unique job IDs from applications
        const jobIds = [...new Set(applications.map((app) => app.jobId.toString()))]

        // Fetch job details
        const jobs = await jobModel.findByIds(jobIds)
        const jobsWithTestSeries = await Promise.all(
            jobs.map(async (job) => {
                const testSeries = await testSeriesModel.findByJobId(job._id.toString())
                return {
                    ...job,
                    testSeries: testSeries
                        ? testSeries.map((ts) => ({
                            _id: ts._id.toString(),
                            jobId: ts.jobId.toString(),
                            name: ts.name,
                            order: ts.order,
                            required: ts.required,
                            createdAt: ts.createdAt,
                            updatedAt: ts.updatedAt,
                            _destroy: ts._destroy
                        }))
                        : []
                }
            })
        )
        const jobMap = jobsWithTestSeries.reduce((map, job) => {
            map[job._id.toString()] = job
            return map
        }, {})

        // Fetch applicant profiles
        const applicantEmails = [...new Set(applications.map((app) => app.email))]
        const applicantProfiles = await Promise.all(
            applicantEmails.map((email) => userModel.findOneByEmail(email))
        )
        const profileMap = applicantProfiles.reduce((map, profile) => {
            if (profile) map[profile.email] = profile
            return map
        }, {})

        // Fetch test progress for all applications
        const testProgressPromises = applications.map((app) =>
            testProgressModel.findByApplicationId(app._id.toString())
        )
        const allTestProgress = await Promise.all(testProgressPromises)
        const testProgressMap = {}
        applications.forEach((app, index) => {
            testProgressMap[app._id.toString()] = allTestProgress[index] || []
        })

        // Build detailed application objects
        const detailedApplications = applications
            .filter((app) => app.status !== 'Rejected' && !app._destroy)
            .map((app) => {
                const profile = profileMap[app.email] || {}
                const testProgress = testProgressMap[app._id.toString()] || []
                const job = jobMap[app.jobId.toString()]
                const skillMatch = 25
                const passedAllRequiredTests = (() => {
                    if (!job?.testSeries || !Array.isArray(job.testSeries) || job.testSeries.length === 0) {
                        return false
                    }
                    const requiredTestSeries = job.testSeries.filter((ts) => ts.required === true)
                    if (requiredTestSeries.length === 0) {
                        return false
                    }
                    if (!testProgress || !Array.isArray(testProgress)) {
                        return false
                    }
                    const result = requiredTestSeries.every((ts) => {
                        const progress = testProgress.find((p) => p.testSeriesId.toString() === ts._id.toString())
                        return progress && progress.result === 'Đạt'
                    })
                    return result
                })()
                return {
                    id: app._id.toString(),
                    jobId: app.jobId.toString(),
                    name: app.fullName || profile.name || '',
                    email: app.email,
                    phone: app.phoneNumber || profile.phone || '',
                    avatar: profile.picture || '/placeholder.svg?height=100&width=100',
                    appliedDate: new Date(app.createdAt).toLocaleDateString('en-GB'),
                    status: app.status || 'Chờ xử lý',
                    cvLink: app.cvUrl || '',
                    title: profile.title || 'Job Seeker',
                    dob: profile.dob || '',
                    gender: profile.gender || '',
                    address: profile.address || '',
                    personalLink: profile.personalLink || '',
                    education: profile.education || [],
                    experience: profile.experience || [],
                    certificates: profile.certificates || [],
                    skills: profile.skills || [],
                    skillMatch: skillMatch,
                    testProgress: testProgress.map((tp) => ({
                        testSeriesId: tp.testSeriesId.toString(),
                        status: tp.status,
                        score: tp.score,
                        result: tp.result
                    })),
                    passedAllRequiredTests
                }
            })

        return detailedApplications
    } catch (error) {
        throw new Error(`Error getting interview phase applicants: ${error.message}`)
    }
}

const getApplicationsGroupedByStatus = async (email) => {
    if (!email) throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing email')

    const applications = await applyModel.findByEmail(email)
    if (!applications || applications.length === 0) return {
        pendingJobs: [], acceptedJobs: [], rejectedJobs: []
    }

    // 1. Lấy danh sách job
    const jobIds = applications.map(app => app.jobId)
    const jobs = await jobModel.findByIds(jobIds)

    const jobMap = jobs.reduce((acc, job) => {
        acc[job._id.toString()] = job
        return acc
    }, {})

    // 2. Tìm tất cả employerId có liên quan
    const employerIds = [...new Set(jobs.map(job => job.employerId?.toString()))]

    // 3. Truy vấn bảng employer
    const employers = await employerModel.findByIds(employerIds)
    const employerMap = employers.reduce((acc, emp) => {
        acc[emp._id.toString()] = emp
        return acc
    }, {})

    // 4. Gắn thông tin job + employer cho từng đơn apply
    const appsWithJobDetail = applications.map(app => {
        const job = jobMap[app.jobId.toString()]
        const employer = employerMap[job?.employerId?.toString()]

        return {
            id: app._id.toString(),
            jobId: app.jobId.toString(),
            status: capitalizeStatus(app.status),
            title: job?.title || '',
            company: employer?.companyName || '',
            logo: employer?.logoURL || '',
            city: employer?.companyLocation || '',
            workType: job?.workplace || 'Unknown'
        }
    })

    return {
        pendingJobs: appsWithJobDetail.filter(app => app.status === 'Pending'),
        acceptedJobs: appsWithJobDetail.filter(app => app.status === 'Accepted'),
        rejectedJobs: appsWithJobDetail.filter(app => app.status === 'Rejected')
    }
}

// Helper function
const capitalizeStatus = (status) => {
    if (!status) return 'Pending'
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
}


export const applyService = {
    createApply,
    getAppliedJobsByEmail,
    checkIfApplied,
    deleteApplication,
    getApplicationsByJobId,
    updateApplicationStatus,
    getApplicationsByEmployerId,
    getApplicationById,
    moveApplicantToInterviewRound,
    getApplicationsByEmployerIdInCVPhase,
    getApplicationsInInterviewPhaseByEmployerId,
    getApplicationsGroupedByStatus,
    getApplicationsByEmployerIdDashboard
}
