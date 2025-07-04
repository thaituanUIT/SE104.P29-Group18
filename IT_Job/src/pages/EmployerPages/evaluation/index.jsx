"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import WorkIcon from "@mui/icons-material/Work"
import SchoolIcon from "@mui/icons-material/School"
import StarIcon from "@mui/icons-material/Star"
import { PieChart } from "@mui/x-charts/PieChart"

// Tab Panel Component
function TabPanel({ children, value, index }) {
  return <div hidden={value !== index}>{value === index && <Box sx={{ pt: 2 }}>{children}</Box>}</div>
}

const statusColors = {
  Đạt: "success",
  "Không đạt": "error",
  "Đang đánh giá": "warning",
  "Chờ phỏng vấn": "info",
  "Chờ làm test": "default",
  "Đã hoàn thành": "success",
}

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#1976d2",
  },
})

const EvaluationDashboard = () => {
  const [tabValue, setTabValue] = useState(0)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      position: "Frontend Developer",
      status: "Đang đánh giá",
      interviews: [
        { round: 1, date: "15/05/2025", status: "Đã hoàn thành", result: "Đạt", score: 8 },
        { round: 2, date: "18/05/2025", status: "Chờ phỏng vấn", result: null, score: null },
      ],
      tests: [{ name: "React Coding Test", score: 85, maxScore: 100, status: "Đã hoàn thành", result: "Đạt" }],
      skills: [
        { name: "React", rating: 4 },
        { name: "JavaScript", rating: 4 },
        { name: "CSS", rating: 3 },
        { name: "TypeScript", rating: 3 },
      ],
      education: "Đại học Bách Khoa Hà Nội",
      experience: "3 năm",
      notes: "Ứng viên có kinh nghiệm tốt với React và các công nghệ frontend hiện đại.",
    },
    {
      id: 2,
      name: "Trần Thị B",
      position: "Backend Developer",
      status: "Đang đánh giá",
      interviews: [{ round: 1, date: "14/05/2025", status: "Đã hoàn thành", result: "Đạt", score: 7 }],
      tests: [{ name: "Node.js & Database Test", score: 78, maxScore: 100, status: "Đã hoàn thành", result: "Đạt" }],
      skills: [
        { name: "Node.js", rating: 4 },
        { name: "MongoDB", rating: 3 },
        { name: "Express", rating: 4 },
        { name: "SQL", rating: 3 },
      ],
      education: "Đại học Công nghệ - ĐHQGHN",
      experience: "2 năm",
      notes: "Ứng viên có kiến thức tốt về backend và database.",
    },
    {
      id: 3,
      name: "Lê Văn C",
      position: "UI/UX Designer",
      status: "Đạt",
      interviews: [
        { round: 1, date: "10/05/2025", status: "Đã hoàn thành", result: "Đạt", score: 9 },
        { round: 2, date: "13/05/2025", status: "Đã hoàn thành", result: "Đạt", score: 8 },
      ],
      tests: [{ name: "Design Challenge", score: 90, maxScore: 100, status: "Đã hoàn thành", result: "Đạt" }],
      skills: [
        { name: "Figma", rating: 5 },
        { name: "Adobe XD", rating: 4 },
        { name: "UI Design", rating: 5 },
        { name: "UX Research", rating: 4 },
      ],
      education: "Đại học FPT",
      experience: "4 năm",
      notes: "Ứng viên có portfolio ấn tượng và kỹ năng thiết kế xuất sắc.",
    },
    {
      id: 4,
      name: "Phạm Văn D",
      position: "DevOps Engineer",
      status: "Không đạt",
      interviews: [{ round: 1, date: "08/05/2025", status: "Đã hoàn thành", result: "Không đạt", score: 5 }],
      tests: [
        { name: "DevOps Technical Test", score: 60, maxScore: 100, status: "Đã hoàn thành", result: "Không đạt" },
      ],
      skills: [
        { name: "Docker", rating: 3 },
        { name: "Kubernetes", rating: 2 },
        { name: "CI/CD", rating: 3 },
        { name: "AWS", rating: 2 },
      ],
      education: "Đại học Khoa học Tự nhiên - ĐHQGHN",
      experience: "1 năm",
      notes: "Ứng viên còn thiếu kinh nghiệm thực tế với các công nghệ DevOps.",
    },
  ])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleOpenDialog = (candidate) => {
    setSelectedCandidate(candidate)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedCandidate(null)
  }

  const handleSaveEvaluation = (formData) => {
    const updatedCandidates = candidates.map((candidate) =>
      candidate.id === selectedCandidate.id ? { ...candidate, ...formData } : candidate,
    )
    setCandidates(updatedCandidates)
    handleCloseDialog()
  }

  // Calculate statistics for charts
  const positionStats = {}
  const statusStats = { Đạt: 0, "Không đạt": 0, "Đang đánh giá": 0 }

  candidates.forEach((candidate) => {
    // Position stats
    if (positionStats[candidate.position]) {
      positionStats[candidate.position]++
    } else {
      positionStats[candidate.position] = 1
    }

    // Status stats
    statusStats[candidate.status]++
  })

  const positionData = Object.keys(positionStats).map((position) => ({
    id: position,
    value: positionStats[position],
    label: position,
  }))

  const statusData = Object.keys(statusStats).map((status) => ({
    id: status,
    value: statusStats[status],
    label: status,
    color: status === "Đạt" ? "#4caf50" : status === "Không đạt" ? "#f44336" : "#ff9800",
  }))

  const testScores = candidates.flatMap((candidate) =>
    candidate.tests.map((test) => ({
      name: candidate.name,
      score: test.score,
      maxScore: test.maxScore,
    })),
  )

  return (
    <Box sx={{ p: 3, bgcolor: "white", boxShadow: 3, borderRadius: 1 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Bảng Đánh giá Ứng viên
      </Typography>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: "center", height: "100%" }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Tổng ứng viên
            </Typography>
            <Typography variant="h3">{candidates.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: "center", height: "100%" }}>
            <Typography variant="h6" color="success.main" gutterBottom>
              Đạt
            </Typography>
            <Typography variant="h3">{candidates.filter((c) => c.status === "Đạt").length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: "center", height: "100%" }}>
            <Typography variant="h6" color="error.main" gutterBottom>
              Không đạt
            </Typography>
            <Typography variant="h3">{candidates.filter((c) => c.status === "Không đạt").length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: "center", height: "100%" }}>
            <Typography variant="h6" color="warning.main" gutterBottom>
              Đang đánh giá
            </Typography>
            <Typography variant="h3">{candidates.filter((c) => c.status === "Đang đánh giá").length}</Typography>
          </Paper>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Phân bố theo vị trí
            </Typography>
            <Box sx={{ height: 300, display: "flex", justifyContent: "center" }}>
              <PieChart
                series={[
                  {
                    data: positionData,
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
                  },
                ]}
                height={300}
                width={400}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Kết quả đánh giá
            </Typography>
            <Box sx={{ height: 300, display: "flex", justifyContent: "center" }}>
              <PieChart
                series={[
                  {
                    data: statusData,
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
                  },
                ]}
                height={300}
                width={400}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Candidate List */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
              <Tab label="Tất cả ứng viên" />
              <Tab label="Đạt" />
              <Tab label="Không đạt" />
              <Tab label="Đang đánh giá" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <CandidateList candidates={candidates} onViewDetails={handleOpenDialog} />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <CandidateList
                candidates={candidates.filter((c) => c.status === "Đạt")}
                onViewDetails={handleOpenDialog}
              />
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <CandidateList
                candidates={candidates.filter((c) => c.status === "Không đạt")}
                onViewDetails={handleOpenDialog}
              />
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <CandidateList
                candidates={candidates.filter((c) => c.status === "Đang đánh giá")}
                onViewDetails={handleOpenDialog}
              />
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedCandidate && (
          <EvaluationForm candidate={selectedCandidate} onClose={handleCloseDialog} onSave={handleSaveEvaluation} />
        )}
      </Dialog>
    </Box>
  )
}

const CandidateList = ({ candidates, onViewDetails }) => {
  return (
    <Grid container spacing={2}>
      {candidates.length === 0 ? (
        <Grid item xs={12}>
          <Typography variant="body1" textAlign="center" py={3}>
            Không có ứng viên nào trong danh mục này
          </Typography>
        </Grid>
      ) : (
        candidates.map((candidate) => (
          <Grid item xs={12} md={6} lg={4} key={candidate.id}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="h6" component="div">
                    {candidate.name}
                  </Typography>
                  <Chip label={candidate.status} color={statusColors[candidate.status]} size="small" />
                </Box>
                <Typography color="text.secondary" gutterBottom>
                  {candidate.position}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <List dense>
                  <ListItem disablePadding>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <SchoolIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={candidate.education} />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <WorkIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={`Kinh nghiệm: ${candidate.experience}`} />
                  </ListItem>
                </List>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" component="div" gutterBottom>
                    Kỹ năng:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {candidate.skills.slice(0, 3).map((skill, index) => (
                      <Chip key={index} label={`${skill.name} (${skill.rating}/5)`} size="small" variant="outlined" />
                    ))}
                    {candidate.skills.length > 3 && (
                      <Chip label={`+${candidate.skills.length - 3}`} size="small" variant="outlined" />
                    )}
                  </Box>
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => onViewDetails(candidate)}>
                  Xem chi tiết
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  )
}

const EvaluationForm = ({ candidate, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    status: candidate.status,
    notes: candidate.notes,
    skills: [...candidate.skills],
  })

  const handleChange = (field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }))
  }

  const handleSkillChange = (index, field, value) => {
    const updatedSkills = [...formData.skills]
    updatedSkills[index][field] = value
    setFormData((prevState) => ({
      ...prevState,
      skills: updatedSkills,
    }))
  }

  const handleAddSkill = () => {
    setFormData((prevState) => ({
      ...prevState,
      skills: [...prevState.skills, { name: "", rating: 1 }],
    }))
  }

  const handleRemoveSkill = (index) => {
    const updatedSkills = [...formData.skills]
    updatedSkills.splice(index, 1)
    setFormData((prevState) => ({
      ...prevState,
      skills: updatedSkills,
    }))
  }

  const handleSubmit = () => {
    onSave(formData)
  }

  return (
    <>
      <DialogTitle>Đánh giá Ứng viên - {candidate.name}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="status-select-label">Trạng thái</InputLabel>
            <Select
              labelId="status-select-label"
              id="status-select"
              value={formData.status}
              label="Trạng thái"
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <MenuItem value="Đạt">Đạt</MenuItem>
              <MenuItem value="Không đạt">Không đạt</MenuItem>
              <MenuItem value="Đang đánh giá">Đang đánh giá</MenuItem>
              <MenuItem value="Chờ phỏng vấn">Chờ phỏng vấn</MenuItem>
              <MenuItem value="Chờ làm test">Chờ làm test</MenuItem>
              <MenuItem value="Đã hoàn thành">Đã hoàn thành</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="subtitle1">Kỹ năng:</Typography>
          {formData.skills.map((skill, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                label="Tên kỹ năng"
                value={skill.name}
                onChange={(e) => handleSkillChange(index, "name", e.target.value)}
                size="small"
                sx={{ width: "60%" }}
              />
              <StyledRating
                value={skill.rating}
                onChange={(e, newValue) => handleSkillChange(index, "rating", newValue)}
                icon={<StarIcon fontSize="inherit" />}
              />
              <Button onClick={() => handleRemoveSkill(index)} size="small" color="error">
                Xóa
              </Button>
            </Box>
          ))}
          <Button onClick={handleAddSkill} variant="outlined" size="small">
            Thêm kỹ năng
          </Button>

          <TextField
            label="Ghi chú"
            multiline
            rows={4}
            fullWidth
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained">
          Lưu
        </Button>
      </DialogActions>
    </>
  )
}

export default EvaluationDashboard
