"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Avatar,
  Paper,
  IconButton,
  CircularProgress,
} from "@mui/material"
import {
  LocationOn as LocationOnIcon,
  AttachMoney as MoneyIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material"
import { getJobByIdAPI } from "~/apis/index" // Import API từ index.js
import { formatText } from "~/utils/formatter"
import { sanitizeHTML } from "~/utils/formatter"

const JobDetailPanel = ({ job: initialJob }) => {
  const [job, setJob] = useState(initialJob)
  const [loading, setLoading] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const navigate = useNavigate()

  // Fetch job details if job is selected with only _id (optional enhancement)
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (initialJob && (initialJob._id || initialJob.id) && !initialJob.jobDescription) {
        setLoading(true)
        try {
          const fetchedJob = await getJobByIdAPI(initialJob._id || initialJob.id)
          setJob(fetchedJob) // Cập nhật job với dữ liệu chi tiết từ API
        } catch (error) {
          console.error("Error fetching job details:", error)
        } finally {
          setLoading(false)
        }
      } else {
        setJob(initialJob)
      }
    }
    fetchJobDetails()
  }, [initialJob])

  // Format salary display
  const formatSalary = (salary) => {
    return salary ? `${salary.min} - ${salary.max} ${salary.currency || "USD"}` : "Negotiable"
  }

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const handleOpenJobDetail = () => {
    // Navigate to job detail page with query parameters
    navigate(`/jobDetail?jobId=${job._id || job.id}&employerId=${job.employerId || 1}`)
  }

  const handleApplyJob = () => {
    // Logic apply job (tùy chỉnh với applyNewJob API)
    console.log("Apply for job:", job._id || job.id)
    // Navigate to apply job page with query parameters
    navigate(`/applyJob?jobId=${job._id || job.id}&employerId=${job.employerId || 1}`)
  }

  if (loading) {
    return (
      <Paper sx={{ height: "calc(100vh - 100px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Paper>
    )
  }

  if (!job) {
    return (
      <Paper sx={{ height: "calc(100vh - 100px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Chọn một công việc để xem chi tiết
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper sx={{ height: "calc(100vh)", overflow: "auto" }}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
            <Avatar src={job.logo} alt={job.companyName} sx={{ width: 80, height: 80, mr: 2 }} />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Typography variant="h5" fontWeight="bold">
                  {job.title}
                </Typography>
                <IconButton onClick={handleOpenJobDetail}>
                  <OpenInNewIcon />
                </IconButton>
              </Box>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                {job.companyName}
              </Typography>
              {job.acceptFresher && (
                <Typography variant="body2" sx={{ color: "#4caf50", fontWeight: "bold" }}>
                  👨‍🎓 Fresher Accepted
                </Typography>
              )}
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton onClick={handleToggleFavorite} color={isFavorite ? "error" : "default"}>
              {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <IconButton>
              <ShareIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Apply Button */}
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleApplyJob}
          sx={{
            backgroundColor: "#e53e3e",
            color: "white",
            py: 1.5,
            fontSize: "16px",
            fontWeight: "bold",
            mb: 3,
            "&:hover": {
              backgroundColor: "#c53030",
            },
          }}
        >
          Apply now
        </Button>

        {/* Job Info Cards */}
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <Card variant="outlined" sx={{ flex: 1, minWidth: 200 }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <MoneyIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" fontWeight="bold">
                  Mức lương
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: "#4caf50", fontWeight: "bold" }}>
                {formatSalary(job.salary)}
              </Typography>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ flex: 1, minWidth: 200 }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" fontWeight="bold">
                  Địa điểm
                </Typography>
              </Box>
              <Typography variant="body1">{job.location || "Remote"}</Typography>
              <Typography variant="body2" color="text.secondary">
                {formatText(job.workplace)}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Job description */}
        {job.jobDescription && (
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Job description
              </Typography>
               <Typography
                              variant="body2"
                              mt={1}
                              sx={{ whiteSpace: "pre-line" }}
                              dangerouslySetInnerHTML={{ __html: sanitizeHTML(job.jobDescription) }}
                              />
            </CardContent>
          </Card>
        )}

        {/* Requirements */}
        {job.jobRequirement && (
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Your skills and experience
              </Typography>
              <Typography
                variant="body2"
                mt={1}
                sx={{ whiteSpace: "pre-line" }}
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(job.jobRequirement) }}
                />
            </CardContent>
          </Card>
        )}

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Skills required
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {job.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    variant="outlined"
                    sx={{
                      borderColor: "#1976d2",
                      color: "#1976d2",
                      "&:hover": {
                        backgroundColor: "#1976d2",
                        color: "white",
                      },
                    }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Benefits */}
        {job.benefits && (
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Why you'll love working here
              </Typography>
              <Typography
                variant="body2"
                mt={1}
                sx={{ whiteSpace: "pre-line" }}
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(job.benefits) }}
                />
            </CardContent>
          </Card>
        )}

        {/* Job stats */}
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Job information
            </Typography>
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Posted
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "N/A"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Deadline
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {job.deadline ? new Date(job.deadline).toLocaleDateString() : "N/A"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Applicants
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {job.applicantsCount || 0}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Position
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {job.position || "N/A"}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Paper>
  )
}

export default JobDetailPanel