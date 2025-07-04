import { StatusCodes } from 'http-status-codes'
import { applyService } from '~/services/applyService'
import { BrevoProvider } from '~/providers/BrevoProvider'


const emailTemplates = {
    testInvitation: (applicantName, jobTitle) => `
      <div style="
        max-width: 600px;
        margin: 30px auto;
        padding: 30px;
        background: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #2c3e50;
        line-height: 1.6;
      ">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://res.cloudinary.com/sonpham811205/image/upload/v1743226032/Pink_Cartoon_Toy_Store_Logo_1_jfngiu-removebg-preview_utidiz.png" alt="IT_Jobs Logo" style="max-width: 80px;">
        </div>
  
        <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">Thư mời tham gia vòng kiểm tra</h2>
  
        <p>Kính gửi <strong>${applicantName}</strong>,</p>
  
        <p>Chúng tôi đã xem xét hồ sơ của bạn cho vị trí <strong>${jobTitle}</strong> và muốn mời bạn tham gia vòng kiểm tra.</p>
  
        <p>Chúng tôi sẽ gửi cho bạn các bài kiểm tra cụ thể trong email tiếp theo.</p>
  
        <p>Trân trọng,</p>
        <p><strong>Phòng Nhân sự</strong></p>
      </div>
    `,

    rejection: (applicantName, jobTitle) => `
      <div style="
        max-width: 600px;
        margin: 30px auto;
        padding: 30px;
        background: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #2c3e50;
        line-height: 1.6;
      ">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://res.cloudinary.com/sonpham811205/image/upload/v1743226032/Pink_Cartoon_Toy_Store_Logo_1_jfngiu-removebg-preview_utidiz.png" alt="IT_Jobs Logo" style="max-width: 80px;">
        </div>
  
        <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">Thư phản hồi ứng tuyển</h2>
  
        <p>Kính gửi <strong>${applicantName}</strong>,</p>
  
        <p>Cảm ơn bạn đã quan tâm đến vị trí <strong>${jobTitle}</strong> tại công ty chúng tôi.</p>
  
        <p>Sau khi xem xét kỹ lưỡng hồ sơ của bạn, chúng tôi rất tiếc phải thông báo rằng chúng tôi đã quyết định tiếp tục với các ứng viên khác có kinh nghiệm phù hợp hơn với yêu cầu hiện tại của chúng tôi.</p>
  
        <p>Chúng tôi đánh giá cao sự quan tâm của bạn và khuyến khích bạn theo dõi các cơ hội khác tại công ty trong tương lai.</p>
  
        <p>Trân trọng,</p>
        <p><strong>Phòng Nhân sự</strong></p>
      </div>
    `
}


const applyJob = async(req, res, next) => {
    try {
        const file = req.file // CV file from multer
        const result = await applyService.createApply(req.body, file)
        res.status(StatusCodes.CREATED).json(result)
    } catch (error) {
        next(error)
    }
}

const getAppliedJobs = async (req, res, next) => {
    try {

        const { email } = req.query
        const appliedJobs = await applyService.getAppliedJobsByEmail(email)
        res.status(StatusCodes.OK).json(appliedJobs)
    } catch (error) {
        next(error)
    }
}


const getAppliedJobsByEmail = async (req, res, next) => {
    try {
        const { email } = req.params

        if (!email) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                errors: 'Email is required'
            })
        }

        const jobIds = await applyService.getAppliedJobsByEmail(email)

        return res.status(StatusCodes.OK).json({
            jobIds
        })
    } catch (error) {
        next(error)
    }
}

const getApplicationsByEmployerIdInCVPhase = async (req, res, next) => {
    try {
        const { employerId } = req.params

        // Validate employerId
        if (!employerId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                errors: 'Employer ID is required'
            })
        }

        const applications = await applyService.getApplicationsByEmployerIdInCVPhase(employerId)

        return res.status(StatusCodes.OK).json({
            applications
        })
    } catch (error) {
        next(error)
    }
}

const getApplicationsByEmployerId = async (req, res, next) => {
    try {
        const { employerId } = req.params

        // Validate employerId
        if (!employerId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                errors: 'Employer ID is required'
            })
        }

        const applications = await applyService.getApplicationsByEmployerId(employerId)

        return res.status(StatusCodes.OK).json({
            applications
        })
    } catch (error) {
        next(error)
    }
}

const getApplicationsByEmployerIdDashboard = async (req, res, next) => {
    try {
        const { employerId } = req.params

        // Validate employerId
        if (!employerId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                errors: 'Employer ID is required'
            })
        }

        const applications = await applyService.getApplicationsByEmployerIdDashboard(employerId)

        return res.status(StatusCodes.OK).json({
            applications
        })
    } catch (error) {
        next(error)
    }
}


const getApplicationsByJobId = async (req, res, next) => {
    try {
        const { jobId } = req.params

        // Validate jobId
        if (!jobId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                errors: 'Job ID is required'
            })
        }

        const applications = await applyService.getApplicationsByJobId(jobId)

        return res.status(StatusCodes.OK).json({
            applications
        })
    } catch (error) {
        next(error)
    }
}

const updateApplicationStatus = async (req, res, next) => {
    try {
        const { applicationId } = req.params
        const { status, rejectionReason, applicantName, jobName, email, phase } = req.body

        // Validate inputs
        if (!applicationId || !status) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                errors: 'Application ID and status are required'
            })
        }

        const updatedApplication = await applyService.updateApplicationStatus(
            applicationId,
            status,
            rejectionReason,
            phase
        )

        if (status === 'Accepted')
            BrevoProvider.sendEmail(email, 'Thông báo kết quả tuyển dụng', emailTemplates.testInvitation(applicantName, jobName))
        else
            BrevoProvider.sendEmail(email, 'Thông báo kết quả tuyển dụng', emailTemplates.rejection(applicantName, jobName))


        return res.status(StatusCodes.OK).json({
            application: updatedApplication
        })

    } catch (error) {
        next(error)
    }
}

const deleteApplication = async (req, res, next) => {
    try {
        const { applicationId } = req.params

        // Validate inputs
        if (!applicationId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                errors: 'Application ID is required'
            })
        }

        const result = await applyService.deleteApplication(applicationId)

        return res.status(StatusCodes.OK).json({
            message: 'Application deleted successfully',
            application: result
        })
    } catch (error) {
        next(error)
    }
}

const checkIfApplied = async (req, res, next) => {
    try {
        const { email, jobId } = req.params

        // Validate inputs
        if (!email || !jobId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                errors: 'Email and Job ID are required'
            })
        }

        const hasApplied = await applyService.checkIfApplied(email, jobId)

        return res.status(StatusCodes.OK).json({
            hasApplied
        })
    } catch (error) {
        next(error)
    }
}

const getApplicationById = async (req, res, next) => {
    try {
        const { applicationId } = req.params
        const application = await applyService.getApplicationById(applicationId)
        res.status(StatusCodes.OK).json({
            status: 'success',
            data: application
        })
    } catch (error) {
        next(error)
    }
}

const moveApplicantToInterviewRound = async(req, res, next) => {
    try {

        const { applicantId } = req.params
        const updateData = req.body


        const application = await applyService.moveApplicantToInterviewRound(applicantId, updateData)

        res.status(StatusCodes.OK).json(application)

    } catch (error)
    {
        next(error)
    }
}

const getApplicationsInInterviewPhaseByEmployer = async (req, res, next) => {
    try {
        const { employerId } = req.params
        if (!employerId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                errors: 'Employer ID is required'
            })
        }
        const applications = await applyService.getApplicationsInInterviewPhaseByEmployerId(employerId)
        return res.status(StatusCodes.OK).json({
            applications
        })
    } catch (error) {
        next(error)
    }
}

const getApplicationsByEmailGrouped = async (req, res, next) => {
    try {
        const { email } = req.query
        const result = await applyService.getApplicationsGroupedByStatus(email)
        res.status(StatusCodes.OK).json(result)
    } catch (error) {
        next(error)
    }
}


export const applyController = {
    applyJob,
    getAppliedJobs,
    getAppliedJobsByEmail,
    checkIfApplied,
    deleteApplication,
    updateApplicationStatus,
    getApplicationsByJobId,
    getApplicationsByEmployerId,
    getApplicationById,
    moveApplicantToInterviewRound,
    getApplicationsByEmployerIdInCVPhase,
    getApplicationsInInterviewPhaseByEmployer,
    getApplicationsByEmailGrouped,
    getApplicationsByEmployerIdDashboard

}