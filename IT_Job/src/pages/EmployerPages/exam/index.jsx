"use client"
import { Checkbox } from "@mui/material"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Divider,
  Stack,
  Tooltip,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Card,
  CardContent,
  CardActions,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Snackbar,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import AddIcon from "@mui/icons-material/Add"
import SendIcon from "@mui/icons-material/Send"
import AssessmentIcon from "@mui/icons-material/Assessment"
import LinkIcon from "@mui/icons-material/Link"
import UploadFileIcon from "@mui/icons-material/UploadFile"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import WorkIcon from "@mui/icons-material/Work"
import PeopleIcon from "@mui/icons-material/People"
import VideocamIcon from "@mui/icons-material/Videocam"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import RefreshIcon from "@mui/icons-material/Refresh"
import CancelIcon from "@mui/icons-material/Cancel"
import PageLoading from "~/components/Loading/PageLoading"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers"
import viLocale from "date-fns/locale/vi"
import { format } from "date-fns"

import {
  getTestSeriesByJobId,
  createTestSeries,
  fetchJobdByEmployerId,
  fetchApplicationsByEmployerId,
  getTestsByJobId,
  createTest,
  updateTest,
  updateTestProgress,
  deleteTest,
  sendTestInvitation,
  sendTestInvitationToAll,
  updateApplicationStatus,
  moveApplicantToInterviewRound,
} from "~/apis/index"
import { useSelector } from "react-redux"
import { selectCurrentEmployer } from "~/redux/employer/employerSlice"

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  backgroundColor: "#667eea",
  color: "#ffffff",
  fontSize: "0.875rem",
  padding: "20px 16px",
  borderBottom: "none",
}))
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#f8fafc",
  },
  "&:nth-of-type(even)": {
    backgroundColor: "#ffffff",
  },
  "&:hover": {
    backgroundColor: "#e2e8f0",
    transition: "background-color 0.2s ease",
  },
  "& td": {
    borderBottom: "1px solid #e2e8f0",
    padding: "16px",
  },
}))

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  borderRadius: "16px !important",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  border: "1px solid #e2e8f0",
  marginBottom: "24px",
  "&:before": {
    display: "none",
  },
  "&.Mui-expanded": {
    margin: "0 0 24px 0",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
  },
}))

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: "20px 24px",
  minHeight: "80px",
  "&.Mui-expanded": {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottom: "1px solid #e2e8f0",
  },
  "& .MuiAccordionSummary-content": {
    margin: "0",
  },
}))

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  border: "1px solid #e2e8f0",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
    transform: "translateY(-2px)",
  },
}))

const GradientButton = styled(Button)(({ theme, variant, color }) => ({
  borderRadius: "12px",
  padding: "12px 24px",
  fontWeight: 600,
  textTransform: "none",
  fontSize: "0.875rem",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  transition: "all 0.3s ease",
  ...(variant === "contained" &&
    color === "success" && {
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      "&:hover": {
        background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
        boxShadow: "0 6px 20px rgba(16, 185, 129, 0.4)",
        transform: "translateY(-1px)",
      },
    }),
  ...(variant === "contained" &&
    color === "error" && {
      background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      "&:hover": {
        background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
        boxShadow: "0 6px 20px rgba(239, 68, 68, 0.4)",
        transform: "translateY(-1px)",
      },
    }),
  ...(variant === "contained" &&
    color === "primary" && {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "&:hover": {
        background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
        boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
        transform: "translateY(-1px)",
      },
    }),
  ...(variant === "outlined" && {
    borderColor: "#667eea",
    color: "#667eea",
    borderWidth: "2px",
    "&:hover": {
      borderColor: "#5a67d8",
      backgroundColor: "#f7fafc",
      transform: "translateY(-1px)",
    },
  }),
}))

const statusColors = {
  "Chưa gửi": "warning",
  "Đã làm": "success",
  "Đã gửi": "info",
  "Đã hết hạn": "error",
  Đạt: "success",
  "Không đạt": "error",
}

// Email templates
const emailTemplates = {
  testInvitation: (applicantName, jobTitle, testName, deadline, link) => `
    Kính gửi ${applicantName},
    
    Chúng tôi gửi bạn bài test "${testName}" cho vị trí ${jobTitle}.
    
    Hạn nộp bài: ${deadline}
    Link bài test: ${link}
    
    Vui lòng hoàn thành bài test trước thời hạn.
    
    Trân trọng,
    Phòng Nhân sự
  `,
  testResult: (applicantName, jobTitle, testName, result) => `
    Kính gửi ${applicantName},
    
    Cảm ơn bạn đã hoàn thành bài test "${testName}" cho vị trí ${jobTitle}.
    
    Kết quả của bạn: ${result === "Đạt" ? "Đạt yêu cầu" : "Chưa đạt yêu cầu"}
    
    ${
      result === "Đạt"
        ? "Chúng tôi sẽ liên hệ với bạn để sắp xếp các bước tiếp theo trong quy trình tuyển dụng."
        : "Chúng tôi rất tiếc phải thông báo rằng bạn chưa đáp ứng được yêu cầu cho vị trí này. Chúng tôi khuyến khích bạn tiếp tục theo dõi các cơ hội khác tại công ty chúng tôi trong tương lai."
    }
    
    Trân trọng,
    Phòng Nhân sự
  `,
  interviewInvitation: (applicantName, jobTitle) => `
    Kính gửi ${applicantName},
    
    Chúc mừng! Bạn đã vượt qua tất cả các bài test cần thiết cho vị trí ${jobTitle}.
    
    Chúng tôi muốn mời bạn tham gia vòng phỏng vấn. Chúng tôi sẽ liên hệ với bạn sớm để sắp xếp lịch phỏng vấn.
    
    Trân trọng,
    Phòng Nhân sự
  `,
}

const TestManagement = () => {
  const employer = useSelector(selectCurrentEmployer)
  const [jobs, setJobs] = useState([])
  const [applicants, setApplicants] = useState([])
  const [tests, setTests] = useState([])
  const [selectedJobId, setSelectedJobId] = useState(null)
  const [selectedTestId, setSelectedTestId] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState("")
  const [selectedTest, setSelectedTest] = useState(null)
  const [selectedApplicant, setSelectedApplicant] = useState(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })
  const [selectedApplicantsForNextRound, setSelectedApplicantsForNextRound] = useState([])
  const [loading, setLoading] = useState({
    jobs: false,
    applicants: false,
    tests: false,
    action: false,
  })
  const [error, setError] = useState({
    jobs: null,
    applicants: null,
    tests: null,
    action: null,
  })

  const handleOpenDialog = (type, test = null, applicant = null, jobId = null, testId = null) => {
    setDialogType(type)
    setSelectedTest(test)
    setSelectedApplicant(applicant)
    if (jobId) setSelectedJobId(jobId)
    if (testId) setSelectedTestId(testId)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedTest(null)
    setSelectedApplicant(null)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    })
  }

  const sendEmail = (template, applicant, job, test = null, result = null) => {
    // Simulate sending email
    console.log("Sending email to:", applicant.email)
    let emailContent = ""

    if (template === "testInvitation" && test) {
      const formattedDeadline = new Date(test.deadline).toLocaleDateString("vi-VN")
      emailContent = emailTemplates.testInvitation(applicant.name, job.title, test.name, formattedDeadline, test.link)
    } else if (template === "testResult" && test) {
      emailContent = emailTemplates.testResult(applicant.name, job.title, test.name, result)
    } else if (template === "interviewInvitation") {
      emailContent = emailTemplates.interviewInvitation(applicant.name, job.title)
    }

    console.log("Email content:", emailContent)
    return true // Simulate successful email sending
  }

  const handleSaveTest = async (formData) => {
    setLoading((prev) => ({ ...prev, action: true }))
    setError((prev) => ({ ...prev, action: null }))
    let newTest
    try {
      if (dialogType === "add") {
        // Create new test
        newTest = await createTest({
          jobId: selectedJobId,
          testSeriesId: selectedTestId,
          name: formData.name,
          description: formData.description,
          type: formData.type,
          link: formData.link,
          deadline: formData.deadline,
          maxScore: formData.maxScore,
          passingScore: formData.passingScore,
        })

        // Initialize testProgress for all applicants of the job
        const jobApplicants = getJobApplicants(selectedJobId)
        for (const applicant of jobApplicants) {
          const existingProgress = applicant.testProgress?.find((p) => p.testSeriesId === selectedTestId)
          if (!existingProgress) {
            await updateTestProgress(applicant.id, selectedTestId, {
              status: "Chưa làm",
              score: null,
              result: null,
              comments: "",
            })
          }
        }

        showSnackbar(`Đã tạo bài test "${formData.name}" thành công`)
      } else if (dialogType === "edit") {
        // Update existing test
        await updateTest(selectedTest.id, {
          name: formData.name,
          description: formData.description,
          type: formData.type,
          link: formData.link,
          deadline: formData.deadline,
          maxScore: formData.maxScore,
          passingScore: formData.passingScore,
        })

        showSnackbar(`Đã cập nhật bài test "${formData.name}" thành công`)
      }

      // Refresh tests data
      await fetchTests()
      await fetchApplicants()
    } catch (error) {
      console.error("Error saving test:", error)
      setError((prev) => ({ ...prev, action: "Không thể lưu bài test. Vui lòng thử lại sau." }))
      showSnackbar("Không thể lưu bài test. Vui lòng thử lại sau.", "error")
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
      handleCloseDialog()
    }
  }

  const handleCreateTestSeries = async (jobId, formData) => {
    setLoading((prev) => ({ ...prev, action: true }))
    setError((prev) => ({ ...prev, action: null }))
    try {
      await createTestSeries({
        jobId,
        name: formData.name,
        order: formData.order,
        required: formData.required,
      })

      //Refresh Data
      await fetchJobs()
      await fetchApplicants()
      showSnackbar(`Đã tạo bài test "${formData.name}" thành công`)
    } catch (error) {
      console.error("Error creating test series:", error)
      showSnackbar(error.response?.data?.message || "Tạo bài test thất bại", "error")
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
      handleCloseDialog()
    }
  }

  const handleSaveScore = async (formData) => {
    setLoading((prev) => ({ ...prev, action: true }))
    setError((prev) => ({ ...prev, action: null }))
    try {
      // Determine result based on the evaluation method
      let result
      if (formData.evaluationMethod === "score") {
        result = formData.score >= selectedTest.passingScore ? "Đạt" : "Không đạt"
      } else {
        result = formData.passStatus
      }

      // Update test progress
      await updateTestProgress(selectedApplicant.id, selectedTest.testId, {
        status: "Đã làm",
        score: formData.evaluationMethod === "score" ? formData.score : null,
        result: result,
        comments: formData.comments,
      })

      await fetchApplicants()
      showSnackbar(`Đã lưu kết quả bài test cho ${selectedApplicant.name}`)

      // Refresh data
    } catch (error) {
      console.error("Error saving score:", error)
      showSnackbar(error.response?.data?.message || "Lưu kết quả thất bại", "error")
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
      handleCloseDialog()
    }
  }

  const handleDeleteTest = async (testId) => {
    setLoading((prev) => ({ ...prev, action: true }))
    setError((prev) => ({ ...prev, action: null }))

    try {
      await deleteTest(testId)

      // Refresh tests data
      await fetchTests()

      showSnackbar("Đã xóa bài test thành công")
    } catch (error) {
      console.error("Error deleting test:", error)
      setError((prev) => ({ ...prev, action: "Không thể xóa bài test. Vui lòng thử lại sau." }))
      showSnackbar("Không thể xóa bài test. Vui lòng thử lại sau.", "error")
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const handleSendTestToApplicant = async (applicantId, testSeriesId) => {
    try {
      await sendTestInvitation(applicantId, testSeriesId)

      // Refresh applicants data
      await fetchApplicants()

      const applicant = applicants.find((a) => a.id === applicantId)
      showSnackbar(`Đã gửi bài test cho ${applicant?.name || "ứng viên"}`)
    } catch (error) {
      console.error("Error sending test:", error)
      showSnackbar("Không thể gửi bài test. Vui lòng thử lại sau.", "error")
    }
  }

  const handleSendTestToAll = async (jobId, testSeriesId) => {
    try {
      await sendTestInvitationToAll(jobId, testSeriesId)

      // Refresh applicants data
      await fetchApplicants()

      showSnackbar("Đã gửi bài test cho tất cả ứng viên")
    } catch (error) {
      console.error("Error sending test to all:", error)
      showSnackbar("Không thể gửi bài test cho tất cả ứng viên. Vui lòng thử lại sau.", "error")
    }
  }

  const handleSelectApplicantForNextRound = (applicantId, selected) => {
    if (selected) {
      setSelectedApplicantsForNextRound([...selectedApplicantsForNextRound, applicantId])
    } else {
      setSelectedApplicantsForNextRound(selectedApplicantsForNextRound.filter((id) => id !== applicantId))
    }
  }

  const handleAddApplicantToTest = async (applicantId, jobId) => {
    try {
      const applicant = applicants.find((a) => a.id === applicantId)

      if (!applicant) throw new Error("Applicant not found")

      await updateApplicationStatus(
        applicantId,
        "Accepted",
        "",
        applicant.name,
        jobs.find((j) => j.id === jobId)?.title || "",
        applicant.email,
        "test",
      )

      const testSeries = jobs.find((j) => j.id === jobId)?.testSeries || []

      // Tạo test progress cho ứng viên với tất cả test series
      for (const ts of testSeries) {
        // Kiểm tra xem ứng viên đã có test progress cho test series này chưa
        const existingProgress = applicant.testProgress?.find((p) => p.testSeriesId === ts.id)

        if (!existingProgress) {
          // Nếu chưa có, tạo mới test progress
          await updateTestProgress(applicantId, ts.id, {
            status: "Chưa làm",
            score: null,
            result: null,
          })
        }
      }

      // Fetch lại dữ liệu để cập nhật UI
      await fetchApplicants()

      showSnackbar(`Đã thêm ${applicant.name} vào bài test thành công`)
    } catch (error) {
      showSnackbar("Không thể thêm ứng viên vào bài test. Vui lòng thử lại sau.", "error")
    }
  }

  const handleMoveToNextRound = async (jobId, nextRoundType, applicantId) => {
    console.log("applicantId", applicantId)

    const applicantIds = Array.isArray(applicantId) ? applicantId : [applicantId]

    await Promise.all(
      applicantIds.map((id) => {
        moveApplicantToInterviewRound(id, { phase: "interview" })
      }),
    )
    // Simulate moving applicants to next round
    // await moveApplicantToInterviewRound()
    showSnackbar(`Đã chuyển ứng viên sang vòng ${nextRoundType === "interview" ? "phỏng vấn" : "test tiếp theo"}`)

    fetchApplicants()

    // Clear selection after moving
    setSelectedApplicantsForNextRound([])
  }

  const getJobApplicants = (jobId) => {
    return applicants.filter((a) => a.jobId === jobId)
  }

  const getTestSeriesTests = (jobId, testId) => {
    return tests.filter((t) => t.jobId === jobId && t.testId === testId)
  }

  const getTestSeriesApplicants = (jobId, testId) => {
    return applicants.filter((a) => {
      return a.jobId === jobId
    })
  }

  const getPassedApplicants = (jobId) => {
    return applicants.filter((a) => a.jobId === jobId && a.passedAllRequiredTests)
  }

  const fetchJobs = async () => {
    setLoading((prev) => ({ ...prev, jobs: true }))
    setError((prev) => ({ ...prev, jobs: null }))
    try {
      setLoading(true)
      setError(null)

      if (!employer) throw new Error("Employer not found")

      //Lấy danh sách việc
      const jobsData = await fetchJobdByEmployerId(employer._id)

      const jobsWithTestSeries = await Promise.all(
        jobsData.map(async (job) => {
          try {
            const testSeriesResponse = await getTestSeriesByJobId(job._id)
            console.log(testSeriesResponse)
            return {
              ...job,
              id: job._id,
              testSeries: testSeriesResponse.data.map((ts) => ({
                id: ts._id,
                name: ts.name,
                order: ts.order,
                required: ts.required,
              })),
            }
          } catch (error) {
            console.error(`Error fetching test series for job ${job._id}:`, error)
            return {
              ...job,
              id: job._id,
              testSeries: [],
            }
          }
        }),
      )

      setJobs(jobsWithTestSeries)
    } catch (error) {
      console.error("Error fetching data:", error)
      setError(error.message || "Loading fail")
      showSnackbar("Không thể tải dữ liệu. Vui lòng thử lại sau.", "error")
    } finally {
      setLoading((prev) => ({ ...prev, jobs: false }))
    }
  }

  // Fetch applicants data
  const fetchApplicants = async () => {
    setLoading((prev) => ({ ...prev, applicants: true }))
    setError((prev) => ({ ...prev, applicants: null }))
    try {
      const applicantsData = await fetchApplicationsByEmployerId(employer._id)

      // Transform data to match component structure
      console.log("hehe", applicantsData)
      const formattedApplicants = applicantsData.map((applicant) => ({
        id: applicant.id,
        jobId: applicant.jobId,
        name: applicant.name,
        email: applicant.email,
        phone: applicant.phone,
        appliedDate: applicant.appliedDate,
        status: applicant.status,
        cvLink: applicant.cvLink,
        education: applicant.education,
        experience: applicant.experience,
        skills: applicant.skills,
        testProgress: applicant.testProgress || [],
        passedAllRequiredTests: applicant.passedAllRequiredTests,
      }))

      setApplicants(formattedApplicants)
    } catch (error) {
      console.error("Error fetching applicants:", error)
      // setError((prev) => ({ ...prev, applicants: "Không thể tải dữ liệu ứng viên. Vui lòng thử lại sau." }))
    } finally {
      setLoading((prev) => ({ ...prev, applicants: false }))
    }
  }

  // Fetch test data
  const fetchTests = async () => {
    if (!employer || !jobs.length) return

    setLoading((prev) => ({ ...prev, tests: true }))
    setError((prev) => ({ ...prev, tests: null }))

    try {
      // Fetch tests for all jobs
      const testsPromises = jobs.map((job) => getTestsByJobId(job.id))
      const testsResponses = await Promise.all(testsPromises)

      // Combine all tests
      const allTests = testsResponses.flatMap((response) =>
        response.data.map((test) => ({
          id: test._id,
          jobId: test.jobId,
          testId: test.testSeriesId,
          name: test.name,
          description: test.description,
          type: test.type,
          link: test.link,
          deadline: new Date(test.deadline),
          maxScore: test.maxScore,
          passingScore: test.passingScore,
        })),
      )

      setTests(allTests)
    } catch (error) {
      console.error("Error fetching tests:", error)
      setError((prev) => ({ ...prev, tests: "Không thể tải dữ liệu bài test. Vui lòng thử lại sau." }))
    } finally {
      setLoading((prev) => ({ ...prev, tests: false }))
    }
  }

  const handleAddApplicantToTestFirstTestSeries = async (applicantId, jobId) => {
    try {
      // Find the first test series for the job
      const job = jobs.find((j) => j.id === jobId)
      const testSeries = job?.testSeries?.[0]
      console.log(testSeries)

      if (!testSeries) {
        showSnackbar("Không tìm thấy bài test nào cho công việc này.", "error")
        return
      }

      // Call the API to send the test invitation
      await sendTestInvitation(applicantId, testSeries.id)

      // Refresh applicants data
      await fetchApplicants()

      showSnackbar("Đã thêm ứng viên vào bài test thành công.")
    } catch (error) {
      console.error("Error adding applicant to test:", error)
      showSnackbar("Không thể thêm ứng viên vào bài test. Vui lòng thử lại sau.", "error")
    }
  }

  const formatDate = (date) => {
    if (!date) return ""
    try {
      return format(new Date(date), "dd/MM/yyyy")
    } catch (error) {
      return ""
    }
  }

  // Format datetime for display
  const formatDateTime = (date) => {
    if (!date) return ""
    try {
      return format(new Date(date), "dd/MM/yyyy HH:mm")
    } catch (error) {
      return ""
    }
  }

  useEffect(() => {
    if (employer) {
      fetchJobs()
    }
  }, [employer])

  // Load applicants and tests when jobs are loaded
  useEffect(() => {
    if (jobs.length > 0) {
      fetchApplicants()
      fetchTests()
    }
  }, [jobs])

  return (
    <Box
      sx={{
        p: 4,
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          p: 4,
          bgcolor: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
          border: "1px solid #e2e8f0",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="700"
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            Quản lý Bài Test
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Tạo và quản lý các bài test cho quy trình tuyển dụng
          </Typography>
        </Box>
        <GradientButton
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={() => {
            fetchJobs()
            fetchApplicants()
            fetchTests()
          }}
          disabled={loading.jobs || loading.applicants || loading.tests}
        >
          Làm mới dữ liệu
        </GradientButton>
      </Box>

      {/* Loading indicator */}
      {(loading.jobs || loading.applicants || loading.tests) && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <PageLoading caption={"Đang tải dữ liệu..."} />
        </Box>
      )}

      {/* No jobs message */}
      {!loading.jobs && jobs.length === 0 && (
        <Alert
          severity="info"
          sx={{
            mb: 3,
            borderRadius: "12px",
            backgroundColor: "#e0f2fe",
            border: "1px solid #b3e5fc",
          }}
        >
          Chưa có công việc nào. Vui lòng tạo công việc trước khi quản lý bài test.
        </Alert>
      )}

      {/* Main Content */}
      {!loading.jobs && jobs.length > 0 && (
        <Box
          sx={{
            bgcolor: "#ffffff",
            borderRadius: "20px",
            p: 4,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
            border: "1px solid #e2e8f0",
          }}
        >
          <Typography variant="h5" fontWeight="600" gutterBottom sx={{ color: "#1e293b", mb: 4 }}>
            Quản lý bài test theo công việc
          </Typography>

          {jobs.map((job) => (
            <StyledAccordion
              key={job.id}
              expanded={selectedJobId === job.id}
              onChange={() => setSelectedJobId(selectedJobId === job.id ? null : job.id)}
            >
              <StyledAccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#667eea" }} />}>
                <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      mr: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <WorkIcon sx={{ color: "#ffffff", fontSize: "24px" }} />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="600" sx={{ color: "#1f2937", mb: 1 }}>
                      {job.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {job.department} • {job.locations}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#6b7280",
                        backgroundColor: "#f3f4f6",
                        px: 2,
                        py: 0.5,
                        borderRadius: "8px",
                      }}
                    >
                      Đăng ngày: {formatDate(job.createdAt)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Badge
                      badgeContent={getJobApplicants(job.id).length}
                      color="primary"
                      max={99}
                      sx={{
                        "& .MuiBadge-badge": {
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          fontWeight: 600,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: "10px",
                          backgroundColor: "#f3f4f6",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <PeopleIcon color="action" />
                      </Box>
                    </Badge>
                    <Chip
                      label={job.status}
                      sx={{
                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        color: "#ffffff",
                        fontWeight: 600,
                        borderRadius: "10px",
                      }}
                    />
                  </Box>
                </Box>
              </StyledAccordionSummary>
              <AccordionDetails sx={{ p: 4, backgroundColor: "#fafbfc" }}>
                {job.description && (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="body1" sx={{ color: "#374151", lineHeight: 1.6 }}>
                      {job.description}
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ mb: 4, borderColor: "#e2e8f0" }} />

                {/* Test Series Management */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h6" fontWeight="600" sx={{ color: "#374151" }}>
                      Quy trình bài test
                    </Typography>
                    <GradientButton
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenDialog("addTestSeries", null, null, job.id)}
                      disabled={loading.action}
                    >
                      Thêm bài test mới
                    </GradientButton>
                  </Box>

                  {job.testSeries && job.testSeries.length > 0 ? (
                    <Box
                      sx={{
                        p: 3,
                        backgroundColor: "#ffffff",
                        borderRadius: "16px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <Stepper activeStep={-1} alternativeLabel>
                        {job.testSeries.map((test) => (
                          <Step key={test.id}>
                            <StepLabel
                              sx={{
                                "& .MuiStepLabel-label": {
                                  fontWeight: 600,
                                  color: "#374151",
                                },
                              }}
                            >
                              {test.name} {test.required ? "(Bắt buộc)" : "(Không bắt buộc)"}
                            </StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        p: 4,
                        backgroundColor: "#f8fafc",
                        borderRadius: "16px",
                        border: "2px dashed #cbd5e1",
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="body1" color="text.secondary" sx={{ fontStyle: "italic" }}>
                        Chưa có bài test nào cho vị trí này. Hãy thêm bài test mới để bắt đầu.
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Test Series Details */}
                {job.testSeries &&
                  job.testSeries.map((testSeries) => (
                    <StyledAccordion key={testSeries.id}>
                      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box
                          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}
                        >
                          <Typography variant="h6" fontWeight="600" sx={{ color: "#374151" }}>
                            {testSeries.name} {testSeries.required ? "(Bắt buộc)" : "(Không bắt buộc)"}
                          </Typography>
                          <Chip
                            label={`Thứ tự: ${testSeries.order}`}
                            sx={{
                              backgroundColor: "#e0e7ff",
                              color: "#3730a3",
                              fontWeight: 600,
                              borderRadius: "8px",
                            }}
                          />
                        </Box>
                      </StyledAccordionSummary>
                      <AccordionDetails sx={{ p: 4 }}>
                        {/* Test Details Section */}
                        <Box sx={{ mb: 4 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                            <Typography variant="h6" fontWeight="600" sx={{ color: "#374151" }}>
                              Chi tiết bài test
                            </Typography>
                            <GradientButton
                              variant="contained"
                              color="primary"
                              startIcon={<AddIcon />}
                              onClick={() => handleOpenDialog("add", null, null, job.id, testSeries.id)}
                              disabled={loading.action}
                            >
                              Tạo bài test mới
                            </GradientButton>
                          </Box>

                          {getTestSeriesTests(job.id, testSeries.id).length === 0 ? (
                            <Box
                              sx={{
                                p: 4,
                                backgroundColor: "#f8fafc",
                                borderRadius: "12px",
                                border: "2px dashed #cbd5e1",
                                textAlign: "center",
                              }}
                            >
                              <Typography variant="body1" color="text.secondary" sx={{ fontStyle: "italic" }}>
                                Chưa có bài test nào cho phần này. Hãy tạo bài test để gửi cho ứng viên.
                              </Typography>
                            </Box>
                          ) : (
                            <Grid container spacing={3}>
                              {getTestSeriesTests(job.id, testSeries.id).map((test) => (
                                <Grid item xs={12} md={6} key={test.id}>
                                  <StyledCard>
                                    <CardContent sx={{ p: 3 }}>
                                      <Typography variant="h6" fontWeight="600" sx={{ color: "#1f2937", mb: 2 }}>
                                        {test.name}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                                        {test.description}
                                      </Typography>
                                      <Divider sx={{ my: 2, borderColor: "#e2e8f0" }} />
                                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                        <Typography variant="body2" sx={{ color: "#374151" }}>
                                          <strong>Loại:</strong> {test.type}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "#374151" }}>
                                          <strong>Hạn nộp:</strong> {formatDateTime(test.deadline)}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "#374151" }}>
                                          <strong>Điểm đạt:</strong> {test.passingScore}/{test.maxScore}
                                        </Typography>
                                        <Box sx={{ mt: 1 }}>
                                          <Link
                                            href={test.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                              color: "#667eea",
                                              fontWeight: 600,
                                              textDecoration: "none",
                                              display: "flex",
                                              alignItems: "center",
                                              "&:hover": {
                                                textDecoration: "underline",
                                              },
                                            }}
                                          >
                                            <LinkIcon fontSize="small" sx={{ mr: 0.5 }} />
                                            Link bài test
                                          </Link>
                                        </Box>
                                      </Box>
                                    </CardContent>
                                    <CardActions sx={{ p: 3, pt: 0 }}>
                                      <Button
                                        size="small"
                                        onClick={() => handleOpenDialog("edit", test)}
                                        disabled={loading.action}
                                        sx={{
                                          color: "#667eea",
                                          fontWeight: 600,
                                          "&:hover": {
                                            backgroundColor: "#f7fafc",
                                          },
                                        }}
                                      >
                                        Chỉnh sửa
                                      </Button>
                                      <Button
                                        size="small"
                                        onClick={() => handleDeleteTest(test.id)}
                                        disabled={loading.action}
                                        sx={{
                                          color: "#ef4444",
                                          fontWeight: 600,
                                          "&:hover": {
                                            backgroundColor: "#fef2f2",
                                          },
                                        }}
                                      >
                                        Xóa
                                      </Button>
                                      <GradientButton
                                        size="small"
                                        color="primary"
                                        onClick={() => handleSendTestToAll(job.id, testSeries.id)}
                                        startIcon={<SendIcon />}
                                        disabled={loading.action}
                                        sx={{ ml: "auto" }}
                                      >
                                        Gửi cho tất cả
                                      </GradientButton>
                                    </CardActions>
                                  </StyledCard>
                                </Grid>
                              ))}
                            </Grid>
                          )}
                        </Box>

                        {/* Applicants Section */}
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="h6" fontWeight="600" gutterBottom sx={{ color: "#374151", mb: 3 }}>
                            Ứng viên ({getTestSeriesApplicants(job.id, testSeries.id).length})
                          </Typography>

                          {getTestSeriesApplicants(job.id, testSeries.id).length === 0 ? (
                            <Box
                              sx={{
                                p: 4,
                                backgroundColor: "#f8fafc",
                                borderRadius: "12px",
                                border: "2px dashed #cbd5e1",
                                textAlign: "center",
                              }}
                            >
                              <Typography variant="body1" color="text.secondary" sx={{ fontStyle: "italic" }}>
                                Chưa có ứng viên nào cho bài test này.
                              </Typography>
                            </Box>
                          ) : (
                            <>
                              <TableContainer
                                component={Paper}
                                sx={{
                                  borderRadius: "16px",
                                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                                  overflow: "hidden",
                                  border: "1px solid #e2e8f0",
                                }}
                              >
                                <Table>
                                  <TableHead>
                                    <TableRow>
                                      <StyledTableCell padding="checkbox">
                                        <Checkbox
                                          sx={{
                                            color: "#ffffff",
                                            "&.Mui-checked": {
                                              color: "#ffffff",
                                            },
                                          }}
                                          onChange={(e) => {
                                            const applicantIds = getTestSeriesApplicants(job.id, testSeries.id)
                                              .filter((a) => {
                                                const progress = a.testProgress.find(
                                                  (p) => p.testSeriesId === testSeries.id,
                                                )
                                                return progress && progress.result === "Đạt"
                                              })
                                              .map((a) => a.id)

                                            if (e.target.checked) {
                                              setSelectedApplicantsForNextRound(applicantIds)
                                            } else {
                                              setSelectedApplicantsForNextRound([])
                                            }
                                          }}
                                        />
                                      </StyledTableCell>
                                      <StyledTableCell>Họ tên</StyledTableCell>
                                      <StyledTableCell>Email</StyledTableCell>
                                      <StyledTableCell>Ngày ứng tuyển</StyledTableCell>
                                      <StyledTableCell>Trạng thái bài test</StyledTableCell>
                                      <StyledTableCell>Điểm</StyledTableCell>
                                      <StyledTableCell>Kết quả</StyledTableCell>
                                      <StyledTableCell align="center">Thao tác</StyledTableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {getTestSeriesApplicants(job.id, testSeries.id).map((applicant) => {
                                      const progress = applicant.testProgress?.find(
                                        (p) => p.testSeriesId === testSeries.id,
                                      ) || { status: "Chưa làm", score: null, result: null }
                                      const test = getTestSeriesTests(job.id, testSeries.id)[0]
                                      const isPassed = progress?.result === "Đạt"

                                      return (
                                        <StyledTableRow key={applicant.id}>
                                          <TableCell padding="checkbox">
                                            <Checkbox
                                              sx={{
                                                color: "#667eea",
                                                "&.Mui-checked": {
                                                  color: "#667eea",
                                                },
                                              }}
                                              disabled={!isPassed}
                                              checked={selectedApplicantsForNextRound.includes(applicant.id)}
                                              onChange={(e) =>
                                                handleSelectApplicantForNextRound(applicant.id, e.target.checked)
                                              }
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <Typography variant="body2" fontWeight="600" sx={{ color: "#1f2937" }}>
                                              {applicant.name}
                                            </Typography>
                                          </TableCell>
                                          <TableCell>
                                            <Typography variant="body2" sx={{ color: "#374151" }}>
                                              {applicant.email}
                                            </Typography>
                                          </TableCell>
                                          <TableCell>
                                            <Typography variant="body2" sx={{ color: "#374151" }}>
                                              {applicant.appliedDate}
                                            </Typography>
                                          </TableCell>
                                          <TableCell>
                                            <Chip
                                              label={progress.status || "Chưa làm"}
                                              color={statusColors[progress.status || "Chưa làm"]}
                                              size="small"
                                              sx={{
                                                fontWeight: 600,
                                                borderRadius: "8px",
                                              }}
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <Typography variant="body2" fontWeight="600" sx={{ color: "#374151" }}>
                                              {progress.score == null
                                                ? "-"
                                                : `${progress.score}/${test?.maxScore || 100}`}
                                            </Typography>
                                          </TableCell>
                                          <TableCell>
                                            {progress.result ? (
                                              <Chip
                                                label={progress.result}
                                                color={statusColors[progress.result]}
                                                size="small"
                                                sx={{
                                                  fontWeight: 600,
                                                  borderRadius: "8px",
                                                }}
                                              />
                                            ) : (
                                              <Typography variant="body2" color="text.secondary">
                                                -
                                              </Typography>
                                            )}
                                          </TableCell>
                                          <TableCell align="center">
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                              {progress.status !== "Đã làm" && (
                                                <Tooltip title="Gửi bài test">
                                                  <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                      handleSendTestToApplicant(applicant.id, testSeries.id)
                                                    }
                                                    disabled={loading.action}
                                                    sx={{
                                                      backgroundColor: "#dbeafe",
                                                      color: "#1e40af",
                                                      "&:hover": {
                                                        backgroundColor: "#bfdbfe",
                                                      },
                                                    }}
                                                  >
                                                    <SendIcon fontSize="small" />
                                                  </IconButton>
                                                </Tooltip>
                                              )}
                                              {(progress.status === "Đã gửi" || progress.status === "Đã làm") && (
                                                <Tooltip title="Nhập kết quả">
                                                  <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                      handleOpenDialog(
                                                        "score",
                                                        getTestSeriesTests(job.id, testSeries.id)[0],
                                                        applicant,
                                                      )
                                                    }
                                                    disabled={loading.action}
                                                    sx={{
                                                      backgroundColor: "#d1fae5",
                                                      color: "#065f46",
                                                      "&:hover": {
                                                        backgroundColor: "#a7f3d0",
                                                      },
                                                    }}
                                                  >
                                                    <AssessmentIcon fontSize="small" />
                                                  </IconButton>
                                                </Tooltip>
                                              )}
                                            </Stack>
                                          </TableCell>
                                        </StyledTableRow>
                                      )
                                    })}
                                  </TableBody>
                                </Table>
                              </TableContainer>

                              {/* Action Buttons */}
                              {selectedApplicantsForNextRound.length > 0 && (
                                <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                                  <GradientButton
                                    variant="contained"
                                    color="primary"
                                    startIcon={<VideocamIcon />}
                                    onClick={() =>
                                      handleMoveToNextRound(job.id, "interview", selectedApplicantsForNextRound)
                                    }
                                    disabled={loading.action}
                                  >
                                    Chuyển sang phỏng vấn ({selectedApplicantsForNextRound.length})
                                  </GradientButton>
                                </Box>
                              )}
                            </>
                          )}
                        </Box>
                      </AccordionDetails>
                    </StyledAccordion>
                  ))}

                {/* Passed Applicants Section */}
                <Box sx={{ mt: 4 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h6" fontWeight="600" sx={{ color: "#374151" }}>
                      Ứng viên đã vượt qua tất cả bài test bắt buộc ({getPassedApplicants(job.id).length})
                    </Typography>
                    <GradientButton
                      variant="outlined"
                      startIcon={<ArrowForwardIcon />}
                      onClick={() => {
                        const passedApplicants = getPassedApplicants(job.id)
                        if (passedApplicants.length === 0) {
                          showSnackbar("Không có ứng viên nào đủ điều kiện để chuyển sang phỏng vấn", "info")
                        } else {
                          showSnackbar(
                            `Có ${passedApplicants.length} ứng viên đủ điều kiện để chuyển sang phỏng vấn`,
                            "info",
                          )
                        }
                      }}
                      disabled={getPassedApplicants(job.id).length === 0 || loading.action}
                    >
                      Chuyển sang phỏng vấn
                    </GradientButton>
                  </Box>

                  {getPassedApplicants(job.id).length === 0 ? (
                    <Box
                      sx={{
                        p: 4,
                        backgroundColor: "#f8fafc",
                        borderRadius: "12px",
                        border: "2px dashed #cbd5e1",
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="body1" color="text.secondary" sx={{ fontStyle: "italic" }}>
                        Chưa có ứng viên nào vượt qua tất cả bài test bắt buộc.
                      </Typography>
                    </Box>
                  ) : (
                    <TableContainer
                      component={Paper}
                      sx={{
                        borderRadius: "16px",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                        overflow: "hidden",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>Họ tên</StyledTableCell>
                            <StyledTableCell>Email</StyledTableCell>
                            <StyledTableCell>Ngày ứng tuyển</StyledTableCell>
                            <StyledTableCell align="center">Thao tác</StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {getPassedApplicants(job.id).map((applicant) => (
                            <StyledTableRow key={applicant.id}>
                              <TableCell>
                                <Typography variant="body2" fontWeight="600" sx={{ color: "#1f2937" }}>
                                  {applicant.name}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ color: "#374151" }}>
                                  {applicant.email}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ color: "#374151" }}>
                                  {applicant.appliedDate}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <GradientButton
                                  size="small"
                                  variant="outlined"
                                  startIcon={<VideocamIcon />}
                                  onClick={() => {
                                    handleMoveToNextRound("heh", "hehe", applicant.id)
                                  }}
                                  disabled={loading.action}
                                >
                                  Tạo phỏng vấn
                                </GradientButton>
                              </TableCell>
                            </StyledTableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              </AccordionDetails>
            </StyledAccordion>
          ))}
        </Box>
      )}

      {/* Dialogs */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        disableEscapeKeyDown={loading.action}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        {dialogType === "addTestSeries" && (
          <TestSeriesForm
            job={jobs.find((j) => j.id === selectedJobId)}
            onClose={handleCloseDialog}
            onSave={(formData) => handleCreateTestSeries(selectedJobId, formData)}
            title="Thêm bài test mới"
            loading={loading.action}
          />
        )}
        {dialogType === "add" && (
          <TestForm
            job={jobs.find((j) => j.id === selectedJobId)}
            testSeries={jobs.find((j) => j.id === selectedJobId)?.testSeries.find((t) => t.id === selectedTestId)}
            onClose={handleCloseDialog}
            onSave={handleSaveTest}
            title="Tạo bài test mới"
            loading={loading.action}
          />
        )}
        {dialogType === "edit" && (
          <TestForm
            test={selectedTest}
            job={jobs.find((j) => j.id === selectedTest?.jobId)}
            testSeries={jobs
              .find((j) => j.id === selectedTest?.jobId)
              ?.testSeries.find((t) => t.id === selectedTest?.testId)}
            onClose={handleCloseDialog}
            onSave={handleSaveTest}
            title="Chỉnh sửa bài test"
            loading={loading.action}
          />
        )}
        {dialogType === "score" && (
          <ScoreForm
            test={selectedTest}
            applicant={selectedApplicant}
            onClose={handleCloseDialog}
            onSave={handleSaveScore}
            loading={loading.action}
          />
        )}
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

const TestSeriesForm = ({ job, onClose, onSave, title, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    order: job?.testSeries?.length + 1 || 1,
    required: true,
  })

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onSave(formData)
  }

  return (
    <>
      <DialogTitle sx={{ p: 4, pb: 2 }}>
        <Typography variant="h5" fontWeight="600" sx={{ color: "#1f2937" }}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="600" sx={{ color: "#374151", mb: 1 }}>
            Vị trí: {job?.title}
          </Typography>
        </Box>
        <Divider sx={{ mb: 3, borderColor: "#e2e8f0" }} />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Tên bài test"
              fullWidth
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Thứ tự"
              type="number"
              fullWidth
              value={formData.order}
              onChange={(e) => handleChange("order", Number.parseInt(e.target.value))}
              InputProps={{ inputProps: { min: 1 } }}
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth disabled={loading}>
              <InputLabel>Bắt buộc</InputLabel>
              <Select
                value={formData.required}
                label="Bắt buộc"
                onChange={(e) => handleChange("required", e.target.value)}
                sx={{
                  borderRadius: "12px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#667eea",
                  },
                }}
              >
                <MenuItem value={true}>Có</MenuItem>
                <MenuItem value={false}>Không</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 4, pt: 2 }}>
        <Button onClick={onClose} disabled={loading} sx={{ borderRadius: "10px" }}>
          Hủy
        </Button>
        <GradientButton
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading || !formData.name}
          startIcon={loading ? <PageLoading caption={"Loading"} /> : null}
        >
          {loading ? "Đang lưu..." : "Lưu"}
        </GradientButton>
      </DialogActions>
    </>
  )
}

const TestForm = ({ test = null, job, testSeries, onClose, onSave, title, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "Google Form",
    link: "",
    deadline: new Date(),
    maxScore: 100,
    passingScore: 70,
  })

  useEffect(() => {
    if (test) {
      setFormData({
        name: test.name,
        description: test.description,
        type: test.type,
        link: test.link,
        deadline: test.deadline,
        maxScore: test.maxScore,
        passingScore: test.passingScore,
      })
    } else if (testSeries) {
      setFormData({
        ...formData,
        name: testSeries.name,
      })
    }
  }, [test, testSeries])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onSave(formData)
  }

  return (
    <>
      <DialogTitle sx={{ p: 4, pb: 2 }}>
        <Typography variant="h5" fontWeight="600" sx={{ color: "#1f2937" }}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="600" sx={{ color: "#374151", mb: 1 }}>
            Vị trí: {job?.title}
          </Typography>
          {testSeries && (
            <Typography variant="body1" sx={{ color: "#6b7280" }}>
              Bài test: {testSeries.name} {testSeries.required ? "(Bắt buộc)" : "(Không bắt buộc)"}
            </Typography>
          )}
        </Box>
        <Divider sx={{ mb: 3, borderColor: "#e2e8f0" }} />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Tên bài test"
              fullWidth
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Mô tả"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth disabled={loading}>
              <InputLabel>Loại bài test</InputLabel>
              <Select
                value={formData.type}
                label="Loại bài test"
                onChange={(e) => handleChange("type", e.target.value)}
                sx={{
                  borderRadius: "12px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#667eea",
                  },
                }}
              >
                <MenuItem value="Google Form">Google Form</MenuItem>
                <MenuItem value="GitHub Repository">GitHub Repository</MenuItem>
                <MenuItem value="Figma">Figma</MenuItem>
                <MenuItem value="HackerRank">HackerRank</MenuItem>
                <MenuItem value="CodeSandbox">CodeSandbox</MenuItem>
                <MenuItem value="Google Docs">Google Docs</MenuItem>
                <MenuItem value="Khác">Khác</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
              <DateTimePicker
                label="Hạn nộp bài"
                value={formData.deadline}
                onChange={(newValue) => handleChange("deadline", newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        "&.Mui-focused fieldset": {
                          borderColor: "#667eea",
                        },
                      },
                    }}
                  />
                )}
                disabled={loading}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Link bài test"
              fullWidth
              value={formData.link}
              onChange={(e) => handleChange("link", e.target.value)}
              required
              InputProps={{
                startAdornment: <LinkIcon color="action" sx={{ mr: 1 }} />,
              }}
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Điểm tối đa"
              type="number"
              fullWidth
              value={formData.maxScore}
              onChange={(e) => handleChange("maxScore", Number.parseInt(e.target.value))}
              InputProps={{ inputProps: { min: 0 } }}
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Điểm đạt"
              type="number"
              fullWidth
              value={formData.passingScore}
              onChange={(e) => handleChange("passingScore", Number.parseInt(e.target.value))}
              InputProps={{ inputProps: { min: 0, max: formData.maxScore } }}
              helperText={`Mặc định: ${Math.floor(formData.maxScore * 0.7)} (70% điểm tối đa)`}
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
                  },
                },
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 4, pt: 2 }}>
        <Button onClick={onClose} disabled={loading} sx={{ borderRadius: "10px" }}>
          Hủy
        </Button>
        <GradientButton
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading || !formData.name || !formData.link}
          startIcon={loading ? <PageLoading caption={"Loading"} /> : null}
        >
          {loading ? "Đang lưu..." : "Lưu"}
        </GradientButton>
      </DialogActions>
    </>
  )
}

const ScoreForm = ({ test, applicant, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    evaluationMethod: "score", // "score" or "pass"
    score: applicant?.testProgress.find((p) => p.testSeriesId === test?.testId)?.score ?? 0,
    passStatus: "Đạt", // "Đạt" or "Không đạt"
    comments: "",
  })

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onSave(formData)
  }

  const handleImportFromGoogle = () => {
    alert("Tính năng nhập điểm từ Google Form sẽ được triển khai sau")
  }

  return (
    <>
      <DialogTitle sx={{ p: 4, pb: 2 }}>
        <Typography variant="h5" fontWeight="600" sx={{ color: "#1f2937" }}>
          Nhập kết quả bài test
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="600" sx={{ color: "#374151", mb: 1 }}>
            Ứng viên: {applicant?.name}
          </Typography>
          <Typography variant="body1" sx={{ color: "#6b7280", mb: 1 }}>
            Email: {applicant?.email}
          </Typography>
          <Typography variant="body1" sx={{ color: "#6b7280", mb: 1 }}>
            Bài test: {test?.name} | Điểm đạt: {test?.passingScore}/{test?.maxScore}
          </Typography>
          <Typography variant="body1" sx={{ color: "#6b7280" }}>
            Link:{" "}
            <Link
              href={test?.link}
              target="_blank"
              sx={{
                color: "#667eea",
                fontWeight: 600,
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {test?.link}
            </Link>
          </Typography>
        </Box>
        <Divider sx={{ mb: 3, borderColor: "#e2e8f0" }} />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl component="fieldset" disabled={loading}>
              <FormLabel
                component="legend"
                sx={{
                  color: "#374151",
                  fontWeight: 600,
                  "&.Mui-focused": {
                    color: "#667eea",
                  },
                }}
              >
                Phương thức đánh giá
              </FormLabel>
              <RadioGroup
                row
                value={formData.evaluationMethod}
                onChange={(e) => handleChange("evaluationMethod", e.target.value)}
                sx={{ mt: 1 }}
              >
                <FormControlLabel
                  value="score"
                  control={<Radio sx={{ color: "#667eea", "&.Mui-checked": { color: "#667eea" } }} />}
                  label="Nhập điểm"
                />
                <FormControlLabel
                  value="pass"
                  control={<Radio sx={{ color: "#667eea", "&.Mui-checked": { color: "#667eea" } }} />}
                  label="Đánh giá đậu/rớt"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          {formData.evaluationMethod === "score" ? (
            <Grid item xs={12}>
              <TextField
                label="Điểm số"
                type="number"
                fullWidth
                value={formData.score}
                onChange={(e) => handleChange("score", Number.parseInt(e.target.value))}
                InputProps={{ inputProps: { min: 0, max: test?.maxScore } }}
                helperText={`Điểm đạt: ${test?.passingScore}/${test?.maxScore}`}
                disabled={loading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "&.Mui-focused fieldset": {
                      borderColor: "#667eea",
                    },
                  },
                }}
              />
            </Grid>
          ) : (
            <Grid item xs={12}>
              <FormControl fullWidth disabled={loading}>
                <InputLabel>Kết quả</InputLabel>
                <Select
                  value={formData.passStatus}
                  label="Kết quả"
                  onChange={(e) => handleChange("passStatus", e.target.value)}
                  sx={{
                    borderRadius: "12px",
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#667eea",
                    },
                  }}
                >
                  <MenuItem value="Đạt">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CheckCircleIcon sx={{ color: "#10b981", mr: 1 }} />
                      Đạt
                    </Box>
                  </MenuItem>
                  <MenuItem value="Không đạt">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CancelIcon sx={{ color: "#ef4444", mr: 1 }} />
                      Không đạt
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField
              label="Nhận xét"
              fullWidth
              multiline
              rows={4}
              value={formData.comments}
              onChange={(e) => handleChange("comments", e.target.value)}
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
                  },
                },
              }}
            />
          </Grid>
          {test?.type === "Google Form" && (
            <Grid item xs={12}>
              <Button
                variant="outlined"
                startIcon={<UploadFileIcon />}
                onClick={handleImportFromGoogle}
                fullWidth
                disabled={loading}
                sx={{
                  borderRadius: "12px",
                  borderColor: "#667eea",
                  color: "#667eea",
                  borderWidth: "2px",
                  py: 1.5,
                  "&:hover": {
                    borderColor: "#5a67d8",
                    backgroundColor: "#f7fafc",
                  },
                }}
              >
                Nhập điểm từ Google Form
              </Button>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 4, pt: 2 }}>
        <Button onClick={onClose} disabled={loading} sx={{ borderRadius: "10px" }}>
          Hủy
        </Button>
        <GradientButton
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <PageLoading caption={"Loading"} /> : null}
        >
          {loading ? "Đang lưu..." : "Lưu kết quả"}
        </GradientButton>
      </DialogActions>
    </>
  )
}

export default TestManagement
