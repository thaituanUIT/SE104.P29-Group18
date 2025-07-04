"use client"

import { Checkbox } from "@mui/material"
import { useState, useEffect, useMemo } from "react"
import {
  Box,
  Typography,
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
  Grid,
  Divider,
  Stack,
  Avatar,
  Button,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Card,
  CardContent,
  Alert,
  Snackbar,
  Tooltip,
  Drawer,
  Pagination,
  LinearProgress,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import WorkIcon from "@mui/icons-material/Work"
import PeopleIcon from "@mui/icons-material/People"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined"
import VisibilityIcon from "@mui/icons-material/Visibility"
import EmailIcon from "@mui/icons-material/Email"
import FileOpenIcon from "@mui/icons-material/FileOpen"
import SendIcon from "@mui/icons-material/Send"
import PersonIcon from "@mui/icons-material/Person"
import SchoolIcon from "@mui/icons-material/School"
import WorkHistoryIcon from "@mui/icons-material/WorkHistory"
import ApplicantProfileView from "./ApplicantProfileView"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import RefreshIcon from "@mui/icons-material/Refresh"
import { useSelector } from "react-redux"
import { selectCurrentEmployer } from "~/redux/employer/employerSlice"
import { fetchJobdByEmployerId, fetchApplicationsByEmployerIdInCVPhase, updateApplicationStatus } from "~/apis"

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  backgroundColor: "#667eea",
  color: "#ffffff",
  fontSize: "0.875rem",
  padding: "16px 20px",
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
    padding: "20px",
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
      },
    }),
  ...(variant === "contained" &&
    color === "error" && {
      background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      "&:hover": {
        background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
        boxShadow: "0 6px 20px rgba(239, 68, 68, 0.4)",
      },
    }),
  ...(variant === "contained" &&
    color === "primary" && {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "&:hover": {
        background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
        boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
      },
    }),
}))

const statusColors = {
  "Chờ xử lý": "warning",
  "Đã chọn": "success",
  "Đã từ chối": "error",
  "Đang kiểm tra": "info",
  "Yêu thích": "secondary",
  pending: "warning",
  Accepted: "success",
  Rejected: "error",
}

// Email templates
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
  `,
}

const SubmittedCVs = () => {
  const employer = useSelector(selectCurrentEmployer)
  const [jobs, setJobs] = useState([])
  const [applicants, setApplicants] = useState([])
  const [selectedJobId, setSelectedJobId] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState("")
  const [selectedApplicant, setSelectedApplicant] = useState(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false)
  const [compareDrawerOpen, setCompareDrawerOpen] = useState(false)
  const [selectedApplicantsForCompare, setSelectedApplicantsForCompare] = useState([])
  const [selectedApplicants, setSelectedApplicants] = useState([])
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [loading, setLoading] = useState(false)
  const [tabValue, setTabValue] = useState(0) // 0: Ứng viên mới, 1: Đã chọn, 2: Đã từ chối

  const handleOpenDialog = (type, applicant = null) => {
    setDialogType(type)
    setSelectedApplicant(applicant)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedApplicant(null)
    setRejectionReason("")
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

  const handleOpenProfileDrawer = (applicant) => {
    setSelectedApplicant(applicant)
    setProfileDrawerOpen(true)
  }

  const handleCloseProfileDrawer = () => {
    setProfileDrawerOpen(false)
  }

  const handleOpenCompareDrawer = () => {
    if (selectedApplicants.length < 2) {
      showSnackbar("Vui lòng chọn ít nhất 2 ứng viên để so sánh", "warning")
      return
    }

    const applicantsToCompare = applicants.filter((a) => selectedApplicants.includes(a.id))
    setSelectedApplicantsForCompare(applicantsToCompare)
    setCompareDrawerOpen(true)
  }

  const handleCloseCompareDrawer = () => {
    setCompareDrawerOpen(false)
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
    setPage(1) // Reset về trang đầu tiên khi chuyển tab
  }

  const sendEmail = (template, applicant, job) => {
    // Simulate sending email
    console.log("Sending email to:", applicant.email)
    let emailContent = ""

    if (template === "testInvitation") {
      emailContent = emailTemplates.testInvitation(applicant.name, job.title)
    } else if (template === "rejection") {
      emailContent = emailTemplates.rejection(applicant.name, job.title)
    }

    console.log("Email content:", emailContent)
    return true // Simulate successful email sending
  }

  const handleApproveApplicant = async (applicantId) => {
    const applicant = applicants.find((a) => a.id === applicantId)
    const job = jobs.find((j) => j.id === applicant.jobId)

    if (!applicant || !job) return

    setLoading(true)
    try {
      // Gọi API để cập nhật trạng thái ứng viên
      await updateApplicationStatus(applicantId, "Accepted", "", applicant.name, job.title, applicant.email)

      // Fetch lại dữ liệu để cập nhật UI
      await fetchData()

      // Chuyển sang tab "Đã chọn"
      setTabValue(1)

      showSnackbar(`Đã chọn ứng viên ${applicant.name} và gửi email thông báo`)
    } catch (error) {
      console.error("Error approving applicant:", error)
      showSnackbar("Không thể chọn ứng viên. Vui lòng thử lại sau.", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleBatchApprove = async () => {
    if (selectedApplicants.length === 0) {
      showSnackbar("Vui lòng chọn ít nhất một ứng viên", "warning")
      return
    }

    setLoading(true)
    try {
      // Xử lý từng ứng viên được chọn
      for (const applicantId of selectedApplicants) {
        const applicant = applicants.find((a) => a.id === applicantId)
        const job = jobs.find((j) => j.id === applicant.jobId)

        if ((applicant && job && applicant.status === "Chờ xử lý") || applicant.status === "pending") {
          await updateApplicationStatus(applicantId, "Accepted", "", applicant.name, job.title, applicant.email)
        }
      }

      // Fetch lại dữ liệu để cập nhật UI
      await fetchData()

      // Chuyển sang tab "Đã chọn"
      setTabValue(1)

      showSnackbar(`Đã chọn ${selectedApplicants.length} ứng viên và gửi email thông báo`)
      setSelectedApplicants([])
    } catch (error) {
      console.error("Error batch approving applicants:", error)
      showSnackbar("Không thể chọn ứng viên. Vui lòng thử lại sau.", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleRejectApplicant = async (applicantId) => {
    if (!selectedApplicant) return

    const job = jobs.find((j) => j.id === selectedApplicant.jobId)
    if (!job) return

    setLoading(true)
    try {
      // Gọi API để cập nhật trạng thái ứng viên
      await updateApplicationStatus(
        applicantId,
        "Rejected",
        rejectionReason,
        selectedApplicant.name,
        job.title,
        selectedApplicant.email,
      )

      // Fetch lại dữ liệu để cập nhật UI
      await fetchData()

      showSnackbar(`Đã từ chối ứng viên ${selectedApplicant.name} và gửi email thông báo`)
      handleCloseDialog()
    } catch (error) {
      console.error("Error rejecting applicant:", error)
      showSnackbar("Không thể từ chối ứng viên. Vui lòng thử lại sau.", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleBatchReject = async () => {
    if (selectedApplicants.length === 0) {
      showSnackbar("Vui lòng chọn ít nhất một ứng viên", "warning")
      return
    }

    setLoading(true)
    try {
      // Xử lý từng ứng viên được chọn
      for (const applicantId of selectedApplicants) {
        const applicant = applicants.find((a) => a.id === applicantId)
        const job = jobs.find((j) => j.id === applicant.jobId)

        if ((applicant && job && applicant.status === "Chờ xử lý") || applicant.status === "pending") {
          await updateApplicationStatus(
            applicantId,
            "Rejected",
            "Batch rejection",
            applicant.name,
            job.title,
            applicant.email,
          )
        }
      }

      // Fetch lại dữ liệu để cập nhật UI
      await fetchData()

      showSnackbar(`Đã từ chối ${selectedApplicants.length} ứng viên và gửi email thông báo`)
      setSelectedApplicants([])
    } catch (error) {
      console.error("Error batch rejecting applicants:", error)
      showSnackbar("Không thể từ chối ứng viên. Vui lòng thử lại sau.", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteApplicant = async (applicantId) => {
    const applicant = applicants.find((a) => a.id === applicantId)
    if (!applicant) return

    setLoading(true)
    try {
      // Gọi API để xóa ứng viên (hoặc đánh dấu là đã xóa)
      // Trong thực tế, bạn sẽ gọi API để xóa ứng viên
      // await deleteApplication(applicantId)

      // Fetch lại dữ liệu để cập nhật UI
      await fetchData()

      showSnackbar(`Đã xóa hồ sơ của ${applicant.name}`)
    } catch (error) {
      console.error("Error deleting applicant:", error)
      showSnackbar("Không thể xóa ứng viên. Vui lòng thử lại sau.", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAllApplicants = (event, jobId) => {
    if (event.target.checked) {
      const jobApplicantIds = getJobApplicants(jobId).map((a) => a.id)
      setSelectedApplicants(jobApplicantIds)
    } else {
      setSelectedApplicants([])
    }
  }

  const handleSelectApplicant = (event, applicantId) => {
    if (event.target.checked) {
      setSelectedApplicants([...selectedApplicants, applicantId])
    } else {
      setSelectedApplicants(selectedApplicants.filter((id) => id !== applicantId))
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const getJobApplicants = (jobId) => {
    return applicants.filter((a) => a.jobId === jobId)
  }

  // Lọc ứng viên theo tab và job đã chọn
  const filteredApplicants = useMemo(() => {
    if (!selectedJobId) return []

    const jobApplicants = getJobApplicants(selectedJobId)

    // Lọc theo tab
    switch (tabValue) {
      case 0: // Ứng viên mới
        return jobApplicants.filter((a) => a.status === "Chờ xử lý" || a.status === "pending")
      case 1: // Đã chọn
        return jobApplicants.filter((a) => a.status === "Đã chọn" || a.status === "Accepted")
      default:
        return jobApplicants
    }
  }, [selectedJobId, applicants, tabValue])

  // Phân trang
  const paginatedApplicants = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage
    return filteredApplicants.slice(startIndex, startIndex + rowsPerPage)
  }, [filteredApplicants, page, rowsPerPage])

  const fetchData = async () => {
    try {
      setLoading(true)
      const jobsData = await fetchJobdByEmployerId(employer._id)
      const formattedJobs = jobsData.map((job) => ({
        id: job._id,
        title: job.title,
        department: job.department || "Engineering",
        position: job.position || "N/A",
        location:
          job.locations && job.locations.length > 0
            ? job.locations.map((loc) => loc.charAt(0).toUpperCase() + loc.slice(1)).join(", ")
            : "N/A",
        postedDate: new Date(job.createdAt).toLocaleDateString("en-GB"),
        deadline: new Date(job.deadline).toLocaleDateString("en-GB"),
        status: job._destroy ? "Đã đóng" : "Đang tuyển",
        applicantsCount: job.applicantsCount || 0,
        requiredSkills: job.skills || [],
        salary: {
          min: job.salary?.min || 0,
          max: job.salary?.max || 0,
        },
        jobType: job.jobType,
        workplace: job.workplace,
        acceptFresher: job.acceptFresher,
        jobDescription: job.jobDescription ? job.jobDescription.replace(/\\n/g, "\n").replace(/"/g, "") : "",
        jobRequirement: job.jobRequirement ? job.jobRequirement.replace(/\\n/g, "\n").replace(/"/g, "") : "",
        benefits: job.benefits ? job.benefits.replace(/\\n/g, "\n").replace(/"/g, "") : "",
      }))

      setJobs(formattedJobs)

      const applicantsData = await fetchApplicationsByEmployerIdInCVPhase(employer._id)
      setApplicants(applicantsData)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error)
      showSnackbar("Không thể tải dữ liệu. Vui lòng thử lại sau.", "error")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Đếm số lượng ứng viên theo trạng thái cho job đã chọn
  const getApplicantCounts = (jobId) => {
    const jobApplicants = getJobApplicants(jobId)
    return {
      new: jobApplicants.filter((a) => a.status === "Chờ xử lý" || a.status === "pending").length,
      accepted: jobApplicants.filter((a) => a.status === "Đã chọn" || a.status === "Accepted").length,
      rejected: jobApplicants.filter((a) => a.status === "Đã từ chối" || a.status === "Rejected").length,
      total: jobApplicants.length,
    }
  }

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: "#f8fafc",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      }}
    >
      {loading && (
        <LinearProgress
          sx={{
            mb: 3,
            borderRadius: "4px",
            height: "6px",
            backgroundColor: "#e2e8f0",
            "& .MuiLinearProgress-bar": {
              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
            },
          }}
        />
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          p: 3,
          bgcolor: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
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
            Quản lý hồ sơ ứng tuyển
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Xem xét và quản lý các ứng viên cho các vị trí tuyển dụng
          </Typography>
        </Box>
        <GradientButton
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={fetchData}
          disabled={loading}
        >
          Làm mới dữ liệu
        </GradientButton>
      </Box>

      <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mb: 3, color: "#374151" }}>
        Danh sách công việc và ứng viên
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
                  {job.department} • {job.location}
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
                  Đăng ngày: {job.postedDate}
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
                    background:
                      job.status === "Đang tuyển"
                        ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                        : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    color: "#ffffff",
                    fontWeight: 600,
                    borderRadius: "10px",
                  }}
                />
              </Box>
            </Box>
          </StyledAccordionSummary>
          <AccordionDetails sx={{ p: 4, backgroundColor: "#fafbfc" }}>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
                <Typography variant="subtitle1" fontWeight="600" sx={{ mr: 2, color: "#374151" }}>
                  Kỹ năng yêu cầu:
                </Typography>
                {job.requiredSkills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    sx={{
                      backgroundColor: "#e0e7ff",
                      color: "#3730a3",
                      fontWeight: 500,
                      borderRadius: "8px",
                      "&:hover": {
                        backgroundColor: "#c7d2fe",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>

            <Divider sx={{ mb: 4, borderColor: "#e2e8f0" }} />

            {selectedJobId === job.id && (
              <Box sx={{ mb: 4 }}>
                {/* Tabs để phân loại ứng viên */}
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  sx={{
                    mb: 3,
                    "& .MuiTabs-indicator": {
                      background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                      height: "3px",
                      borderRadius: "2px",
                    },
                    "& .MuiTab-root": {
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "1rem",
                      minHeight: "60px",
                      "&.Mui-selected": {
                        color: "#667eea",
                      },
                    },
                  }}
                >
                  <Tab
                    label={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        Ứng viên mới
                        <Chip
                          label={getApplicantCounts(job.id).new}
                          size="small"
                          sx={{
                            backgroundColor: "#fef3c7",
                            color: "#92400e",
                            fontWeight: 600,
                            height: 24,
                            minWidth: 24,
                          }}
                        />
                      </Box>
                    }
                  />
                  <Tab
                    label={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        Đã chọn
                        <Chip
                          label={getApplicantCounts(job.id).accepted}
                          size="small"
                          sx={{
                            backgroundColor: "#d1fae5",
                            color: "#065f46",
                            fontWeight: 600,
                            height: 24,
                            minWidth: 24,
                          }}
                        />
                      </Box>
                    }
                  />
                </Tabs>

                {/* Hiển thị các nút hành động theo tab */}
                {tabValue === 0 && (
                  <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3, gap: 2 }}>
                    <GradientButton
                      variant="contained"
                      color="success"
                      onClick={handleBatchApprove}
                      disabled={selectedApplicants.length === 0 || loading}
                    >
                      Chọn ứng viên ({selectedApplicants.length})
                    </GradientButton>
                    <GradientButton
                      variant="contained"
                      color="error"
                      onClick={handleBatchReject}
                      disabled={selectedApplicants.length === 0 || loading}
                    >
                      Từ chối ({selectedApplicants.length})
                    </GradientButton>
                  </Box>
                )}

                {getJobApplicants(job.id).length === 0 ? (
                  <StyledCard>
                    <CardContent sx={{ textAlign: "center", py: 6 }}>
                      <PeopleIcon sx={{ fontSize: 64, color: "#d1d5db", mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" sx={{ fontStyle: "italic" }}>
                        Chưa có ứng viên nào ứng tuyển cho vị trí này
                      </Typography>
                    </CardContent>
                  </StyledCard>
                ) : filteredApplicants.length === 0 ? (
                  <StyledCard>
                    <CardContent sx={{ textAlign: "center", py: 6 }}>
                      <Typography variant="h6" color="text.secondary" sx={{ fontStyle: "italic" }}>
                        Không có ứng viên nào trong danh mục này
                      </Typography>
                    </CardContent>
                  </StyledCard>
                ) : (
                  <>
                    <TableContainer
                      component={Paper}
                      sx={{
                        borderRadius: "16px",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                        border: "1px solid #e2e8f0",
                        overflow: "hidden",
                      }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow>
                            {tabValue === 0 && (
                              <StyledTableCell padding="checkbox">
                                <Checkbox
                                  sx={{
                                    color: "#ffffff",
                                    "&.Mui-checked": {
                                      color: "#ffffff",
                                    },
                                  }}
                                  onChange={(e) => handleSelectAllApplicants(e, job.id)}
                                  checked={
                                    filteredApplicants.length > 0 &&
                                    filteredApplicants.every((a) => selectedApplicants.includes(a.id))
                                  }
                                  indeterminate={
                                    filteredApplicants.some((a) => selectedApplicants.includes(a.id)) &&
                                    !filteredApplicants.every((a) => selectedApplicants.includes(a.id))
                                  }
                                />
                              </StyledTableCell>
                            )}
                            <StyledTableCell>Ứng viên</StyledTableCell>
                            <StyledTableCell>Thông tin liên hệ</StyledTableCell>
                            <StyledTableCell>Học vấn & Kinh nghiệm</StyledTableCell>
                            <StyledTableCell>Độ phù hợp</StyledTableCell>
                            <StyledTableCell align="center">Thao tác</StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {console.log(paginatedApplicants)}
                          {paginatedApplicants.map((applicant) => (
                            <StyledTableRow key={applicant.id}>
                              {tabValue === 0 && (
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    sx={{
                                      color: "#667eea",
                                      "&.Mui-checked": {
                                        color: "#667eea",
                                      },
                                    }}
                                    checked={selectedApplicants.includes(applicant.id)}
                                    onChange={(e) => handleSelectApplicant(e, applicant.id)}
                                  />
                                </TableCell>
                              )}
                              <TableCell>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <Avatar
                                    src={applicant.avatar}
                                    alt={applicant.name}
                                    sx={{
                                      mr: 3,
                                      width: 56,
                                      height: 56,
                                      border: "3px solid #e2e8f0",
                                    }}
                                  />
                                  <Box>
                                    <Typography variant="subtitle1" fontWeight="600" sx={{ color: "#1f2937", mb: 0.5 }}>
                                      {applicant.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                      {applicant.title || "Job Seeker"}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: "#6b7280",
                                        backgroundColor: "#f3f4f6",
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: "6px",
                                      }}
                                    >
                                      Ngày ứng tuyển: {applicant.appliedDate}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                  <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <EmailIcon fontSize="small" sx={{ color: "#667eea", mr: 1 }} />
                                    <Typography variant="body2" sx={{ color: "#374151" }}>
                                      {applicant.email}
                                    </Typography>
                                  </Box>
                                  <Typography variant="body2" sx={{ color: "#6b7280", ml: 3 }}>
                                    {applicant.phone}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                  <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <SchoolIcon fontSize="small" sx={{ mr: 1, color: "#10b981" }} />
                                    <Typography variant="body2" sx={{ color: "#374151" }}>
                                      {applicant.education && applicant.education.length > 0
                                        ? `${applicant.education.length} trường học`
                                        : "Chưa có thông tin"}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <WorkHistoryIcon fontSize="small" sx={{ mr: 1, color: "#f59e0b" }} />
                                    <Typography variant="body2" sx={{ color: "#374151" }}>
                                      {applicant.experience && applicant.experience.length > 0
                                        ? `${applicant.experience.length} kinh nghiệm`
                                        : "Chưa có thông tin"}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <Box sx={{ width: "100%", mr: 2 }}>
                                    <LinearProgress
                                      variant="determinate"
                                      value={applicant.skillMatch || 0}
                                      sx={{
                                        height: 10,
                                        borderRadius: 5,
                                        backgroundColor: "#e5e7eb",
                                        "& .MuiLinearProgress-bar": {
                                          background:
                                            applicant.skillMatch >= 80
                                              ? "linear-gradient(90deg, #10b981 0%, #059669 100%)"
                                              : applicant.skillMatch >= 60
                                                ? "linear-gradient(90deg, #667eea 0%, #764ba2 100%)"
                                                : "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)",
                                          borderRadius: 5,
                                        },
                                      }}
                                    />
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    fontWeight="600"
                                    sx={{
                                      color:
                                        applicant.skillMatch >= 80
                                          ? "#059669"
                                          : applicant.skillMatch >= 60
                                            ? "#667eea"
                                            : "#d97706",
                                      minWidth: "40px",
                                    }}
                                  >
                                    {applicant.skillMatch || 0}%
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <Stack direction="row" spacing={1} justifyContent="center">
                                  <Tooltip title="Xem hồ sơ chi tiết">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleOpenProfileDrawer(applicant)}
                                      disabled={loading}
                                      sx={{
                                        backgroundColor: "#e0e7ff",
                                        color: "#3730a3",
                                        "&:hover": {
                                          backgroundColor: "#c7d2fe",
                                        },
                                      }}
                                    >
                                      <PersonIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>

                                  <Tooltip title="Xem CV">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleOpenDialog("view", applicant)}
                                      disabled={loading}
                                      sx={{
                                        backgroundColor: "#dbeafe",
                                        color: "#1e40af",
                                        "&:hover": {
                                          backgroundColor: "#bfdbfe",
                                        },
                                      }}
                                    >
                                      <VisibilityIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>

                                  {tabValue === 0 && (
                                    <>
                                      <Tooltip title="Chọn ứng viên">
                                        <IconButton
                                          size="small"
                                          onClick={() => handleApproveApplicant(applicant.id)}
                                          disabled={loading}
                                          sx={{
                                            backgroundColor: "#d1fae5",
                                            color: "#065f46",
                                            "&:hover": {
                                              backgroundColor: "#a7f3d0",
                                            },
                                          }}
                                        >
                                          <CheckCircleOutlineIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Từ chối">
                                        <IconButton
                                          size="small"
                                          onClick={() => handleOpenDialog("reject", applicant)}
                                          disabled={loading}
                                          sx={{
                                            backgroundColor: "#fee2e2",
                                            color: "#991b1b",
                                            "&:hover": {
                                              backgroundColor: "#fecaca",
                                            },
                                          }}
                                        >
                                          <CancelOutlinedIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    </>
                                  )}
                                </Stack>
                              </TableCell>
                            </StyledTableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                      <Pagination
                        count={Math.ceil(filteredApplicants.length / rowsPerPage)}
                        page={page}
                        onChange={handleChangePage}
                        sx={{
                          "& .MuiPaginationItem-root": {
                            borderRadius: "10px",
                            fontWeight: 600,
                            "&.Mui-selected": {
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              color: "#ffffff",
                            },
                          },
                        }}
                      />
                    </Box>
                  </>
                )}
              </Box>
            )}
          </AccordionDetails>
        </StyledAccordion>
      ))}

      {/* View Applicant Dialog */}
      <Dialog
        open={openDialog && dialogType === "view"}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        {selectedApplicant && (
          <>
            <DialogTitle sx={{ p: 4, pb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  src={selectedApplicant.avatar}
                  alt={selectedApplicant.name}
                  sx={{
                    mr: 3,
                    width: 72,
                    height: 72,
                    border: "4px solid #e2e8f0",
                  }}
                />
                <Box>
                  <Typography variant="h5" fontWeight="600" sx={{ color: "#1f2937", mb: 1 }}>
                    {selectedApplicant.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Ứng tuyển vị trí: {jobs.find((j) => j.id === selectedApplicant.jobId)?.title}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 4 }}>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <StyledCard>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight="600" gutterBottom sx={{ color: "#374151" }}>
                        Thông tin liên hệ
                      </Typography>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <EmailIcon sx={{ color: "#667eea", mr: 2 }} />
                          <Typography variant="body1">{selectedApplicant.email}</Typography>
                        </Box>
                        <Typography variant="body1">
                          <strong>Số điện thoại:</strong> {selectedApplicant.phone}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Ngày ứng tuyển:</strong> {selectedApplicant.appliedDate}
                        </Typography>
                      </Box>
                    </CardContent>
                  </StyledCard>
                </Grid>
                <Grid item xs={12} md={6}>
                  <StyledCard>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight="600" gutterBottom sx={{ color: "#374151" }}>
                        Học vấn & Kinh nghiệm
                      </Typography>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <SchoolIcon sx={{ color: "#10b981", mr: 2 }} />
                          <Typography variant="body1">
                            {selectedApplicant.education && selectedApplicant.education.length > 0
                              ? selectedApplicant.education.map((edu) => edu.school).join(", ")
                              : "Chưa có thông tin"}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <WorkHistoryIcon sx={{ color: "#f59e0b", mr: 2 }} />
                          <Typography variant="body1">
                            {selectedApplicant.experience && selectedApplicant.experience.length > 0
                              ? selectedApplicant.experience.map((exp) => exp.company).join(", ")
                              : "Chưa có thông tin"}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </StyledCard>
                </Grid>
                <Grid item xs={12}>
                  <StyledCard>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight="600" gutterBottom sx={{ color: "#374151" }}>
                        CV / Hồ sơ
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                        <FileOpenIcon sx={{ color: "#667eea", mr: 2 }} />
                        <Link
                          href={selectedApplicant.cvLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: "#667eea",
                            fontWeight: 600,
                            textDecoration: "none",
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                        >
                          Xem CV của {selectedApplicant.name}
                        </Link>
                      </Box>
                    </CardContent>
                  </StyledCard>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 4, pt: 2 }}>
              <Button onClick={handleCloseDialog} sx={{ borderRadius: "10px" }}>
                Đóng
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  handleCloseDialog()
                  handleOpenProfileDrawer(selectedApplicant)
                }}
                sx={{
                  borderRadius: "10px",
                  borderColor: "#667eea",
                  color: "#667eea",
                  "&:hover": {
                    borderColor: "#5a67d8",
                    backgroundColor: "#f7fafc",
                  },
                }}
              >
                Xem hồ sơ chi tiết
              </Button>
              {(selectedApplicant.status === "Chờ xử lý" || selectedApplicant.status === "pending") && (
                <>
                  <GradientButton
                    variant="contained"
                    color="error"
                    onClick={() => {
                      handleCloseDialog()
                      handleOpenDialog("reject", selectedApplicant)
                    }}
                  >
                    Từ chối
                  </GradientButton>
                  <GradientButton
                    variant="contained"
                    color="success"
                    onClick={() => {
                      handleCloseDialog()
                      handleApproveApplicant(selectedApplicant.id)
                    }}
                  >
                    Chọn ứng viên
                  </GradientButton>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Reject Applicant Dialog */}
      <Dialog
        open={openDialog && dialogType === "reject"}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        {selectedApplicant && (
          <>
            <DialogTitle sx={{ p: 4, pb: 2 }}>
              <Typography variant="h5" fontWeight="600" sx={{ color: "#1f2937" }}>
                Từ chối ứng viên
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ p: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Bạn có chắc chắn muốn từ chối ứng viên <strong>{selectedApplicant.name}</strong>?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Một email thông báo sẽ được gửi đến ứng viên.
                </Typography>
              </Box>
              <TextField
                label="Lý do từ chối (tùy chọn)"
                fullWidth
                multiline
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Nhập lý do từ chối để cải thiện email thông báo (chỉ lưu nội bộ, không gửi cho ứng viên)"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "&.Mui-focused fieldset": {
                      borderColor: "#667eea",
                    },
                  },
                }}
              />
            </DialogContent>
            <DialogActions sx={{ p: 4, pt: 2 }}>
              <Button onClick={handleCloseDialog} sx={{ borderRadius: "10px" }}>
                Hủy
              </Button>
              <GradientButton
                variant="contained"
                color="error"
                onClick={() => handleRejectApplicant(selectedApplicant.id)}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Từ chối và gửi email"}
              </GradientButton>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Profile Drawer */}
      <Drawer
        anchor="right"
        open={profileDrawerOpen}
        onClose={handleCloseProfileDrawer}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "80%", md: "70%" },
            maxWidth: "1000px",
            borderTopLeftRadius: "20px",
            borderBottomLeftRadius: "20px",
          },
        }}
      >
        {selectedApplicant && <ApplicantProfileView applicant={selectedApplicant} onClose={handleCloseProfileDrawer} />}
      </Drawer>

      {/* Compare Drawer */}
      <Drawer
        anchor="right"
        open={compareDrawerOpen}
        onClose={handleCloseCompareDrawer}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "90%", md: "80%" },
            maxWidth: "1200px",
            borderTopLeftRadius: "20px",
            borderBottomLeftRadius: "20px",
          },
        }}
      >
        <Box sx={{ p: 4, bgcolor: "#f8fafc", height: "100vh", overflowY: "auto" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            <IconButton
              onClick={handleCloseCompareDrawer}
              sx={{
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  backgroundColor: "#f3f4f6",
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h4"
              fontWeight="700"
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              So sánh ứng viên
            </Typography>
            <Box width={56} /> {/* Empty box for alignment */}
          </Box>

          <Grid container spacing={3}>
            {selectedApplicantsForCompare.map((applicant) => (
              <Grid item xs={12} md={6} key={applicant.id}>
                <StyledCard sx={{ mb: 3 }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Avatar
                        src={applicant.avatar}
                        alt={applicant.name}
                        sx={{
                          mr: 3,
                          width: 72,
                          height: 72,
                          border: "4px solid #e2e8f0",
                        }}
                      />
                      <Box>
                        <Typography variant="h5" fontWeight="600" sx={{ color: "#1f2937", mb: 1 }}>
                          {applicant.name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {applicant.title || "Job Seeker"}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ mb: 3, borderColor: "#e2e8f0" }} />

                    <Typography variant="h6" fontWeight="600" gutterBottom sx={{ color: "#374151" }}>
                      Thông tin liên hệ
                    </Typography>
                    <Box sx={{ mb: 3, display: "flex", flexDirection: "column", gap: 1 }}>
                      <Typography variant="body1">
                        <strong>Email:</strong> {applicant.email}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Số điện thoại:</strong> {applicant.phone}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 3, borderColor: "#e2e8f0" }} />

                    <Typography variant="h6" fontWeight="600" gutterBottom sx={{ color: "#374151" }}>
                      Học vấn
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      {applicant.education && applicant.education.length > 0 ? (
                        applicant.education.map((edu, index) => (
                          <Box key={index} sx={{ mb: 2, p: 2, backgroundColor: "#f8fafc", borderRadius: "10px" }}>
                            <Typography variant="body1" fontWeight="600" sx={{ color: "#1f2937" }}>
                              {edu.school}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {edu.major} ({edu.fromYear} - {edu.isCurrentlyStudying ? "Hiện tại" : edu.toYear})
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                          Chưa có thông tin
                        </Typography>
                      )}
                    </Box>

                    <Divider sx={{ my: 3, borderColor: "#e2e8f0" }} />

                    <Typography variant="h6" fontWeight="600" gutterBottom sx={{ color: "#374151" }}>
                      Kinh nghiệm
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      {applicant.experience && applicant.experience.length > 0 ? (
                        applicant.experience.map((exp, index) => (
                          <Box key={index} sx={{ mb: 2, p: 2, backgroundColor: "#f8fafc", borderRadius: "10px" }}>
                            <Typography variant="body1" fontWeight="600" sx={{ color: "#1f2937" }}>
                              {exp.jobTitle} tại {exp.company}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {exp.fromYear} - {exp.isCurrentlyWorking ? "Hiện tại" : exp.toYear}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                          Chưa có thông tin
                        </Typography>
                      )}
                    </Box>

                    <Divider sx={{ my: 3, borderColor: "#e2e8f0" }} />

                    <Typography variant="h6" fontWeight="600" gutterBottom sx={{ color: "#374151" }}>
                      Độ phù hợp
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box sx={{ width: "100%", mr: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={applicant.skillMatch || 0}
                          sx={{
                            height: 12,
                            borderRadius: 6,
                            backgroundColor: "#e5e7eb",
                            "& .MuiLinearProgress-bar": {
                              background:
                                applicant.skillMatch >= 80
                                  ? "linear-gradient(90deg, #10b981 0%, #059669 100%)"
                                  : applicant.skillMatch >= 60
                                    ? "linear-gradient(90deg, #667eea 0%, #764ba2 100%)"
                                    : "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)",
                              borderRadius: 6,
                            },
                          }}
                        />
                      </Box>
                      <Typography
                        variant="h6"
                        fontWeight="700"
                        sx={{
                          color:
                            applicant.skillMatch >= 80 ? "#059669" : applicant.skillMatch >= 60 ? "#667eea" : "#d97706",
                          minWidth: "50px",
                        }}
                      >
                        {applicant.skillMatch || 0}%
                      </Typography>
                    </Box>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Drawer>

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

export default SubmittedCVs
