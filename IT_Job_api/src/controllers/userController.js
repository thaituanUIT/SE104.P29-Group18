import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'
import { v4 as uuidv4 } from 'uuid'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { applyModel } from '~/models/applyModel'

const createNew = async (req, res, next) => {
    try {
        const userData = req.body // Nhận dữ liệu từ Auth0 callback

        const user = await userService.createNew(userData)
        res.status(StatusCodes.OK).json(user)
    } catch (error) {
        next(error)
    }
}

const getUserByEmail = async(req, res, next) => {
    try {
        const email = req.params.email
        const user = await userService.getUserByEmail(email)

        res.status(StatusCodes.OK).json(user)
    } catch (error) {
        next(error)
    }
}

const getUserById = async (req, res, next) => {
    try {
        const userId = req.params.userId

        const user = await userService.getUserById(userId)
        res.status(StatusCodes.OK).json(user)
    } catch (error) {
        next(error)
    }
}

const updateProfile = async (req, res, next) => {
    try {
        const userId = req.params.userId
        const profileData = req.body
        const cvFile = req.file
        const updatedUser = await userService.updateProfile(userId, profileData, cvFile)
        res.status(StatusCodes.OK).json(updatedUser)
    } catch (error) {
        next(error)
    }
}

const addEducation = async (req, res, next) => {
    try {
        const { userId } = req.params
        const educationData = req.body

        const educationDataWithId = {
            ...educationData,
            id: uuidv4()
        }

        const user = await userService.getUserById(userId)

        // Add new education
        const education = user.education || []
        education.push(educationDataWithId)

        // Update user
        const updatedUser = await userService.updateProfile(userId, { education })

        res.status(StatusCodes.OK).json({
            message: 'Education added successfully',
            education: educationDataWithId
        })
    } catch (error) {
        next(error)
    }
}

// Update education
const updateEducation = async (req, res, next) => {
    try {
        const { userId } = req.params
        const { educationId } = req.params // Now using educationId (our custom ID)
        const educationData = req.body

        const user = await userService.getUserById(userId)

        // Find and update education
        const education = user.education || []
        const index = education.findIndex(edu => edu.id === educationId)
        if (index === -1) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'Education not found'
            })
        }

        // Update the education at the specified index
        education[index] = { ...education[index], ...educationData }

        // Update user
        const updatedUser = await userService.updateProfile(userId, { education })

        res.status(StatusCodes.OK).json({
            message: 'Education updated successfully',
            education: education[index]
        })
    } catch (error) {
        next(error)
    }
}

// Delete education
const deleteEducation = async (req, res, next) => {
    try {
        const { userId } = req.params
        const { educationId } = req.params // Now using educationId (our custom ID)

        const user = await userService.getUserById(userId)
        const education = user.education || []

        // Find the education item by ID
        const index = education.findIndex(edu => edu.id === educationId)

        if (index === -1) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'Education not found'
            })
        }

        // Remove the education at the specified index
        education.splice(index, 1)

        // Update user
        const updatedUser = await userService.updateProfile(userId, { education })

        res.status(StatusCodes.OK).json({
            message: 'Education deleted successfully'
        })
    } catch (error) {
        next(error)
    }
}

// Add experience
const addExperience = async (req, res, next) => {
    try {
        const { userId } = req.params
        const experienceData = req.body

        // Add a unique ID to the experience data
        const experienceWithId = {
            ...experienceData,
            id: uuidv4() // Generate a unique ID
        }

        const user = await userService.getUserById(userId)

        // Add new experience
        const experience = user.experience || []
        experience.push(experienceWithId)

        // Update user
        const updatedUser = await userService.updateProfile(userId, { experience })

        res.status(StatusCodes.OK).json({
            message: 'Experience added successfully',
            experience: experienceWithId
        })
    } catch (error) {
        next(error)
    }
}

// Update experience
const updateExperience = async (req, res, next) => {
    try {
        const { userId } = req.params
        const { experienceId } = req.params // Now using experienceId (our custom ID)
        const experienceData = req.body

        const user = await userService.getUserById(userId)

        // Find and update experience
        const experience = user.experience || []
        const index = experience.findIndex(exp => exp.id === experienceId)

        if (index === -1) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'Experience not found'
            })
        }

        // Update the experience at the specified index
        experience[index] = { ...experience[index], ...experienceData }

        // Update user
        const updatedUser = await userService.updateProfile(userId, { experience })

        res.status(StatusCodes.OK).json({
            message: 'Experience updated successfully',
            experience: experience[index]
        })
    } catch (error) {
        next(error)
    }
}

// Delete experience
const deleteExperience = async (req, res, next) => {
    try {
        const { userId } = req.params
        const { experienceId } = req.params // Now using experienceId (our custom ID)

        const user = await userService.getUserById(userId)
        const experience = user.experience || []

        // Find the experience item by ID
        const index = experience.findIndex(exp => exp.id === experienceId)

        if (index === -1) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'Experience not found'
            })
        }

        // Remove the experience at the specified index
        experience.splice(index, 1)

        // Update user
        const updatedUser = await userService.updateProfile(userId, { experience })

        res.status(StatusCodes.OK).json({
            message: 'Experience deleted successfully'
        })
    } catch (error) {
        next(error)
    }
}

// Add certificate
const addCertificate = async (req, res, next) => {
    try {
        const { userId } = req.params
        const certificateData = req.body

        // Add a unique ID to the certificate data
        const certificateWithId = {
            ...certificateData,
            id: uuidv4() // Generate a unique ID
        }

        const user = await userService.getUserById(userId)

        // Add new certificate
        const certificates = user.certificates || []
        certificates.push(certificateWithId)

        // Update user
        const updatedUser = await userService.updateProfile(userId, { certificates })

        res.status(StatusCodes.OK).json({
            message: 'Certificate added successfully',
            certificate: certificateWithId
        })
    } catch (error) {
        next(error)
    }
}

// Update certificate
const updateCertificate = async (req, res, next) => {
    try {
        const { userId } = req.params
        const { certificateId } = req.params // Now using certificateId (our custom ID)
        const certificateData = req.body

        const user = await userService.getUserById(userId)

        // Find and update certificate
        const certificates = user.certificates || []
        const index = certificates.findIndex(cert => cert.id === certificateId)

        if (index === -1) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'Certificate not found'
            })
        }

        // Update the certificate at the specified index
        certificates[index] = { ...certificates[index], ...certificateData }

        // Update user
        const updatedUser = await userService.updateProfile(userId, { certificates })

        res.status(StatusCodes.OK).json({
            message: 'Certificate updated successfully',
            certificate: certificates[index]
        })
    } catch (error) {
        next(error)
    }
}

// Delete certificate
const deleteCertificate = async (req, res, next) => {
    try {
        const { userId } = req.params
        const { certificateId } = req.params // Now using certificateId (our custom ID)

        const user = await userService.getUserById(userId)
        const certificates = user.certificates || []

        // Find the certificate item by ID
        const index = certificates.findIndex(cert => cert.id === certificateId)

        if (index === -1) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'Certificate not found'
            })
        }

        // Remove the certificate at the specified index
        certificates.splice(index, 1)

        // Update user
        const updatedUser = await userService.updateProfile(userId, { certificates })

        res.status(StatusCodes.OK).json({
            message: 'Certificate deleted successfully'
        })
    } catch (error) {
        next(error)
    }
}


const toggleSaveJobController = async (req, res, next) => {
    try {
        const { email, jobId } = req.body

        if (!email || !jobId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Missing required fields: email or jobId'
            })
        }

        const updatedUser = await userService.toggleSaveJob(email, jobId)

        return res.status(StatusCodes.OK).json({
            message: 'Save job status updated successfully',
            saveJob: updatedUser.value?.saveJob || []
        })
    } catch (error) {
        next(error)
    }
}


const followCompanyController = async (req, res, next) => {
    try {
        const { email, employerId } = req.body

        if (!email || !employerId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Missing required fields: email or employerId'
            })
        }

        const updatedUser = await userService.followCompany(email, employerId)

        return res.status(StatusCodes.OK).json({
            message: 'Save job status updated successfully',
            saveJob: updatedUser.value?.saveCompany || []
        })
    } catch (error) {
        next(error)
    }
}
const getSavedJobsDetail = async(req, res, next) => {
    try {
        const email = req.query.email

        if (!email) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Missing email parameter' })
        }

        const jobs = await userService.getSavedJobsDetail(email)
        res.status(StatusCodes.OK).json(jobs)
    } catch (error) {
        next(error)
    }
}

const getDashboardOverview = async (req, res, next) => {
    try {
        const { email } = req.query

        const user = await userModel.findOneByEmail(email)
        if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')

        const allApplies = await applyModel.findByEmail(email)
        const invitationAccepted = allApplies.filter(a => a.status?.toLowerCase() === 'accepted')

        res.status(StatusCodes.OK).json({
            appliedJobs: allApplies.length,
            savedJobs: user.saveJob?.length || 0,
            jobInvitations: invitationAccepted.length
        })
    } catch (error) {
        next(error)
    }
}


export const userController = {
    createNew,
    getUserByEmail,
    getUserById,
    updateProfile,
    addEducation,
    updateEducation,
    deleteEducation,
    addExperience,
    updateExperience,
    deleteExperience,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    toggleSaveJobController,
    getSavedJobsDetail,
    getDashboardOverview,
    followCompanyController
}