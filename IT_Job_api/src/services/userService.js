/*eslint-disable*/
import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import { jobModel } from '~/models/jobModel'
import { employerModel } from '~/models/employerModel'
import ApiError from '~/utils/ApiError'
import { cloudinaryProvider } from '~/providers/cloudinaryProvider'

const pickUserData = (user) => {
    if (!user) return null

    // Remove sensitive fields
    const { password, ...userData } = user
    return userData
}

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

const createNew = async(userData) => {
    try {
        // Check if user already exists
        const existingUser = await userModel.findOneByEmail(userData.email)
        if (existingUser) {
            return pickUserData(existingUser)
        }

        // Create new user
        const newUser = await userModel.createNew(userData)
        const createdUser = await userModel.findOneById(newUser.insertedId)

        return pickUserData(createdUser)
    } catch (error) {
        throw error
    }
}

const updateProfile = async (userId, profileData, cvFile) => {
    try {
        const user = await userModel.findOneById(userId)
        if (!user)
            throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    

        let updatedUser = {}
        if (cvFile)
        {
            const fileExtension = validateFile(cvFile)
            const uploadResult = await cloudinaryProvider.streamUpLoadForCV(cvFile.buffer, 'cv', fileExtension)
            updatedUser = await userModel.update(userId, {
                cvLink: uploadResult.secure_url
            })
        } 
        else {
            updatedUser = await userModel.update(userId, profileData)

        }

        return pickUserData(updatedUser)
    } catch (error) {
        throw error
    }
}

const getUserById = async (userId) => {
    try {
        const user = await userModel.findOneById(userId)
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
        }

        return pickUserData(user)
    } catch (error) {
        throw error
    }
}

const getUserByEmail = async(email) => {
    try {
        const user = await userModel.findOneByEmail(email)
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
        }

        return pickUserData(user)
    } catch (error) {
        throw error
    }
}

const toggleSaveJob = async (userEmail, jobId) => {
    try {
        const updatedUser = await userModel.toggleSaveJob(userEmail, jobId)
        return updatedUser
    } catch (error) {
        throw error
    }
}

const followCompany = async (userEmail, employerId) => {
    try {
        const updatedUser = await userModel.followCompany(userEmail, employerId)
        return updatedUser
    } catch (error) {
        throw error
    }
}

const getSavedJobsDetail = async (email) => {
    const user = await userModel.findOneByEmail(email)
    if (!user)
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')

    const savedJobs = await jobModel.findByIds(user.saveJob || [])

    // Gắn thông tin employer vào từng job
    const jobsWithEmployer = savedJobs.map(job => ({
        ...job
    }))

    return jobsWithEmployer
}


export const userService = {
    createNew,
    getUserByEmail,
    getUserById,
    updateProfile,
    toggleSaveJob,
    getSavedJobsDetail,
    followCompany
}
