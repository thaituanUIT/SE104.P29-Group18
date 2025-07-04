"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  FormControlLabel,
  Checkbox,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Paper,
  Divider,
  Tooltip,
  CircularProgress,
  Alert
} from "@mui/material"
import {
  Close as CloseIcon,
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
  FormatUnderlined as FormatUnderlinedIcon,
  FormatListBulleted as FormatListBulletedIcon,
  LightbulbOutlined as LightbulbOutlinedIcon,
} from "@mui/icons-material"

const months = [
  "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 50 }, (_, i) => currentYear - i)

const WorkExperienceModal = ({ open, onClose, onSave, initialData }) => {
  const formDataDefault = {
    jobTitle: "",
    company: "",
    isCurrentlyWorking: false,
    fromMonth: "",
    fromYear: "",
    toMonth: "",
    toYear: "",
    description: "",
  }

  const [formData, setFormData] = useState(formDataDefault)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({
    jobTitle: false,
    company: false,
    fromMonth: false,
    fromYear: false,
    toMonth: false,
    toYear: false,
  })

  // Initialize form with data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        jobTitle: initialData.jobTitle || "",
        company: initialData.company || "",
        isCurrentlyWorking: initialData.isCurrentlyWorking || false,
        fromMonth: initialData.fromMonth || "",
        fromYear: initialData.fromYear || "",
        toMonth: initialData.toMonth || "",
        toYear: initialData.toYear || "",
        description: initialData.description || "",
      })
    } else {
      setFormData(formDataDefault)
    }
    setError(null)
  }, [initialData, open])

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    // Clear validation errors when field is filled
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: false,
      })
    }
  }

  const handleDescriptionChange = (e) => {
    setFormData({
      ...formData,
      description: e.target.value,
    })
  }

  const validate = () => {
    const newErrors = {
      jobTitle: !formData.jobTitle,
      company: !formData.company,
      fromMonth: !formData.fromMonth,
      fromYear: !formData.fromYear,
      toMonth: !formData.isCurrentlyWorking ? !formData.toMonth : false,
      toYear: !formData.isCurrentlyWorking ? !formData.toYear : false,
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  const handleSubmit = async () => {
    if (validate()) {
      setLoading(true)
      setError(null)
      
      try {
        
        // Call parent onSave function
        onSave(formData)
        onClose()
      } catch (err) {
        console.error("Error saving experience:", err)
        setError("Failed to save experience. Please try again.")
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
        <Typography variant="h6">{initialData ? "Edit Work Experience" : "Add Work Experience"}</Typography>
        <IconButton onClick={onClose} size="small" disabled={loading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="jobTitle"
            label="Job title"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            error={errors.jobTitle}
            helperText={errors.jobTitle ? "Job title is required" : ""}
            sx={{ mb: 2 }}
            disabled={loading}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="company"
            label="Company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            error={errors.company}
            helperText={errors.company ? "Company is required" : ""}
            sx={{ mb: 2 }}
            disabled={loading}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isCurrentlyWorking}
                onChange={handleChange}
                name="isCurrentlyWorking"
                color="primary"
                disabled={loading}
              />
            }
            label="I am currently working here"
            sx={{ mb: 2 }}
          />

           <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                From <span style={{ color: "red" }}>*</span>
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth error={errors.fromMonth} disabled={loading}>
                    <InputLabel id="from-month-label">Month</InputLabel>
                    <Select
                      labelId="from-month-label"
                      id="fromMonth"
                      name="fromMonth"
                      value={formData.fromMonth}
                      label="Month"
                      onChange={handleChange}
                    >
                      {months.map((month) => (
                        <MenuItem key={month} value={month}>
                          {month}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth error={errors.fromYear} disabled={loading}>
                    <InputLabel id="from-year-label">Year</InputLabel>
                    <Select
                      labelId="from-year-label"
                      id="fromYear"
                      name="fromYear"
                      value={formData.fromYear}
                      label="Year"
                      onChange={handleChange}
                    >
                      {years.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          
          
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                To <span style={{ color: "red" }}>*</span>
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth error={errors.toMonth} disabled={formData.isCurrentlyWorking || loading}>
                    <InputLabel id="to-month-label">Month</InputLabel>
                    <Select
                      labelId="to-month-label"
                      id="toMonth"
                      name="toMonth"
                      value={formData.isCurrentlyWorking ? "Present" : formData.toMonth}
                      label="Month"
                      onChange={handleChange}
                    >
                      {formData.isCurrentlyWorking ? (
                        <MenuItem value="Present">Present</MenuItem>
                      ) : (
                        months.map((month) => (
                          <MenuItem key={month} value={month}>
                            {month}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth error={errors.toYear} disabled={formData.isCurrentlyWorking || loading}>
                    <InputLabel id="to-year-label">Year</InputLabel>
                    <Select
                      labelId="to-year-label"
                      id="toYear"
                      name="toYear"
                      value={formData.isCurrentlyWorking ? "Present" : formData.toYear}
                      label="Year"
                      onChange={handleChange}
                    >
                      {formData.isCurrentlyWorking ? (
                        <MenuItem value="Present">Present</MenuItem>
                      ) : (
                        years.map((year) => (
                          <MenuItem key={year} value={year}>
                            {year}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          
          </Grid>
          

          <Box sx={{ mt: 3 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Description
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "#FFF8E1",
                p: 1,
                borderRadius: 1,
                mb: 2,
              }}
            >
              <LightbulbOutlinedIcon sx={{ color: "#FF9800", mr: 1 }} />
              <Typography variant="body2" sx={{ color: "#424242" }}>
                <strong>Tips:</strong> Brief the company's industry, then detail your responsibilities and achievements.
                For projects, write on the "Project" field below.
              </Typography>
            </Box>

            <TextField
              id="description"
              name="description"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Describe your role, responsibilities, and achievements..."
              disabled={loading}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="error" 
          sx={{ minWidth: 100 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default WorkExperienceModal