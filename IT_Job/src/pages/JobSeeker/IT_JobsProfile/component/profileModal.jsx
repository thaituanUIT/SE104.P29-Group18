import { useState, useEffect } from "react"
import {
  Box,
  Avatar,
  Typography,
  Grid,
  IconButton,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material"
import {
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  MailOutline as MailOutlineIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  Wc as WcIcon,
  LocationOn as LocationOnIcon,
  Link as LinkIcon,
} from "@mui/icons-material"
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const ProfileModal = ({ open, onClose, userData, onSave }) => {
  // State for form data
  const [formData, setFormData] = useState({ ...userData })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  // Update form data when userData changes
  useEffect(() => {
    setFormData({ ...userData })
    setImagePreview(userData.avatar)
    setError(null)
  }, [userData, open])

  // Handle form input changes
  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle date change
  const handleDateChange = (e) => {
    setFormData({
      ...formData,
      dob: e.target.value, // ví dụ: '2000-01-01'
    });
  };
  
  // Handle image upload
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }
  
  // Handle image delete
  const handleImageDelete = () => {
    setImageFile(null)
    setImagePreview(null)
    setFormData({
      ...formData,
      avatar: '',
    })
  }

  // Handle form submission
  const handleSave = async () => {
    setLoading(true)
    setError(null)
    
    try {
      onSave(formData)
    } catch (err) {
      console.error("Error saving profile:", err)
      setError("Failed to save profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  
  const avatarWidth = 250 // Width of avatar + some margin

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
        <Typography variant="h6">Personal details</Typography>
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
        
        <Box sx={{ display: "flex", position: "relative", mb: 3 }}>
          {/* Avatar section - fixed position on the left */}
          <Box
            sx={{
              width: avatarWidth,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "absolute",
              left: 0,
              top: 0,
            }}
          >
            <Avatar src={imagePreview || formData.picture} sx={{ width: 100, height: 100, mb: 1.5, mt: 2.5 }} />
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button 
                component="label" 
                size="small" 
                startIcon={<CameraAltOutlinedIcon />} 
                sx={{ color: "error.main" }}
                disabled={loading}
              >
                Edit
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              <Button 
                size="small" 
                startIcon={<DeleteOutlineOutlinedIcon />} 
                sx={{color: 'black'}}
                onClick={handleImageDelete}
                disabled={loading || (!imagePreview && !formData.avatar)}
              >
                Delete
              </Button>
            </Box>
          </Box>

          {/* Form fields - all aligned with the same left margin */}
          <Box sx={{ width: "100%", pl: `${avatarWidth}px` }}>
            <Grid container spacing={2.2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Full name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Title"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutlineIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Phone number"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date of Birth"
                  type="date"
                  fullWidth
                  required
                  value={formData.dob || ""}
                  onChange={handleDateChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CakeIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth disabled={loading}>
                  <InputLabel required>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={formData.gender || ""}
                    onChange={handleChange}
                    label="Gender"
                    startAdornment={
                      <InputAdornment position="start">
                        <WcIcon fontSize="small" />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth disabled={loading}>
                  <InputLabel required>Current province/city</InputLabel>
                  <Select
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                    label="Current province/city"
                    startAdornment={
                      <InputAdornment position="start">
                        <LocationOnIcon fontSize="small" />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="Hanoi, Vietnam">Hanoi, Vietnam</MenuItem>
                    <MenuItem value="Ho Chi Minh City, Vietnam">Ho Chi Minh City, Vietnam</MenuItem>
                    <MenuItem value="Da Nang, Vietnam">Da Nang, Vietnam</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Address (Street, district,...)"
                  name="addressDetail"
                  placeholder="Enter your detailed address"
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Personal link (LinkedIn, portfolio,...)"
                  name="personalLink"
                  value={formData.personalLink || ""}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  disabled={loading}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
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

export default ProfileModal