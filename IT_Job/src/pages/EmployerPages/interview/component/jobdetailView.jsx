"use client"

import { useMemo } from "react"
import {
  Box,
  Typography,
  Button,
  TableCell,
  Chip,
  IconButton,
  Grid,
  Stack,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Avatar,
  Badge,
} from "@mui/material"

import EditIcon from "@mui/icons-material/Edit"
import SendIcon from "@mui/icons-material/Send"
import AssessmentIcon from "@mui/icons-material/Assessment"
import WorkIcon from "@mui/icons-material/Work"
import PeopleIcon from "@mui/icons-material/People"
import VideocamIcon from "@mui/icons-material/Videocam"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import SchoolIcon from "@mui/icons-material/School"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import PersonOutlineIcon from "@mui/icons-material/PersonOutline"
import EventIcon from "@mui/icons-material/Event"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import GroupIcon from "@mui/icons-material/Group"
import NotesIcon from "@mui/icons-material/Notes"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import EmailIcon from "@mui/icons-material/Email"
import PhoneIcon from "@mui/icons-material/Phone"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import BarChartIcon from "@mui/icons-material/BarChart"

import { PieChart, BarChart } from "@mui/x-charts"

// Mock data for demonstration
const statusColors = {
  Đạt: "success",
  "Không đạt": "error",
  "Đang đánh giá": "warning",
  "Chờ phỏng vấn": "info",
  "Chờ làm test": "default",
  "Đã hoàn thành": "success",
  "Chờ xác nhận": "warning",
}

const StyledTableCell = TableCell

const JobDetailView = ({
  job,
  qualifiedApplicants,
  interviews,
  onBack,
  onOpenDialog,
  onSaveInterview,
  onDeleteInterview,
  onSendInvitation,
  onCreateInterviewRound,
  getApplicantsForRound,
  getRoundInterviews,
  getApplicantById,
  showSnackbar,
  applicantDetail,
  onSetSelectedApplicantDetail,
}) => {
  const selectedApplicantDetail = applicantDetail

  const jobApplicants = useMemo(
    () => qualifiedApplicants.filter((a) => String(a.jobId) === String(job.id || job._id)),
    [qualifiedApplicants, job.id, job._id],
  )

  const overallStatusStats = useMemo(() => {
    const stats = {
      Đạt: 0,
      "Không đạt": 0,
      "Đang đánh giá": 0,
      "Chờ phỏng vấn": 0,
      "Chờ làm test": 0,
    }
    jobApplicants.forEach((applicant) => {
      if (stats[applicant.currentOverallStatus] !== undefined) {
        stats[applicant.currentOverallStatus]++
      } else {
        stats[applicant.currentOverallStatus] = (stats[applicant.currentOverallStatus] || 0) + 1
      }
    })
    return Object.keys(stats)
      .filter((key) => stats[key] > 0)
      .map((status) => ({
        id: status,
        value: stats[status],
        label: status,
        color: statusColors[status]
          ? statusColors[status] === "success"
            ? "#10b981"
            : statusColors[status] === "error"
              ? "#ef4444"
              : statusColors[status] === "warning"
                ? "#f59e0b"
                : statusColors[status] === "info"
                  ? "#3b82f6"
                  : "#6b7280"
          : "#6b7280",
      }))
  }, [jobApplicants])

  const applicantsPerRoundData = useMemo(() => {
    const roundCounts = (job.interviewRounds || []).reduce((acc, round) => {
      acc[round.name.split(":")[0].trim()] = 0
      return acc
    }, {})

    jobApplicants.forEach((applicant) => {
      const currentRoundDetails = (job.interviewRounds || []).find(
        (r) => String(r.id || r._id) === String(applicant.currentRound),
      )
      if (currentRoundDetails) {
        const roundNameKey = currentRoundDetails.name.split(":")[0].trim()
        if (roundCounts[roundNameKey] !== undefined) {
          roundCounts[roundNameKey]++
        }
      }
    })

    return {
      labels: Object.keys(roundCounts),
      datasets: [
        {
          label: "Số lượng ứng viên",
          data: Object.values(roundCounts),
          backgroundColor: "#3b82f6",
        },
      ],
    }
  }, [jobApplicants, job.interviewRounds])

  return (
    <Box
      sx={{
        display: "flex",
        height: "calc(100vh - 48px)",
        bgcolor: "#f8fafc",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      }}
    >
      {/* Left Panel: Applicant List */}
      <Box
        sx={{
          width: "250px",
          bgcolor: "white",
          borderRight: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box sx={{ p: 3, borderBottom: "1px solid #e2e8f0" }}>
          <Button
            startIcon={<ChevronLeftIcon />}
            onClick={onBack}
            sx={{
              mb: 2,
              width: "100%",
              justifyContent: "flex-start",
              color: "#64748b",
              "&:hover": { bgcolor: "#f1f5f9" },
            }}
          >
            {job.title}
          </Button>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6" fontWeight="600" color="#1e293b">
              Ứng viên
            </Typography>
            <Badge
              badgeContent={jobApplicants.length}
              color="primary"
              sx={{
                "& .MuiBadge-badge": {
                  bgcolor: "#3b82f6",
                  color: "white",
                },
              }}
            >
              <PeopleIcon color="action" />
            </Badge>
          </Box>
        </Box>

        {/* Applicant List */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
          {jobApplicants.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 6,
                color: "#64748b",
              }}
            >
              <PersonOutlineIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
              <Typography variant="body2" sx={{ fontStyle: "italic", textAlign: "center" }}>
                Chưa có ứng viên nào
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1}>
              {jobApplicants
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((applicant) => (
                  <Card
                    key={applicant.id}
                    onClick={() => onSetSelectedApplicantDetail(applicant)}
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.2s ease-in-out",
                      border: selectedApplicantDetail?.id === applicant.id ? "2px solid #3b82f6" : "1px solid #e2e8f0",
                      bgcolor: selectedApplicantDetail?.id === applicant.id ? "#eff6ff" : "white",
                      "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                          src={applicant.avatar} // <-- THAY ĐỔI: Dùng applicant.avatar (đảm bảo là 'avatar' không phải 'avatr')
                          sx={{
                              bgcolor: selectedApplicantDetail?.id === applicant.id ? "#3b82f6" : "#64748b",
                              width: 40,
                              height: 40,
                          }}
                      >
                          {/* Fallback nếu không có avatar, hiển thị chữ cái đầu tiên từ tên của applicant hiện tại */}
                          {applicant.name ? applicant.name.charAt(0).toUpperCase() : ''}
                      </Avatar>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography variant="subtitle2" fontWeight="600" color="#1e293b" noWrap>
                            {applicant.name}
                          </Typography>
                          
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
            </Stack>
          )}
        </Box>
      </Box>

      {/* Right Panel: Dynamic Content */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", bgcolor: "#f8fafc",  width: "550px", }}>
        <Box sx={{ flexGrow: 1, overflowY: "auto", p: 4 }}>
          {!selectedApplicantDetail ? (
            // Job Overview
            <Box>
              {/* Header */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="700" color="#1e293b" gutterBottom>
                  {job.title}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Chip label={job.department} variant="outlined" sx={{ borderColor: "#3b82f6", color: "#3b82f6" }} />
                  <Chip label={job.locations} variant="outlined" sx={{ borderColor: "#10b981", color: "#10b981" }} />
                  <Typography variant="body2" color="#64748b">
                    Đăng ngày: {new Date(job.createdAt).toLocaleDateString("vi-VN")}
                  </Typography>
                </Box>
                <Typography variant="body1" color="#475569" sx={{ lineHeight: 1.6 }}>
                  {job.description}
                </Typography>
              </Box>

              {/* Statistics Cards */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} lg={6}>
                  <Card
                    sx={{
                      height: "100%",
                      bgcolor: "white",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                        <Typography variant="h6" fontWeight="600" color="#1e293b">
                          Thống kê trạng thái
                        </Typography>
                        <TrendingUpIcon sx={{ color: "#64748b" }} />
                      </Box>
                      {overallStatusStats.length > 0 ? (
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <PieChart series={[{ data: overallStatusStats }]} width={280} height={200} />
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: 200,
                            opacity: 0.7,
                          }}
                        >
                          <Typography variant="body2" color="#64748b">
                            Chưa có dữ liệu thống kê
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} lg={6}>
                  <Card
                    sx={{
                      height: "100%",
                      bgcolor: "white",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                        <Typography variant="h6" fontWeight="600" color="#1e293b">
                          Ứng viên theo vòng
                        </Typography>
                        <BarChartIcon sx={{ color: "#64748b" }} />
                      </Box>
                      {applicantsPerRoundData.labels.length > 0 &&
                      applicantsPerRoundData.datasets[0].data.some((d) => d > 0) ? (
                        <BarChart
                          xAxis={[{ scaleType: "band", data: applicantsPerRoundData.labels }]}
                          series={[
                            {
                              data: applicantsPerRoundData.datasets[0].data,
                              label: applicantsPerRoundData.datasets[0].label,
                              color: "#3b82f6",
                            },
                          ]}
                          height={200}
                          margin={{ top: 10, right: 10, bottom: 30, left: 40 }}
                        />
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: 200,
                            opacity: 0.7,
                          }}
                        >
                          <Typography variant="body2" color="#64748b">
                            Chưa có dữ liệu vòng phỏng vấn
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Interview Process */}
              <Card sx={{ bgcolor: "white", boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)" }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h6" fontWeight="600" color="#1e293b">
                      Quy trình phỏng vấn
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => onOpenDialog("addRound", null, job)}
                      sx={{
                        bgcolor: "#3b82f6",
                        "&:hover": { bgcolor: "#2563eb" },
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      Thêm vòng phỏng vấn
                    </Button>
                  </Box>
                  <Stepper activeStep={-1} alternativeLabel sx={{ pt: 2 }}>
                    {(job.interviewRounds || [])
                      .sort((a, b) => a.order - b.order)
                      .map((round) => (
                        <Step key={round.id || round._id}>
                          <StepLabel
                            sx={{
                              "& .MuiStepLabel-label": {
                                fontWeight: 500,
                                color: "#475569",
                              },
                            }}
                          >
                            {round.name}
                          </StepLabel>
                        </Step>
                      ))}
                  </Stepper>
                </CardContent>
              </Card>
            </Box>
          ) : (
            // Applicant Detail View
            <Box>
              {/* Header */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                  <Typography variant="h4" fontWeight="700" color="#1e293b">
                    {selectedApplicantDetail.name}
                  </Typography>
                  <Typography variant="body1" color="#64748b">
                    Thông tin chi tiết ứng viên
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AssessmentIcon />}
                  onClick={() => onOpenDialog("editOverallEvaluation", selectedApplicantDetail, job)}
                  sx={{
                    bgcolor: "#10b981",
                    "&:hover": { bgcolor: "#059669" },
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                  }}
                >
                  Đánh giá tổng quan
                </Button>
              </Box>

              {/* Contact Information */}
              <Card sx={{ mb: 3, bgcolor: "white", boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)" }}>
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" fontWeight="600" color="#1e293b" gutterBottom>
                        Thông tin liên hệ
                      </Typography>
                      <Stack spacing={2}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar sx={{ bgcolor: "#eff6ff", color: "#3b82f6", width: 32, height: 32 }}>
                            <EmailIcon fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="caption" color="#64748b">
                              Email
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                              {selectedApplicantDetail.email}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar sx={{ bgcolor: "#f0fdf4", color: "#10b981", width: 32, height: 32 }}>
                            <PhoneIcon fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="caption" color="#64748b">
                              Điện thoại
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                              {selectedApplicantDetail.phone}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar sx={{ bgcolor: "#fef3c7", color: "#f59e0b", width: 32, height: 32 }}>
                            <CalendarMonthIcon fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="caption" color="#64748b">
                              Ngày ứng tuyển
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                              {new Date(selectedApplicantDetail.appliedDate).toLocaleDateString("vi-VN")}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" fontWeight="600" color="#1e293b" gutterBottom>
                        Học vấn & Kinh nghiệm
                      </Typography>
                      <Stack spacing={2}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                          <Avatar sx={{ bgcolor: "#f3e8ff", color: "#8b5cf6", width: 32, height: 32 }}>
                            <SchoolIcon fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="caption" color="#64748b">
                              Học vấn
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                              {selectedApplicantDetail.education && selectedApplicantDetail.education.length > 0
                                ? selectedApplicantDetail.education.map((edu) => edu.school).join(", ")
                                : "N/A"}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                          <Avatar sx={{ bgcolor: "#fce7f3", color: "#ec4899", width: 32, height: 32 }}>
                            <WorkIcon fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="caption" color="#64748b">
                              Kinh nghiệm
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                              {selectedApplicantDetail.experience && selectedApplicantDetail.experience.length > 0
                                ? selectedApplicantDetail.experience.map((exp) => exp.company).join(", ")
                                : "N/A"}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Card
                        variant="outlined"
                        sx={{
                          p: 2,
                          bgcolor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              <Typography variant="body2" fontWeight="500" color="#475569">
                                Trạng thái chung:
                              </Typography>
                              <Chip
                                label={selectedApplicantDetail.currentOverallStatus}
                                color={statusColors[selectedApplicantDetail.currentOverallStatus]}
                                size="small"
                                sx={{ fontWeight: 500 }}
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              <Typography variant="body2" fontWeight="500" color="#475569">
                                Vòng hiện tại:
                              </Typography>
                              <Typography variant="body2" color="#1e293b" fontWeight="600">
                                {job.interviewRounds.find(
                                  (r) => String(r.id || r._id) === String(selectedApplicantDetail.currentRound),
                                )?.name || "N/A"}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Interview Progress */}
              <Card sx={{ bgcolor: "white", boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="600" color="#1e293b" gutterBottom>
                    Tiến độ phỏng vấn chi tiết
                  </Typography>

                  <Stack spacing={2} sx={{ mt: 2 }}>
                    {(job.interviewRounds || [])
                      .sort((a, b) => a.order - b.order)
                      .map((round) => {
                        const progress = (selectedApplicantDetail.interviewProgress || []).find(
                          (p) => String(p.roundId) === String(round.id || round._id),
                        )
                        console.log("progress" ,progress)
                        const interview = getRoundInterviews(job.id, round._id).find(
                          (i) => String(i.applicantId) === String(selectedApplicantDetail.id),
                        )
                        const previousRound = (job.interviewRounds || []).find((r) => r.order === round.order - 1)
                        const isPassedPreviousRound =
                          round.order === 1 ||
                          (selectedApplicantDetail.interviewProgress || []).find(
                            (p) => String(p.roundId) === String(previousRound?.id || previousRound?._id),
                          )?.result === "Đạt"

                        return (
                          <Card
                            key={round.id || round._id}
                            variant="outlined"
                            sx={{
                              border: "2px solid",
                              borderColor:
                                progress?.status === "Đã hoàn thành"
                                  ? progress?.result === "Đạt"
                                    ? "#10b981"
                                    : "#6b7280"
                                  : "#e2e8f0",
                              bgcolor:
                                progress?.status === "Đã hoàn thành"
                                  ? progress?.result === "Đạt"
                                    ? "#f0fdf4"
                                    : "#f9fafb"
                                  : "white",
                              transition: "all 0.2s ease-in-out",
                            }}
                          >
                            <CardContent sx={{ p: 3 }}>
                              <Box
                                sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}
                              >
                                <Typography variant="h6" fontWeight="600" color="#1e293b">
                                  {round.name}
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                  {progress?.status && (
                                    <Chip
                                      label={progress.status}
                                      color={statusColors[progress.status]}
                                      size="small"
                                      sx={{ fontWeight: 500 }}
                                    />
                                  )}
                                  {progress?.result && (
                                    <Chip
                                      label={progress.result}
                                      color={statusColors[progress.result]}
                                      size="small"
                                      sx={{ fontWeight: 500 }}
                                    />
                                  )}
                                </Stack>
                              </Box>

                              {interview && (
                                <Box sx={{ mb: 3 }}>
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                      <Stack spacing={1.5}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                          <EventIcon fontSize="small" sx={{ color: "#64748b" }} />
                                          <Typography variant="body2" color="#475569">
                                            <strong>Thời gian:</strong>{" "}
                                            {new Date(interview.date).toLocaleString("vi-VN", {
                                              dateStyle: "short",
                                              timeStyle: "short",
                                            })}
                                          </Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                          <LocationOnIcon fontSize="small" sx={{ color: "#64748b" }} />
                                          <Typography variant="body2" color="#475569">
                                            <strong>Hình thức:</strong> {interview.type}{" "}
                                            {interview.type === "Online" ? `(${interview.platform})` : ""}
                                          </Typography>
                                        </Box>
                                        {interview.type === "Online" ? (
                                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                            <VideocamIcon fontSize="small" sx={{ color: "#64748b" }} />
                                            <Typography variant="body2" color="#475569">
                                              <strong>Link:</strong>{" "}
                                              <a
                                                href={interview.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: "#3b82f6" }}
                                              >
                                                {interview.link}
                                              </a>
                                            </Typography>
                                          </Box>
                                        ) : (
                                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                            <LocationOnIcon fontSize="small" sx={{ color: "#64748b" }} />
                                            <Typography variant="body2" color="#475569">
                                              <strong>Địa điểm:</strong> {interview.location}
                                            </Typography>
                                          </Box>
                                        )}
                                      </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                      <Stack spacing={1.5}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                          <GroupIcon fontSize="small" sx={{ color: "#64748b" }} />
                                          <Typography variant="body2" color="#475569">
                                            <strong>Người phỏng vấn:</strong>{" "}
                                            {(interview.interviewers || []).join(", ")}
                                          </Typography>
                                        </Box>
                                        {interview.notes && (
                                          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                                            <NotesIcon fontSize="small" sx={{ color: "#64748b", mt: 0.2 }} />
                                            <Typography variant="body2" color="#475569">
                                              <strong>Ghi chú:</strong> {interview.notes}
                                            </Typography>
                                          </Box>
                                        )}
                                      </Stack>
                                    </Grid>
                                  </Grid>

                                  {interview.evaluation && (
                                    <Card
                                      variant="outlined"
                                      sx={{
                                        mt: 2,
                                        bgcolor: "#f0f9ff",
                                        border: "1px solid #bae6fd",
                                      }}
                                    >
                                      <CardContent sx={{ p: 2 }}>
                                        <Typography variant="subtitle2" fontWeight="600" color="#0369a1" gutterBottom>
                                          Đánh giá chi tiết:
                                        </Typography>
                                        <Grid container spacing={2}>
                                          <Grid item xs={12} sm={6}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                                              <CheckCircleOutlineIcon
                                                fontSize="small"
                                                sx={{
                                                  color: interview.evaluation.result === "Đạt" ? "#10b981" : "#f59e0b",
                                                }}
                                              />
                                              <Typography variant="body2" fontWeight="500">
                                                <strong>Kết quả:</strong> {interview.evaluation.result}
                                              </Typography>
                                            </Box>
                                            <Typography variant="body2" color="#475569">
                                              <strong>Điểm mạnh:</strong> {interview.evaluation.strengths}
                                            </Typography>
                                          </Grid>
                                          <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="#475569" sx={{ mb: 1 }}>
                                              <strong>Điểm yếu:</strong> {interview.evaluation.weaknesses}
                                            </Typography>
                                            <Typography variant="body2" color="#475569">
                                              <strong>Nhận xét:</strong> {interview.evaluation.comments}
                                            </Typography>
                                          </Grid>
                                        </Grid>
                                      </CardContent>
                                    </Card>
                                  )}
                                </Box>
                              )}

                              {/* Action Buttons */}
                              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                {!interview || interview.status === "Đã hủy" ? (
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                      console.log("Calling onOpenDialog for ADD with round.id:", round)
                                      onOpenDialog("add", selectedApplicantDetail, job, round._id)
                                    }}
                                    startIcon={<VideocamIcon />}
                                    disabled={
                                      !isPassedPreviousRound ||
                                      (progress?.status === "Đã hoàn thành" && progress?.result === "Đạt") ||
                                      (progress?.status === "Đã hoàn thành" && progress?.result === "Không đạt")
                                    }
                                    sx={{
                                      bgcolor: "#3b82f6",
                                      "&:hover": { bgcolor: "#2563eb" },
                                      borderRadius: 2,
                                      textTransform: "none",
                                      fontWeight: 600,
                                    }}
                                  >
                                    Tạo lịch phỏng vấn
                                  </Button>
                                ) : (
                                  <Stack direction="row" spacing={1}>
                                    {interview.status === "Chờ xác nhận" && (
                                      <Tooltip title="Gửi lời mời">
                                        <IconButton
                                          size="small"
                                          onClick={() => onSendInvitation(interview.id)}
                                          sx={{
                                            bgcolor: "#3b82f6",
                                            color: "white",
                                            "&:hover": { bgcolor: "#2563eb" },
                                          }}
                                        >
                                          <SendIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                    {interview.status !== "Đã hoàn thành" && (
                                      <Tooltip title="Chỉnh sửa lịch phỏng vấn">
                                        <IconButton
                                          size="small"
                                          onClick={() =>
                                            onOpenDialog("edit", selectedApplicantDetail, job, round.id, interview)
                                          }
                                          sx={{
                                            bgcolor: "#f59e0b",
                                            color: "white",
                                            "&:hover": { bgcolor: "#d97706" },
                                          }}
                                        >
                                          <EditIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                    {interview.status !== "Đã hoàn thành" && (
                                      <Tooltip title="Xóa lịch phỏng vấn">
                                        <IconButton
                                          size="small"
                                          onClick={() => onDeleteInterview(interview.id)}
                                          sx={{
                                            bgcolor: "#ef4444",
                                            color: "white",
                                            "&:hover": { bgcolor: "#dc2626" },
                                          }}
                                        >
                                          <DeleteIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                    {interview.status === "Đã xác nhận" ||
                                    (interview.status === "Đã hoàn thành" && !interview.evaluation) ? (
                                      <Button
                                        size="small"
                                        variant="contained"
                                        onClick={() =>
                                          onOpenDialog("evaluate", selectedApplicantDetail, job, round._id, interview)
                                        }
                                        startIcon={<AssessmentIcon />}
                                        sx={{
                                          bgcolor: "#10b981",
                                          "&:hover": { bgcolor: "#059669" },
                                          borderRadius: 2,
                                          textTransform: "none",
                                          fontWeight: 600,
                                        }}
                                      >
                                        Đánh giá
                                      </Button>
                                    ) : (
                                      interview.status === "Đã hoàn thành" &&
                                      interview.evaluation && (
                                        <Button
                                          size="small"
                                          variant="outlined"
                                          onClick={() =>
                                          {
                                            console.log(round)
                                            onOpenDialog("evaluate", selectedApplicantDetail, job, round._id, interview)
                                          }
                                          }
                                          startIcon={<AssessmentIcon />}
                                          sx={{
                                            borderColor: "#10b981",
                                            color: "#10b981",
                                            "&:hover": {
                                              bgcolor: "#f0fdf4",
                                              borderColor: "#059669",
                                            },
                                            borderRadius: 2,
                                            textTransform: "none",
                                            fontWeight: 600,
                                          }}
                                        >
                                          Xem/Sửa Đánh giá
                                        </Button>
                                      )
                                    )}
                                  </Stack>
                                )}
                              </Box>
                            </CardContent>
                          </Card>
                        )
                      })}
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default JobDetailView
