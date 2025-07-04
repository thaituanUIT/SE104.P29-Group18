import authorizedAxios from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'
import { toast } from 'react-toastify'
import { TokenSharp } from '@mui/icons-material'
import axios from 'axios'

//API cho employer
export const employerRegisterAPI = async(data) => {
    const response = await authorizedAxios.post(`${API_ROOT}/server/employers/register`, data)
    toast.success('Account created successfully, please check your email to verify your account')
    return response.data
}

export const employerVerifyAccountAPI = async(data) => {
    const response = await authorizedAxios.put(`${API_ROOT}/server/employers/verify_account`, data)
    toast.success('Account verified successfully, Login to use IT_Jobs for Employers')
    return response.data
}

export const employerRefreshTokenAPI = async() => {
    return await authorizedAxios.put(`${API_ROOT}/server/employers/refresh_token/`)
}

export const getEmployerByIdAPI = async(employerId) => {
    const response = await authorizedAxios.get(`${API_ROOT}/server/employers/${employerId}`)   
    return response.data
  }

  export const getEmployer = async() => {
    const response = await authorizedAxios.get(`${API_ROOT}/server/employers/getEmployer`)   
    return response.data
  }

// Get all jobIds the user applied to
export const getAppliedJobsByEmail = async (email) => {
    const response = await authorizedAxios.get(`${API_ROOT}/server/apply/applied/${email}`)
    return response.data.jobIds
}

// Check if user applied to a specific job
export const checkIfApplied = async (email, jobId) => {
    const response = await authorizedAxios.get(`${API_ROOT}/server/apply/check/${email}/${jobId}`)
    return response.data.hasApplied
}

// Fetch all applications by employer in cv pahse
export const fetchApplicationsByEmployerIdInCVPhase = async (employerId) => {
  const response = await authorizedAxios.get(`${API_ROOT}/server/apply/employer-cvPhase/${employerId}`)
  return response.data.applications
}

export const getApplicationsInInterviewPhaseForEmployer = async (employerId) => {
  const response = await authorizedAxios.get(`${API_ROOT}/server/apply/employer-interviewPhase/${employerId}`)
  return response.data.applications
}

// Fetch all applications by employer
export const fetchApplicationsByEmployerId = async (employerId) => {
    const response = await authorizedAxios.get(`${API_ROOT}/server/apply/employer/${employerId}`)
    console.log("response", response.data)
    return response.data.applications
}

export const fetchApplicationsByEmployerIdDashBoard = async (employerId) => {
  const response = await authorizedAxios.get(`${API_ROOT}/server/apply/employer/fetchApplicant/${employerId}`)
  console.log("response", response.data)
  return response.data.applications
}

// Fetch all applications for a job
export const fetchApplicationsByJobId = async (jobId) => {
    const response = await authorizedAxios.get(`${API_ROOT}/server/apply/job/${jobId}`)
    return response.data.applications
}

export const getApplicantById = async (applicationId) => {
    const response = await authorizedAxios.get(`${API_ROOT}/server/apply/${applicationId}`)
    return response.data
}

//Move applicant to interview round
export const moveApplicantToInterviewRound = async(applicationId, updateData) => {
  const response = await authorizedAxios.post(`${API_ROOT}/server/apply/moveToInterviewRoute/${applicationId}`,updateData)
  return response.data
}

// Update application status
export const updateApplicationStatus = async (applicationId, status, rejectionReason = '', applicantName, jobName, email, phase) => {
    const response = await authorizedAxios.post(`${API_ROOT}/server/apply/${applicationId}/status`, {
        status,
        rejectionReason,
        applicantName,
        jobName,
        email,
        phase
    })
    return response.data.application
}

// Delete application
export const deleteApplication = async (applicationId) => {
    const response = await authorizedAxios.delete(`${API_ROOT}/server/apply/${applicationId}`)
    return response.data
}

//API for jobs
export const createNewJobsAPI = async(data) => {
    const response = await authorizedAxios.post(`${API_ROOT}/server/jobs/createNewJob`, data)
    toast.success('Create new job success')
    return response.data
}

export const fetchJobdByEmployerId = async(employerId) => {
     const response = await authorizedAxios.get(`${API_ROOT}/server/jobs/by-employer/${employerId}`)
    return response.data
}

export const getJobByIdAPI = async(id) => {
    const response = await authorizedAxios.get(`${API_ROOT}/server/jobs/${id}`)
    return response.data
}

export const getNewJobsAPI = async() => {
    const response = await authorizedAxios.get(`${API_ROOT}/server/jobs/getNewJobs`, {
        withCredentials: false,
    })
    return response.data
}

export const fetchJobDetails = async (jobIds) => {
    if (!jobIds || jobIds.length === 0) {
            return [];
    }
    const response = await authorizedAxios.get(
            `${API_ROOT}/server/jobs/multiple?jobIds=${jobIds.join(',')}`
          );

    return response.data.data; // Expecting array of job objects
}

// API for apply
export const applyNewJob = async(reqData) => {
    const response = await authorizedAxios.post(`${API_ROOT}/server/apply/applyNewJob`, reqData, {
        headers: { 'Content-Type' : 'multipart/form-data' }
    })

    return response.data
}

export const getApplicationsByEmailGrouped = async (email) => {
  const response = await authorizedAxios.get(`${API_ROOT}/server/apply/getApplicationGrouped`, {
    params: {email: email}
  })
  return response.data
}


//API for user

export const dashBoardAPI = async (email) => {
  const response = await authorizedAxios.get(`${API_ROOT}/server/users/dashboard-overview`, {
    params: {email: email}
  })
  return response.data
}

export const toggleSaveJobAPI = async(updateData) => {
  const response = await authorizedAxios.post(`${API_ROOT}/server/users/save-job`, updateData)
  return response.data
}

export const followCompanyAPI = async(updateData) => {
  const response = await authorizedAxios.post(`${API_ROOT}/server/users/followCompany`, updateData)
  return response.data
}

export const getSavedJobDetails = async(email) => {
  const response = await authorizedAxios.get(`${API_ROOT}/server/users/saved-jobs`, {
    params: {email: email}
  })
  return response.data
}

export const getUserProfile = async(email) => { 
  const response = await authorizedAxios.get(`${API_ROOT}/server/users/email/${email}`)
  return response.data
}

export const updateUserProfile = async (userId, profileData) => {
    const response = await authorizedAxios.post(`${API_ROOT}/server/users/${userId}`, profileData)
    return response.data
}

export const addEducation = async(userId, educationData) => {
    const response = await authorizedAxios.post(`${API_ROOT}/server/users/${userId}/education`, educationData)
    return response.data
}

export const updateEducation = async(userId, educationId, educationData) => {
    const response = await authorizedAxios.post(`${API_ROOT}/server/users/${userId}/education/${educationId}`, educationData)
    return response.data
}

export const deleteEducation = async (userId, educationId) => {
    const response = await authorizedAxios.delete(`${API_ROOT}/server/users/${userId}/education/${educationId}`)
    return response.data
}

export const addExperience = async (userId, experienceData) => {
    const response = await authorizedAxios.post(`${API_ROOT}/server/users/${userId}/experience`, experienceData)
    return response.data
  }
  
  export const updateExperience = async (userId, experienceId, experienceData) => {
    const response = await authorizedAxios.post(`${API_ROOT}/server/users/${userId}/experience/${experienceId}`, experienceData)
    return response.data
  }
  
  export const deleteExperience = async (userId, experienceId) => {
    const response = await authorizedAxios.delete(`${API_ROOT}/server/users/${userId}/experience/${experienceId}`)
    return response.data
  }
  
  export const addCertificate = async (userId, certificateData) => {
    const response = await authorizedAxios.post(`${API_ROOT}/server/users/${userId}/certificates`, certificateData)
    return response.data
  }
  
  export const updateCertificate = async (userId, certificateId, certificateData) => {
    const response = await authorizedAxios.post(`${API_ROOT}/server/users/${userId}/certificates/${certificateId}`, certificateData)
    return response.data
  }
  
  export const deleteCertificate = async (userId, certificateId) => {
    const response = await authorizedAxios.delete(`${API_ROOT}/server/users/${userId}/certificates/${certificateId}`)
    return response.data
  }
  

// ========== Test Series ==========
export const getTestSeriesByJobId = async (jobId) => {
  const response = await authorizedAxios.get(`${API_ROOT}/server/tests/test-series/job/${jobId}`)
  return response.data
}

export const createTestSeries = async (data) => {
  const response = await authorizedAxios.post(`${API_ROOT}/server/tests/test-series`, data)
  toast.success('Test series created successfully')
  return response.data
}

export const updateTestSeries = async (testSeriesId, data) => {
  const response = await authorizedAxios.put(`${API_ROOT}/server/tests/test-series/${testSeriesId}`, data)
  toast.success('Test series updated successfully')
  return response.data
}

export const deleteTestSeries = async (testSeriesId) => {
  const response = await authorizedAxios.delete(`${API_ROOT}/server/tests/test-series/${testSeriesId}`)
  toast.success('Test series deleted successfully')
  return response.data
}

// ========== Tests ==========
export const getTestsByJobId = async (jobId) => {
  const response = await authorizedAxios.get(`${API_ROOT}/server/tests/tests/job/${jobId}`)
  return response.data
}

export const getTestsByJobIdAndTestSeriesId = async (jobId, testSeriesId) => {
  const response = await authorizedAxios.get(`${API_ROOT}/server/tests/tests/job/${jobId}/test-series/${testSeriesId}`)
  return response.data
}

export const createTest = async (data) => {
  const response = await authorizedAxios.post(`${API_ROOT}/server/tests/tests`, data)
  toast.success('Test created successfully')
  return response.data
}

export const updateTest = async (testId, data) => {
  const response = await authorizedAxios.put(`${API_ROOT}/server/tests/tests/${testId}`, data)
  toast.success('Test updated successfully')
  return response.data
}

export const deleteTest = async (testId) => {
  const response = await authorizedAxios.delete(`${API_ROOT}/server/tests/tests/${testId}`)
  toast.success('Test deleted successfully')
  return response.data
}

// ========== Test Progress ==========
export const updateTestProgress = async (applicationId, testSeriesId, data) => {
  const response = await authorizedAxios.put(`${API_ROOT}/server/tests/test-progress/${applicationId}/${testSeriesId}`, data)
  toast.success('Progress updated successfully')
  return response.data
}

export const getTestProgressByApplicationId = async (applicationId) => {
  const response = await authorizedAxios.get(`${API_ROOT}/server/tests/test-progress/application/${applicationId}`)
  return response.data
}

// ========== Email ==========
export const sendTestInvitation = async (applicationId, testSeriesId) => {
  const response = await authorizedAxios.post(`${API_ROOT}/server/tests/send-test-invitation/${applicationId}/${testSeriesId}`)
  toast.success('Test invitation sent successfully')
  return response.data
}

export const sendTestInvitationToAll = async (jobId, testSeriesId) => {
  const response = await authorizedAxios.post(`${API_ROOT}/server/tests/send-test-invitation-to-all/${jobId}/${testSeriesId}`)
  toast.success('Test invitations sent to all successfully')
  return response.data
}




// ========== Interview Management APIs ==========

// Lấy danh sách công việc đã tạo vòng phỏng vấn theo employerId
export const getJobsWithInterviewRounds = async (employerId) => {
  const response = await authorizedAxios.get(`${API_ROOT}/server/interview-management/jobs/${employerId}`)
  return response.data.jobs
}

// Lấy danh sách ứng viên đã đủ điều kiện cho vòng phỏng vấn
export const getQualifiedApplicants = async (jobId) => {
  const response = await authorizedAxios.get(`${API_ROOT}/server/interview-management/applicants/${jobId}`)
  return response.data.applicants
}

export const getQualifiedApplicantsByEmployer = async (employerId) => {
  const response = await authorizedAxios.get(`${API_ROOT}/server/interview-management/qualified-applicants-by-employer/${employerId}`)
  return response.data
}

// Lấy danh sách phỏng vấn theo jobId
export const getInterviewsByJobId = async (jobId) => {
  const response = await authorizedAxios.get(`${API_ROOT}/server/interview-management/interviews/${jobId}`)
  return response.data.interviews
}

// Tạo một vòng phỏng vấn mới cho công việc
export const createInterviewRound = async (jobId, roundData) => {
  const response = await authorizedAxios.post(`${API_ROOT}/server/interview-management/rounds/${jobId}`, roundData)
  return response.data.round
}

// Lưu thông tin phỏng vấn (tạo mới hoặc cập nhật nếu có interviewId)
export const saveInterview = async (dialogType, formData, jobId, applicantId, roundId, interviewId = null) => {
  const payload = { dialogType, formData, jobId, applicantId, roundId, interviewId }
  const response = await authorizedAxios.post(`${API_ROOT}/server/interview-management/interviews`, payload)
  return response.data.result
}

// Xóa một cuộc phỏng vấn theo interviewId
export const deleteInterview = async (interviewId) => {
  const response = await authorizedAxios.delete(`${API_ROOT}/server/interview-management/interviews/${interviewId}`)
  return response.data
}

// Gửi email mời phỏng vấn
export const sendInterviewInvitation = async (interviewId) => {
  const response = await authorizedAxios.post(`${API_ROOT}/server/interview-management/interviews/${interviewId}/send-invitation`)
  return response.data
}

// Lấy danh sách ứng viên theo vòng phỏng vấn
export const getApplicantsForRound = async (jobId, roundId) => {
  const response = await authorizedAxios.get(`${API_ROOT}/server/interview-management/rounds/${jobId}/${roundId}/applicants`)
  return response.data.applicants
}

// Lấy danh sách cuộc phỏng vấn trong một vòng cụ thể
export const getRoundInterviews = async (jobId, roundId) => {
  const response = await authorizedAxios.get(`${API_ROOT}/server/interview-management/rounds/${jobId}/${roundId}/interviews`)
  return response.data.interviews
}

// Lấy thông tin chi tiết của một ứng viên đang ở giai đoạn phỏng vấn
export const getApplicantByIdInInterviewPhase = async (applicantId) => {
  const response = await authorizedAxios.get(`${API_ROOT}/server/interview-management/applicant/${applicantId}`)
  return response.data.applicant
}

// Cập nhật tiến độ ứng viên trong quy trình tuyển dụng
export const updateApplicantProgress = async (applicantId, jobId, progressData) => {
  const response = await authorizedAxios.put(`${API_ROOT}/server/interview-management/progress/${applicantId}/${jobId}`, progressData)
  return response.data
}

// Lấy thống kê phỏng vấn cho một công việc
export const getInterviewStatistics = async (jobId) => {
  const response = await authorizedAxios.get(`${API_ROOT}/server/interview-management/statistics/${jobId}`)
  return response.data.statistics
}

// Cập nhật thông tin vòng phỏng vấn
export const updateInterviewRound = async (roundId, roundData) => {
  const response = await authorizedAxios.put(`${API_ROOT}/server/interview-management/rounds/${roundId}`, roundData)
  return response.data.round
}

// Xóa một vòng phỏng vấn
export const deleteInterviewRound = async (roundId) => {
  const response = await authorizedAxios.delete(`${API_ROOT}/server/interview-management/rounds/${roundId}`)
  return response.data
}

// Cập nhật trạng thái hàng loạt các cuộc phỏng vấn
export const bulkUpdateInterviewStatus = async (interviewIds, status) => {
  const response = await authorizedAxios.post(`${API_ROOT}/server/interview-management/interviews/bulk-update`, {
    interviewIds,
    status,
  })
  return response.data
}

// Lấy dữ liệu hiển thị lịch phỏng vấn theo ngày bắt đầu và kết thúc
export const getInterviewCalendar = async (employerId, startDate, endDate) => {
  const response = await authorizedAxios.get(`${API_ROOT}/server/interview-management/calendar/${employerId}`, {
    params: { startDate, endDate },
  })
  return response.data.calendar
}

// Xuất dữ liệu phỏng vấn ra file (excel hoặc csv)
export const exportInterviewData = async (jobId, format = 'excel') => {
  const response = await authorizedAxios.get(`${API_ROOT}/server/interview-management/export/${jobId}`, {
    params: { format },
    responseType: 'blob',
  })

  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `interview-data-${jobId}.${format === 'excel' ? 'xlsx' : 'csv'}`)
  document.body.appendChild(link)
  link.click()
  link.remove()

  return response.data
}

// Gửi nhắc nhở phỏng vấn cho danh sách interviewIds
export const sendInterviewReminders = async (interviewIds) => {
  const response = await authorizedAxios.post(`${API_ROOT}/server/interview-management/send-reminders`, { interviewIds })
  return response.data
}

// Lấy feedback từ cuộc phỏng vấn
export const getInterviewFeedback = async (interviewId) => {
  const response = await authorizedAxios.get(`${API_ROOT}/server/interview-management/feedback/${interviewId}`)
  return response.data.feedback
}

// Gửi feedback cho cuộc phỏng vấn
export const submitInterviewFeedback = async (interviewId, feedbackData) => {
  const response = await authorizedAxios.post(`${API_ROOT}/server/interview-management/feedback/${interviewId}`, feedbackData)
  return response.data
}

export const getJobsWithFiltersAPI = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.skills) params.append('skills', filters.skills);
    if (filters.city) params.append('city', filters.city);
    if (filters.acceptFresher !== undefined) params.append('acceptFresher', filters.acceptFresher);
    if (filters.jobType) params.append('jobType', filters.jobType);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await authorizedAxios.get(`${API_ROOT}/server/jobs/findJob`, { params });
   
    return response.data.data; // Trả về danh sách jobs, totalJobs, totalPages, currentPage
  } catch (error) {
    console.error('Error fetching jobs:', error);
    toast.error('An error occurred while fetching jobs');
    throw error;
  }
};

// ===========Notifications API===============
export const createNotifications = async (data) => {
  const response = await authorizedAxios.post(`${API_ROOT}/server/notifications/createNewNoti`, data)
  return response.data
}