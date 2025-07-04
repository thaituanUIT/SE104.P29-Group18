"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Button,
  MenuItem,
  TextField,
  Select,
  InputLabel,
  FormControl,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Chip,
  Card,
  CardContent,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import IconButton from "@mui/material/IconButton"
import AddIcon from "@mui/icons-material/Add"
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined"
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined"
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined"
import CreateJobModal from "./createJobModal"
import { useDispatch, useSelector } from "react-redux"
import { selectCurrentEmployer } from "~/redux/employer/employerSlice"
import { getJobsByEmployerIdAPI, selectCurrentJobs } from "~/redux/job/jobSlice"
import { formatDate } from "~/utils/formatter"

const JobPost = () => {
  const [searchTitle, setSearchTitle] = useState("")
  const [postStatus, setPostStatus] = useState("")
  const [approvalStatus, setApprovalStatus] = useState("")
  const [openModal, setOpenModal] = useState(false)

  const dispatch = useDispatch()
  const employerId = useSelector(selectCurrentEmployer)._id
  const currentJobs = useSelector(selectCurrentJobs)

  console.log(employerId)
  useEffect(() => {
    if (employerId) {
      dispatch(getJobsByEmployerIdAPI(employerId))
    }
  }, [employerId, dispatch])

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
        p: 3,
      }}
    >
      <Card
        elevation={8}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              Quản lý tin tuyển dụng
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Tạo và quản lý các tin tuyển dụng của công ty
            </Typography>
          </Box>

          {/* Search and Filter Section */}
          <Paper
            elevation={2}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 2,
              background: "linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)",
              border: "1px solid rgba(148, 163, 184, 0.1)",
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nhập tên tin đăng"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "white",
                      "&:hover fieldset": {
                        borderColor: "#667eea",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#667eea",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Trạng thái tuyển dụng</InputLabel>
                  <Select
                    value={postStatus}
                    label="Trạng thái tuyển dụng"
                    onChange={(e) => setPostStatus(e.target.value)}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: "white",
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#667eea",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#667eea",
                      },
                    }}
                  >
                    <MenuItem value="tất cả">Tất cả</MenuItem>
                    <MenuItem value="đang tuyển">Đang tuyển</MenuItem>
                    <MenuItem value="đã đóng">Đã đóng</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<SearchIcon />}
                  sx={{
                    height: 56,
                    borderRadius: 2,
                    background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                    boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #5a67d8 30%, #6b46c1 90%)",
                      boxShadow: "0 6px 25px rgba(102, 126, 234, 0.6)",
                    },
                  }}
                >
                  Tìm kiếm
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 3 }}>
            {/* <Button
              variant="outlined"
              startIcon={<DownloadOutlinedIcon />}
              sx={{
                borderRadius: 2,
                borderColor: "#10b981",
                color: "#10b981",
                px: 3,
                py: 1.5,
                "&:hover": {
                  borderColor: "#059669",
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                },
              }}
            >
              TẢI DANH SÁCH
            </Button> */}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenModal(true)}
              sx={{
                borderRadius: 2,
                background: "linear-gradient(45deg, #10b981 30%, #059669 90%)",
                boxShadow: "0 4px 20px rgba(16, 185, 129, 0.4)",
                px: 3,
                py: 1.5,
                "&:hover": {
                  background: "linear-gradient(45deg, #059669 30%, #047857 90%)",
                  boxShadow: "0 6px 25px rgba(16, 185, 129, 0.6)",
                },
              }}
            >
              TẠO TIN MỚI
            </Button>
          </Box>

          <CreateJobModal open={openModal} onClose={() => setOpenModal(false)} />

          {/* Table Section */}
          <Paper
            elevation={3}
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid rgba(148, 163, 184, 0.1)",
            }}
          >
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader aria-label="job posts table">
                <TableHead>
                  <TableRow>
                    {[
                      { label: "Tên tin đăng", icon: "📝" },
                      { label: "Ngày đăng", icon: "📅" },
                      { label: "Thời hạn nộp", icon: "⏰" },
                      { label: "Vị trí", icon: "💼" },
                      { label: "Phòng ban", icon: "🏢" },
                      { label: "Lượt nộp", icon: "📊" },
                      { label: "Trạng thái", icon: "🔄" },
                    ].map((header, index) => (
                      <TableCell
                        key={header.label}
                        sx={{
                          backgroundColor: "#475569",
                          color: "white",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          py: 2.5,
                          px: 2,
                          borderBottom: "3px solid #3b82f6",
                          position: "relative",
                          textAlign: "center",
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "2px",
                            background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)",
                          },
                          "&:hover": {
                            backgroundColor: "#64748b",
                            transform: "translateY(-1px)",
                            transition: "all 0.3s ease",
                          },
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                          <Typography component="span" sx={{ fontSize: "1rem" }}>
                            {header.icon}
                          </Typography>
                          <Typography
                            component="span"
                            sx={{
                              fontWeight: 600,
                              letterSpacing: "0.5px",
                              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                            }}
                          >
                            {header.label}
                          </Typography>
                        </Box>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentJobs?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <img
                            src="https://res.cloudinary.com/sonpham811205/image/upload/v1745043588/no_data_found_rspjz5.jpg"
                            alt="Empty"
                            style={{ height: 120, marginBottom: 16, opacity: 0.7 }}
                          />
                          <Typography
                            variant="h6"
                            sx={{
                              color: "text.secondary",
                              fontWeight: 500,
                            }}
                          >
                            Bạn chưa có tin tuyển dụng nào
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.disabled",
                              mt: 1,
                            }}
                          >
                            Hãy tạo tin tuyển dụng đầu tiên của bạn
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentJobs?.map((post, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:nth-of-type(odd)": {
                            backgroundColor: "rgba(248, 250, 252, 0.5)",
                          },
                          "&:hover": {
                            backgroundColor: "rgba(102, 126, 234, 0.05)",
                            transform: "scale(1.001)",
                            transition: "all 0.2s ease-in-out",
                          },
                        }}
                      >
                        <TableCell sx={{ py: 2 }}>
                          <Typography variant="body2" fontWeight={600} color="primary">
                            {post.title}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(post.createdAt)}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(post.deadline)}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Typography variant="body2" fontWeight={500}>
                            {post.position}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Typography variant="body2">{post.department}</Typography>
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Chip
                            label={post.applicantsCount || 0}
                            size="small"
                            sx={{
                              backgroundColor: "rgba(59, 130, 246, 0.1)",
                              color: "#3b82f6",
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Chip
                            label={post.status || "Đang tuyển"}
                            size="small"
                            sx={{
                              backgroundColor:
                                post.status === "Đang tuyển" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                              color: post.status === "Đang tuyển" ? "#10b981" : "#ef4444",
                              fontWeight: 600,
                              borderRadius: 2,
                            }}
                          />
                        </TableCell>
                    
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </CardContent>
      </Card>
    </Box>
  )
}

export default JobPost
