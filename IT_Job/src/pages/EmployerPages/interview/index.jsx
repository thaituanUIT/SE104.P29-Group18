// src/pages/EmployerPages/interview/index.jsx
"use client"

import { useState, useEffect, useCallback } from "react" // Thêm useCallback

import { Box, Snackbar, Alert, Dialog } from "@mui/material"

import InterviewManagementDashboard from "./component/interviewManagementDashboard"
import JobDetailView from "./component/jobdetailView"
import InterviewRoundForm from "./component/interviewRoundForm"
import InterviewForm from "./component/InterviewForm"
import EvaluationForm from "./component/evaluationForm"
import useInterviewManagementData from "./component/useInterviewManagementData"
import { useSelector } from "react-redux"
import { selectCurrentEmployer } from "~/redux/employer/employerSlice"
import PageLoading from "~/components/Loading/PageLoading"

export default function InterviewPage() {
  // Use the custom hook for all data and logic
  const {
    jobs,
    qualifiedApplicants, // Đây là allQualifiedApplicants từ useInterviewManagementData
    interviews,
    loading,
    error,
    snackbar,
    showSnackbar,
    handleCloseSnackbar,
    fetchJobs, // Đây là fetchInitialData từ useInterviewManagementData
    fetchInterviews, // Vẫn dùng hàm này để fetch interviews riêng cho JobDetailView
    handleSaveInterview, // Hàm gốc từ custom hook
    handleDeleteInterview,
    handleSendInvitation,
    handleCreateInterviewRound,
    getJobQualifiedApplicants,
    getRoundInterviews,
    getApplicantById,
    getApplicantsForRound,
  } = useInterviewManagementData()

  const [selectedJob, setSelectedJob] = useState(null)
  const [selectedApplicantDetail, setSelectedApplicantDetail] = useState(null) // Quản lý state này ở đây
  const employer = useSelector(selectCurrentEmployer)

  // Dialog states
  const [selectedRoundId, setSelectedRoundId] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState("")
  const [selectedInterview, setSelectedInterview] = useState(null)
  const [selectedApplicant, setSelectedApplicant] = useState(null) // Dùng cho dialog



  // Fetch initial data (jobs and all applicants) when component mounts or employer changes
  useEffect(() => {
    if (employer && employer._id) { // Ensure employer and its _id are available
      console.log("useEffect in InterviewPage: Employer ID found, fetching initial data (jobs and all applicants)...", employer._id)
      fetchJobs(employer._id) // Gọi hàm fetchInitialData từ custom hook
    } else {
      console.log("useEffect in InterviewPage: Waiting for employer ID...", employer)
    }
  }, [fetchJobs, employer]) // Add employer to dependency array

  // Fetch interviews when a job is selected for DETAIL VIEW
  useEffect(() => {
    if (selectedJob) {
      console.log("useEffect in InterviewPage: Job selected, fetching interviews for job:", selectedJob._id || selectedJob.id)
      fetchInterviews(selectedJob._id || selectedJob.id) // Gọi fetchInterviewsForJobDetail
    }
  }, [selectedJob, fetchInterviews]) // Loại bỏ fetchQualifiedApplicants khỏi dependency

  //Cập nhật selectedApplicantDetail khi allQualifiedApplicants thay đổi
  useEffect(() => {
    if (selectedApplicantDetail && qualifiedApplicants.length > 0) {
      const updatedApplicant = qualifiedApplicants.find(
        (app) => String(app.id || app._id) === String(selectedApplicantDetail.id || selectedApplicantDetail._id)
      );
      if (updatedApplicant) {
        // Chỉ cập nhật nếu có thay đổi thực sự để tránh vòng lặp re-render không cần thiết
        // Sử dụng JSON.stringify để so sánh sâu các đối tượng
        if (JSON.stringify(updatedApplicant) !== JSON.stringify(selectedApplicantDetail)) {
             console.log("Updating selectedApplicantDetail with new data from allQualifiedApplicants.");
             setSelectedApplicantDetail(updatedApplicant);
        }
      }
    }
  }, [qualifiedApplicants, selectedApplicantDetail]); // Dependency: allQualifiedApplicants và selectedApplicantDetail

  //Cập nhật selectedJob khi jobs state thay đổi
  useEffect(() => {
    if (selectedJob && jobs.length > 0) {
      const updatedJob = jobs.find(
        (jobItem) => String(jobItem.id || jobItem._id) === String(selectedJob.id || selectedJob._id)
      )
      if (updatedJob) {
        // Chỉ cập nhật nếu có thay đổi thực sự để tránh vòng lặp re-render không cần thiết
        if (JSON.stringify(updatedJob) !== JSON.stringify(selectedJob)) {
             console.log("Updating selectedJob with new data from jobs state.");
             setSelectedJob(updatedJob);
        }
      }
    }

  }, [jobs, selectedJob])

  // Hàm để cập nhật selectedApplicantDetail khi click vào danh sách ứng viên từ JobDetailView
  const handleSetSelectedApplicantDetail = useCallback((applicant) => {
    setSelectedApplicantDetail(applicant);
  }, []);

  // Override handleSaveInterview để nó cập nhật selectedApplicantDetail ngay lập tức
  // khi update overall evaluation
  const handleSaveInterviewAndRefresh = useCallback(async (...args) => {
    // Gọi hàm handleSaveInterview gốc từ useInterviewManagementData
    const result = await handleSaveInterview(...args);

    // Nếu đây là dialogType 'editOverallEvaluation', chúng ta sẽ cập nhật selectedApplicantDetail
    const [dialogTypeArg, formDataArg, selectedJobArg, selectedApplicantArg] = args; // Lấy các đối số cần thiết
    if (dialogTypeArg === 'editOverallEvaluation' && selectedApplicantArg && result) {
      // result ở đây là updatedProgressRecord (từ backend service)
      // Tạo một đối tượng ứng viên mới với các thông tin cập nhật từ result
      const updatedApplicantForView = {
        ...selectedApplicantArg, // Giữ các thông tin khác của ứng viên
        currentOverallStatus: result.currentOverallStatus,
        skills: result.skills,
        overallNotes: result.overallNotes,
        // Đảm bảo cập nhật cả interviewProgress nếu nó cũng thay đổi trong overallEvaluation (ít xảy ra)
        interviewProgress: result.interviewProgress || selectedApplicantArg.interviewProgress
      };
      setSelectedApplicantDetail(updatedApplicantForView); // Cập nhật ngay lập tức
    }
    return result;
  }, [handleSaveInterview]); // Chỉ phụ thuộc vào handleSaveInterview

 // Wrapper cho handleCreateInterviewRound để cập nhật selectedJob sau khi tạo round
  const handleCreateInterviewRoundAndRefresh = useCallback(async (jobId, roundData) => {
    const newRoundResult = await handleCreateInterviewRound(jobId, roundData);
    // Hàm handleCreateInterviewRound trong hook đã tự động cập nhật jobs state.
    // useEffect trên sẽ bắt được sự thay đổi của jobs và cập nhật selectedJob nếu cần.
    // Không cần logic update selectedJob trực tiếp ở đây nữa.
    return newRoundResult;
  }, [handleCreateInterviewRound]);


  // Function to open dialogs, passed to child components
  const handleOpenDialog = (type, applicant, job, roundId, interview) => {
    setDialogType(type)
    setSelectedApplicant(applicant) // selectedApplicant là state cho dialog, không phải selectedApplicantDetail hiển thị
    setSelectedJob(job)
    setSelectedRoundId(roundId)
    setSelectedInterview(interview)
    setOpenDialog(true)
  }

  // Function to close dialogs
  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedInterview(null)
    setSelectedApplicant(null)
  }

  // Wrapper function for saving interview data that also closes the dialog
  const saveInterviewAndCloseDialog = (formData) => {
    handleSaveInterviewAndRefresh(dialogType, formData, selectedJob, selectedApplicant, selectedRoundId, selectedInterview)
    handleCloseDialog()
  }

  // Improved loading state: only show loading if no data has been loaded yet for either jobs or applicants
  if (loading && (jobs.length === 0 || qualifiedApplicants.length === 0)) {
    return <PageLoading caption={"Loading..."}/>
  }

  // Display error if any
  if (error) {
    return <Box className="p-3 text-red-600">Error: {error}</Box>
  }

  return (
    <Box className="p-3 bg-white shadow-md rounded">
      {!selectedJob ? (
        // Dashboard View: Pass all jobs and all qualifiedApplicants
        <InterviewManagementDashboard jobs={jobs} applicants={qualifiedApplicants} setSelectedJob={setSelectedJob} />
      ) : (
        // Job Detail View: Pass the selected job and all qualifiedApplicants (JobDetailView will filter)
        <JobDetailView
          job={selectedJob}
          qualifiedApplicants={qualifiedApplicants} // Pass all applicants, JobDetailView will filter relevant ones
          interviews={interviews}
          onBack={() => {
            setSelectedJob(null);
            setSelectedApplicantDetail(null); // Khi quay lại dashboard, reset selectedApplicantDetail
          }}
          onOpenDialog={handleOpenDialog}
          onSaveInterview={saveInterviewAndCloseDialog}
          onDeleteInterview={handleDeleteInterview}
          onSendInvitation={handleSendInvitation}
          onCreateInterviewRound={handleCreateInterviewRoundAndRefresh}
          getApplicantsForRound={getApplicantsForRound}
          getRoundInterviews={getRoundInterviews}
          getApplicantById={getApplicantById}
          showSnackbar={showSnackbar}
          applicantDetail={selectedApplicantDetail} // Truyền selectedApplicantDetail xuống JobDetailView
          onSetSelectedApplicantDetail={handleSetSelectedApplicantDetail} // Truyền hàm setter xuống
        />
      )}

      {/* Global Dialogs */}
      {openDialog && (
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          {dialogType === "addRound" && selectedJob && (
            <InterviewRoundForm
              job={selectedJob}
              onClose={handleCloseDialog}
              onSave={(formData) => {
                handleCreateInterviewRoundAndRefresh(selectedJob._id || selectedJob.id, formData)
                handleCloseDialog()
              }}
              title="Thêm vòng phỏng vấn mới"
            />
          )}
          {(dialogType === "add" || dialogType === "edit") &&
            selectedApplicant &&
            selectedJob &&
            (selectedRoundId || selectedInterview) && (
              <InterviewForm
                interview={selectedInterview}
                applicant={selectedApplicant}
                job={selectedJob}
                round={
                  selectedRoundId
                    ? selectedJob.interviewRounds.find((r) => r._id === selectedRoundId || r.id === selectedRoundId)
                    : selectedJob.interviewRounds.find((r) => r._id === selectedInterview?.roundId || r.id === selectedInterview?.roundId)
                }
                onClose={handleCloseDialog}
                onSave={saveInterviewAndCloseDialog}
                title={dialogType === "add" ? "Tạo lịch phỏng vấn mới" : "Chỉnh sửa lịch phỏng vấn"}
              />
            )}
          {(dialogType === "evaluate" || dialogType === "editOverallEvaluation") &&
            selectedApplicant &&
            selectedJob && (
              <EvaluationForm
                interview={selectedInterview}
                // Đảm bảo luôn truyền selectedApplicantDetail mới nhất vào EvaluationForm
                applicant={selectedApplicantDetail && String(selectedApplicantDetail.id || selectedApplicantDetail._id) === String(selectedApplicant.id || selectedApplicant._id)
                    ? selectedApplicantDetail // Dùng phiên bản mới nhất từ state cha
                    : selectedApplicant // Fallback về phiên bản ban đầu nếu không khớp
                }
                job={selectedJob}
                round={
                  selectedInterview
                    ? selectedJob.interviewRounds.find((r) => r._id === selectedInterview.roundId || r.id === selectedInterview.roundId)
                    : null
                }
                onClose={handleCloseDialog}
                onSave={saveInterviewAndCloseDialog}
                isOverallEvaluation={dialogType === "editOverallEvaluation"}
              />
            )}
        </Dialog>
      )}

      {/* Snackbar for notifications */}
      {snackbar.open && (
        <Snackbar open={snackbar.open} onOpenChange={() => handleCloseSnackbar()}>
          <Alert variant={snackbar.severity === "error" ? "destructive" : "default"}>{snackbar.message}</Alert>
        </Snackbar>
      )}
    </Box>
  )
}