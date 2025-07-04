"use client"

import { useMemo } from "react"
import { Box, Typography, Button, Card, CardContent, CardActions, Chip, Divider } from "@mui/material"
import PeopleIcon from "@mui/icons-material/People"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty"
import CancelIcon from "@mui/icons-material/Cancel"

const JobCard = ({ job, onClick, applicants }) => {
  const jobApplicants = useMemo(() => applicants.filter((a) => a.jobId === job.id), [applicants, job.id])
  const passedApplicants = useMemo(
    () => jobApplicants.filter((a) => a.currentOverallStatus === "Đạt").length,
    [jobApplicants],
  )
  const inProgressApplicants = useMemo(
    () => jobApplicants.filter((a) => ["Đang đánh giá", "Chờ phỏng vấn"].includes(a.currentOverallStatus)).length,
    [jobApplicants],
  )
  const failedApplicants = useMemo(
    () => jobApplicants.filter((a) => a.currentOverallStatus === "Không đạt").length,
    [jobApplicants],
  )

  const totalRounds = job.interviewRounds.length
  const avgProgress = useMemo(() => {
    if (jobApplicants.length === 0 || totalRounds === 0) return 0
    const sumProgress = jobApplicants.reduce((sum, applicant) => {
      const currentRoundOrder = job.interviewRounds.find((r) => r.id === applicant.currentRound)?.order || 0
      return sum + (currentRoundOrder / totalRounds) * 100
    }, 0)
    return sumProgress / jobApplicants.length
  }, [jobApplicants, totalRounds, job.interviewRounds])

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        border: "1px solid #e0e7ff",
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
          borderColor: "#6366f1",
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 700,
              color: "#1e293b",
              fontSize: "1.25rem",
              lineHeight: 1.3,
              flex: 1,
              mr: 2,
            }}
          >
            {job.title}
          </Typography>
          <Chip
            label={job.status}
            sx={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white",
              fontWeight: 600,
              fontSize: "0.75rem",
              height: 28,
              borderRadius: 2,
              "& .MuiChip-label": {
                px: 1.5,
              },
            }}
          />
        </Box>

        <Typography
          sx={{
            color: "#64748b",
            fontSize: "0.875rem",
            fontWeight: 500,
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            component="span"
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "#6366f1",
            }}
          />
          {job.department} • {job.locations}
        </Typography>

        <Divider sx={{ mb: 3, borderColor: "#e2e8f0" }} />

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
              border: "1px solid #e2e8f0",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <PeopleIcon sx={{ fontSize: 18, color: "#6366f1" }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#475569" }}>
                Tổng số
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
              {jobApplicants.length}
            </Typography>
          </Box>

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
              border: "1px solid #a7f3d0",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <CheckCircleIcon sx={{ fontSize: 18, color: "#059669" }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#065f46" }}>
                Đạt
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#065f46" }}>
              {passedApplicants}
            </Typography>
          </Box>

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
              border: "1px solid #fcd34d",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <HourglassEmptyIcon sx={{ fontSize: 18, color: "#d97706" }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#92400e" }}>
                Đang xử lý
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#92400e" }}>
              {inProgressApplicants}
            </Typography>
          </Box>

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
              border: "1px solid #f87171",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <CancelIcon sx={{ fontSize: 18, color: "#dc2626" }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#991b1b" }}>
                Không đạt
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#991b1b" }}>
              {failedApplicants}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end", p: 3, pt: 0 }}>
        <Button
          variant="contained"
          onClick={onClick}
          sx={{
            background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
            px: 3,
            py: 1,
            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
              boxShadow: "0 6px 20px rgba(99, 102, 241, 0.4)",
              transform: "translateY(-1px)",
            },
          }}
        >
          Xem chi tiết
        </Button>
      </CardActions>
    </Card>
  )
}

export default JobCard
