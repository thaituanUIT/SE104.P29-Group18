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
  CircularProgress
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

const months = [
  "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 50 }, (_, i) => currentYear - i)

const EducationModal = ({ open, onClose, onSave, initialData }) => {
  const defaultFormData = {
    school: "",
    major: "",
    isCurrentlyStudying: false,
    fromMonth: "",
    fromYear: "",
    toMonth: "",
    toYear: "",
    additionalDetails: "",
  }
  
  const [formData, setFormData] = useState(defaultFormData)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({
    school: false,
    major: false,
    fromMonth: false,
    fromYear: false,
    toMonth: false,
    toYear: false,
  })

  // Initialize form with data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        school: initialData.school || "",
        major: initialData.major || "",
        isCurrentlyStudying: initialData.isCurrentlyStudying || false,
        fromMonth: initialData.fromMonth || "",
        fromYear: initialData.fromYear || "",
        toMonth: initialData.toMonth || "",
        toYear: initialData.toYear || "",
        additionalDetails: initialData.additionalDetails || "",
      })
    } else {
      setFormData(defaultFormData)
    }
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

  const validate = () => {
    const newErrors = {
      school: !formData.school,
      major: !formData.major,
      fromMonth: !formData.fromMonth,
      fromYear: !formData.fromYear,
      toMonth: !formData.isCurrentlyStudying ? !formData.toMonth : false,
      toYear: !formData.isCurrentlyStudying ? !formData.toYear : false,
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  const handleSubmit = async () => {
    if (validate()) {
      setLoading(true)
      try {
        await onSave(formData)
        onClose()
      } catch (error) {
        console.error("Error saving education:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
        <Typography variant="h6">{initialData ? "Edit Education" : "Add Education"}</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="school"
            label="School"
            name="school"
            value={formData.school}
            onChange={handleChange}
            error={errors.school}
            helperText={errors.school ? "School is required" : ""}
            sx={{ mb: 2 }}
            disabled={loading}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="major"
            label="Major"
            name="major"
            value={formData.major}
            onChange={handleChange}
            error={errors.major}
            helperText={errors.major ? "Major is required" : ""}
            sx={{ mb: 2 }}
            disabled={loading}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isCurrentlyStudying}
                onChange={handleChange}
                name="isCurrentlyStudying"
                color="primary"
                disabled={loading}
              />
            }
            label="I am currently studying here"
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
                <FormControl fullWidth error={errors.toMonth} disabled={formData.isCurrentlyStudying || loading}>
                  <InputLabel id="to-month-label">Month</InputLabel>
                  <Select
                    labelId="to-month-label"
                    id="toMonth"
                    name="toMonth"
                    value={formData.isCurrentlyStudying ? "Present" : formData.toMonth}
                    label="Month"
                    onChange={handleChange}
                  >
                    {formData.isCurrentlyStudying ? (
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
                <FormControl fullWidth error={errors.toYear} disabled={formData.isCurrentlyStudying || loading}>
                  <InputLabel id="to-year-label">Year</InputLabel>
                  <Select
                    labelId="to-year-label"
                    id="toYear"
                    name="toYear"
                    value={formData.isCurrentlyStudying ? "Present" : formData.toYear}
                    label="Year"
                    onChange={handleChange}
                  >
                    {formData.isCurrentlyStudying ? (
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

          <TextField
            margin="normal"
            fullWidth
            id="additionalDetails"
            label="Additional details"
            name="additionalDetails"
            value={formData.additionalDetails}
            onChange={handleChange}
            multiline
            rows={2}
            sx={{ mt: 3 }}
            disabled={loading}
          />
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

export default EducationModal