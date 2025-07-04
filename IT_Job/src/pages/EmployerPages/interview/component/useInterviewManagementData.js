// src/pages/EmployerPages/interview/component/useInterviewManagementData.js
"use client"

import { useState, useCallback } from "react"
import {
  getJobsWithInterviewRounds,
  getQualifiedApplicantsByEmployer, // Import API mới để lấy tất cả applicants
  getInterviewsByJobId,
  createInterviewRound,
  saveInterview,
  deleteInterview,
  sendInterviewInvitation,
  getQualifiedApplicants // Vẫn import nếu bạn có logic nào đó cần fetch riêng lẻ
} from "~/apis"

const useInterviewManagement = () => {
  const [jobs, setJobs] = useState([])
  const [allQualifiedApplicants, setAllQualifiedApplicants] = useState([]) // State để lưu TẤT CẢ applicants của employer
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  const showSnackbar = useCallback((message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    })
  }, [])

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }, [])

  // Hàm tải dữ liệu ban đầu: jobs và TẤT CẢ applicants của employer
  const fetchInitialData = useCallback(
    async (employerId) => {
      try {
        setLoading(true)
        setError(null)

        // Fetch jobs
        const jobsData = await getJobsWithInterviewRounds(employerId)

        const mappedJobs = jobsData.map(job => ({ ...job, id: job._id || job.id }));
        setJobs(mappedJobs)
        console.log("useInterviewManagementData - fetchInitialData: Jobs received:", mappedJobs)

        // Fetch all qualified applicants for this employer bằng API mới
        let applicantsOverallData = [];
        // Kiểm tra xem API getQualifiedApplicantsByEmployer có tồn tại không.

        if (typeof getQualifiedApplicantsByEmployer === 'function') {
          // Gọi API chung cho employer
          const response = await getQualifiedApplicantsByEmployer(employerId);
          applicantsOverallData = response.applicants; 
        } else {
          // Fallback: Nếu không có API chung, lặp qua từng job để lấy applicants.
          console.warn("getQualifiedApplicantsByEmployer API not found. Falling back to fetching applicants per job.");
          const jobIds = mappedJobs.map(job => String(job.id));
          const applicantPromises = jobIds.map(jobId => getQualifiedApplicants(jobId));
          const results = await Promise.all(applicantPromises);
          applicantsOverallData = results.flat(); // Gộp tất cả kết quả lại
        }

        // Ánh xạ _id sang id cho applicants
        const mappedApplicants = applicantsOverallData.map(applicant => ({ ...applicant, id: applicant._id || applicant.id }));
        setAllQualifiedApplicants(mappedApplicants) // Lưu vào state allQualifiedApplicants
        console.log("useInterviewManagementData - fetchInitialData: All applicants received:", mappedApplicants)

      } catch (error) {
        console.error("useInterviewManagementData - fetchInitialData: Error fetching initial data:", error)
        setError(error.message)
        showSnackbar(error.message, "error")
      } finally {
        setLoading(false)
      }
    },
    [showSnackbar],
  )

  // Hàm này chỉ để fetch interviews khi xem chi tiết job, KHÔNG fetch applicants nữa
  const fetchInterviewsForJobDetail = useCallback(
    async (jobId) => {
      try {
        setLoading(true)
        const interviewsData = await getInterviewsByJobId(jobId)
        // Ánh xạ _id sang id
        const mappedInterviews = interviewsData.map(interview => ({ ...interview, id: interview._id || interview.id }));
        setInterviews(mappedInterviews)
        setError(null)
      } catch (error) {
        setError(error.message)
        showSnackbar("Error fetching interviews", "error")
      } finally {
        setLoading(false)
      }
    },
    [showSnackbar],
  )

  const handleCreateInterviewRound = useCallback(async (jobId, formData) => {
    try {
      setLoading(true)
      const newRound = await createInterviewRound(jobId, formData)
      const mappedNewRound = { ...newRound, id: newRound._id || newRound.id }; // Ánh xạ _id sang id

      setJobs((prevJobs) => {
        return prevJobs.map((job) => {
          if (String(job._id || job.id) === String(jobId)) { // Đảm bảo so sánh ID đúng
            return {
              ...job,
              interviewRounds: [...(job.interviewRounds || []), mappedNewRound].sort((a, b) => a.order - b.order),
            }
          }
          return job
        })
      })
      setError(null)
      return mappedNewRound
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSaveInterview = useCallback(
    async (dialogType, formData, selectedJob, selectedApplicant, selectedRoundId, selectedInterview) => {
      try {
        setLoading(true)

        const result = await saveInterview( // `result` ở đây là cái mà service trả về
          dialogType,
          formData,
          selectedJob?.id || selectedJob?._id,
          selectedApplicant?.id || selectedApplicant?._id,
          selectedRoundId,
          selectedInterview?.id || selectedInterview?._id,
        )
        // mappedResult sẽ là interview nếu dialogType là 'add' hoặc 'edit',
        // hoặc là updatedProgressRecord nếu dialogType là 'evaluate'/'editOverallEvaluation'
        console.log("testResult", result);
        const mappedResult = { ...result, id: result._id || result.id };

        if (dialogType === "add") {
          setInterviews((prev) => [...prev, mappedResult])
        } else if (dialogType === "edit" || dialogType === "evaluate") {
          setInterviews((prev) =>
            prev.map((interview) =>
              String(interview._id || interview.id) === String(mappedResult._id || mappedResult.id)
                ? mappedResult
                : interview,
            ),
          )
        }

        // Khi đánh giá, cập nhật trong allQualifiedApplicants
        if (dialogType === "evaluate" && result.evaluation?.result) {
          const evaluationResult = result.evaluation.result

          setAllQualifiedApplicants((prev) => // Cập nhật state chung
            prev.map((applicant) => {
              if (String(applicant.id || applicant._id) === String(selectedApplicant.id || selectedApplicant._id)) {
                const updatedProgress = (applicant.interviewProgress || []).map((p) => {
                  if (String(p.roundId) === String(selectedInterview.roundId || selectedInterview.id)) {
                    return {
                      ...p,
                      status: "Đã hoàn thành",
                      result: evaluationResult,
                    }
                  }
                  return p
                })

                const updatedApplicant = {
                  ...applicant,
                  interviewProgress: updatedProgress,
                }

                if (evaluationResult === "Đạt") {
                  const rounds = (selectedJob.interviewRounds || []).sort((a, b) => a.order - b.order)
                  const currentRoundIndex = rounds.findIndex(
                    (r) => String(r.id || r._id) === String(selectedInterview.roundId || selectedInterview.id),
                  )

                  if (currentRoundIndex < rounds.length - 1) {
                    updatedApplicant.currentRound = rounds[currentRoundIndex + 1].id || rounds[currentRoundIndex + 1]._id
                  } else {
                    updatedApplicant.currentOverallStatus = "Đạt"
                  }
                } else {
                  updatedApplicant.currentOverallStatus = "Không đạt"
                }

                return updatedApplicant
              }
              return applicant
            }),
          )
        }

        // Khi sửa đánh giá tổng quan, cập nhật trong allQualifiedApplicants
        if (dialogType === "editOverallEvaluation") {
            // `result` ở đây chính là `updatedProgressRecord` từ service backend
            setAllQualifiedApplicants((prev) => // Cập nhật state chung
                prev.map((applicant) => {
                    if (String(applicant.id || applicant._id) === String(selectedApplicant.id || selectedApplicant._id)) {
                        return {
                            ...applicant,
                            currentOverallStatus: result.currentOverallStatus, // Lấy từ `result` API trả về
                            skills: result.skills, // Lấy từ `result` API trả về
                            overallNotes: result.overallNotes, // Lấy từ `result` API trả về
                            // Đảm bảo các trường khác cũng được cập nhật nếu chúng thay đổi
                            // từ result nếu cần (ví dụ: interviewProgress nếu nó cũng thay đổi)
                            interviewProgress: result.interviewProgress || applicant.interviewProgress // Nếu interviewProgress có thể thay đổi trong overallEvaluation
                        }
                    }
                    return applicant
                }),
            )
            // Trả về `result` để `handleSaveInterviewAndRefresh` ở `index.jsx` có thể sử dụng
            return result;
        }
        setError(null)
        // Cuối cùng, trả về `result` (có thể là `mappedResult` cho interviews, hoặc `result` cho evaluation/overallEvaluation)
        return result; // Đây là giá trị trả về của `handleSaveInterview`
      } catch (error) {
        setError(error.message)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [], // Dependencies: None, as it uses values from `args` directly or relies on useCallback stability
)

  const handleDeleteInterview = useCallback(
    async (interviewId) => {
      try {
        setLoading(true)
        const interviewToDelete = interviews.find((i) => String(i._id || i.id) === String(interviewId))
        await deleteInterview(interviewId)

        setInterviews((prev) => prev.filter((i) => String(i._id || i.id) !== String(interviewId)))

        // Khi xóa interview, cập nhật trong allQualifiedApplicants
        if (interviewToDelete) {
          setAllQualifiedApplicants((prev) => // Cập nhật state chung
            prev.map((applicant) => {
              if (String(applicant.id || applicant._id) === String(interviewToDelete.applicantId || interviewToDelete.applicantId._id)) {
                const updatedProgress = (applicant.interviewProgress || []).map((p) => {
                  if (String(p.roundId) === String(interviewToDelete.roundId || interviewToDelete.roundId._id)) {
                    return {
                      ...p,
                      status: null,
                      result: null,
                    }
                  }
                  return p
                })

                return {
                  ...applicant,
                  interviewProgress: updatedProgress,
                }
              }
              return applicant
            }),
          )
        }
        setError(null)
      } catch (error) {
        setError(error.message)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [interviews],
  )

  const handleSendInvitation = useCallback(async (interviewId) => {
    try {
      setLoading(true)
      const result = await sendInterviewInvitation(interviewId)
      console.log("asdka", result)
      const mappedResult = { ...result.result, id: result.result._id || result.result.id };

      setInterviews((prev) =>
        prev.map((interview) => {
          if (String(interview._id || interview.id) === String(interviewId)) {
            return {
              ...interview,
              status: "Đã xác nhận",
            }
          }
          return interview
        }),
      )

      const updatedInterview = mappedResult

      // Khi gửi lời mời, cập nhật trong allQualifiedApplicants
      setAllQualifiedApplicants((prev) => // Cập nhật state chung
        prev.map((applicant) => {
          if (String(applicant.id || applicant._id) === String(updatedInterview.applicantId || updatedInterview.applicantId._id)) {
            const updatedProgress = (applicant.interviewProgress || []).map((p) => {
              if (String(p.roundId) === String(updatedInterview.roundId || updatedInterview.roundId._id)) {
                return {
                  ...p,
                  status: "Đã xác nhận",
                }
              }
              return p
            })

            return {
              ...applicant,
              interviewProgress: updatedProgress,
            }
          }
          return applicant
        }),
      )

      setError(null)
      return result
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  // Helper functions - bây giờ sẽ lọc từ allQualifiedApplicants
  const getJobQualifiedApplicants = useCallback(
    (jobId) => {
      return allQualifiedApplicants.filter((applicant) => String(applicant.jobId) === String(jobId))
    },
    [allQualifiedApplicants],
  )

  const getRoundInterviewsLocal = useCallback(
    (jobId, roundId) => {
      return interviews.filter(
        (interview) =>
          String(interview.jobId) === String(jobId) && String(interview.roundId) === String(roundId),
      )
    },
    [interviews],
  )

  const getApplicantByIdLocal = useCallback(
    (id) => {
      return allQualifiedApplicants.find((applicant) => String(applicant.id || applicant._id) === String(id))
    },
    [allQualifiedApplicants],
  )

  const getApplicantsForRoundLocal = useCallback(
    (jobId, roundId) => {
      return allQualifiedApplicants.filter((applicant) => {
        if (String(applicant.jobId) !== String(jobId)) return false

        const hasProgressInRound = (applicant.interviewProgress || []).some(
          (p) => String(p.roundId) === String(roundId) && p.status !== null,
        )

        if (hasProgressInRound) return true

        const job = jobs.find((j) => String(j._id || j.id) === String(jobId))
        if (!job) return false

        const currentRoundDetails = (job.interviewRounds || []).find((r) => String(r._id || r.id) === String(roundId))
        if (!currentRoundDetails) return false

        if (currentRoundDetails.order === 1) {
          const hasInterviewScheduled = interviews.some(
            (i) =>
              String(i.jobId) === String(jobId) &&
              String(i.applicantId) === String(applicant.id || applicant._id) &&
              String(i.roundId) === String(roundId),
          )
          return !hasInterviewScheduled
        }

        const previousRoundDetails = (job.interviewRounds || []).find((r) => r.order === currentRoundDetails.order - 1)
        if (previousRoundDetails) {
          const prevRoundProgress = (applicant.interviewProgress || []).find(
            (p) => String(p.roundId) === String(previousRoundDetails._id || previousRoundDetails.id),
          )

          const hasInterviewScheduled = interviews.some(
            (i) =>
              String(i.jobId) === String(jobId) &&
              String(i.applicantId) === String(applicant.id || applicant._id) &&
              String(i.roundId) === String(roundId),
          )

          return (
            prevRoundProgress?.status === "Đã hoàn thành" &&
            prevRoundProgress?.result === "Đạt" &&
            !hasInterviewScheduled
          )
        }

        return false
      })
    },
    [allQualifiedApplicants, jobs, interviews],
  )

  return {
    jobs,
    setJobs,
    qualifiedApplicants: allQualifiedApplicants, // Export allQualifiedApplicants dưới tên qualifiedApplicants
    setQualifiedApplicants: setAllQualifiedApplicants, // Export setter cho allQualifiedApplicants
    interviews,
    setInterviews,
    loading,
    error,
    snackbar,
    showSnackbar,
    handleCloseSnackbar,
    fetchJobs: fetchInitialData, // Export hàm mới cho fetch ban đầu
    fetchInterviews: fetchInterviewsForJobDetail, // Gán hàm mới cho fetchInterviews
    handleCreateInterviewRound,
    handleSaveInterview, // Export hàm gốc, wrapper sẽ gọi nó
    handleDeleteInterview,
    handleSendInvitation,
    getJobQualifiedApplicants,
    getRoundInterviews: getRoundInterviewsLocal,
    getApplicantById: getApplicantByIdLocal,
    getApplicantsForRound: getApplicantsForRoundLocal,
  }
}

export default useInterviewManagement