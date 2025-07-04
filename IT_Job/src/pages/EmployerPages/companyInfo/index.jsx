"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  Paper,
  Avatar,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { useSelector } from "react-redux"
import { selectCurrentEmployer } from "~/redux/employer/employerSlice"
import RichTextEditor from "~/components/RichTextEditor/RichTextEditor"
import { useDispatch } from "react-redux"
import { updateEmployerAPI } from "~/redux/employer/employerSlice"
import { toast } from "react-toastify"
import { singleFileValidator } from "~/utils/validators"
import { Business, Person, CloudUpload, Language, LocationOn, Phone, Email, Work } from "@mui/icons-material"

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
})

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
  border: "1px solid rgba(0, 0, 0, 0.05)",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
  },
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    backgroundColor: "#fafafa",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
    "&.Mui-focused": {
      backgroundColor: "#fff",
      boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.1)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#666",
    fontWeight: 500,
  },
}))

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: 12,
  backgroundColor: "#fafafa",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
  "&.Mui-focused": {
    backgroundColor: "#fff",
    boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.1)",
  },
}))

const UploadButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: "12px 24px",
  textTransform: "none",
  fontWeight: 600,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
  },
}))

const SectionHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 24,
  padding: "16px 0",
  borderBottom: "2px solid #f0f0f0",
}))

const ImageUploadCard = styled(Paper)(({ theme }) => ({
  padding: 20,
  borderRadius: 16,
  textAlign: "center",
  border: "2px dashed #e0e0e0",
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    borderColor: "#1976d2",
    backgroundColor: "#f8f9ff",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(25, 118, 210, 0.1)",
  },
}))

const CountrySelect = ({ value, onChange }) => {
  const [countries, setCountries] = useState([])

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => res.json())
      .then((data) => {
        const countryNames = data.map((c) => c.name.common).sort()
        setCountries(countryNames)
      })
      .catch((err) => console.error("Failed to load countries:", err))
  }, [])

  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel sx={{ color: "#666", fontWeight: 500 }}>Quốc gia</InputLabel>
      <StyledSelect value={value} label="Quốc gia" onChange={(e) => onChange(e.target.value)} sx={{ color: "black" }}>
        {countries.map((name) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </StyledSelect>
    </FormControl>
  )
}

function TabPanel({ children, value, index }) {
  return <div hidden={value !== index}>{value === index && <Box sx={{ mt: 3 }}>{children}</Box>}</div>
}

const JobPostingForm = () => {
  const currentEmployer = useSelector(selectCurrentEmployer)
  const [tabIndex, setTabIndex] = useState(0)
  const [form, setForm] = useState({
    companyName: "",
    companySize: "",
    industry: "",
    companyURL: "",
    linkedin: "",
    fullName: "",
    phoneNumber: "",
    position: "",
    workEmail: "",
    companyLocation: "",
    companyCountry: "",
    companyAddress: "",
    companyDescription: "",
    workDaysStart: "",
    workDaysEnd: "",
    overtimeRequired: false,
    companyTitle: "",
  })

  useEffect(() => {
    if (currentEmployer) {
      setForm((prev) => ({
        ...prev,
        companyName: currentEmployer.companyName || "",
        fullName: currentEmployer.fullName || "",
        phoneNumber: currentEmployer.phoneNumber || "",
        position: currentEmployer.position || "",
        workEmail: currentEmployer.workEmail || "",
        companyLocation: currentEmployer.companyLocation || "",
        companyCountry: currentEmployer.companyCountry || "",
        companyURL: currentEmployer.companyURL || "",
        companySize: currentEmployer.companySize || "",
        industry: currentEmployer.industry || "",
        companyAddress: currentEmployer.companyAddress || "",
        linkedin: currentEmployer.linkedin || "",
        companyDescription: currentEmployer.companyDescription || "",
        workDaysStart: currentEmployer.workDaysStart || "",
        workDaysEnd: currentEmployer.workDaysEnd || "",
        overtimeRequired: currentEmployer.overtimeRequired || false,
        companyTitle: currentEmployer.companyTitle || "",
      }))
    }
  }, [currentEmployer])

  const dispatch = useDispatch()
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    toast
      .promise(dispatch(updateEmployerAPI(form)), {
        pending: "Đang cập nhật...",
      })
      .then((res) => {
        if (!res.error) {
          toast.success("Cập nhật thông tin công ty thành công!")
        }
      })
  }

  const uploadLogo = (e) => {
    console.log(e.target?.files[0])
    const error = singleFileValidator(e.target?.files[0])

    if (error) {
      toast.error(error)
    }

    const reqData = new FormData()
    reqData.append("logo", e.target?.files[0])
    console.log(reqData)

    for (const value of reqData.values()) console.log("value", value)

    toast
      .promise(dispatch(updateEmployerAPI(reqData)), {
        pending: "Đang tải lên...",
      })
      .then(() => {
        e.target.value = ""
      })
  }

  const uploadBackground = (e) => {
    console.log(e.target?.files[0])
    const error = singleFileValidator(e.target?.files[0])

    if (error) {
      toast.error(error)
    }

    const reqData = new FormData()
    reqData.append("background", e.target?.files[0])
    console.log(reqData)

    for (const value of reqData.values()) console.log("value", value)

    toast
      .promise(dispatch(updateEmployerAPI(reqData)), {
        pending: "Đang tải lên...",
      })
      .then(() => {
        e.target.value = ""
      })
  }

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        p: 3,
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
      }}
    >
      <StyledCard>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{  mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#1a1a1a",
                mb: 1,
                background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Thông tin công ty
            </Typography>

          </Box>

          <Tabs
            value={tabIndex}
            onChange={(e, newIndex) => setTabIndex(newIndex)}
            centered
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: "1.1rem",
                fontWeight: 600,
                minWidth: 200,
                py: 2,
              },
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: 2,
              },
            }}
          >
            <Tab label="Thông tin công ty" icon={<Business />} iconPosition="start" />
            <Tab label="Đa phương tiện" icon={<CloudUpload />} iconPosition="start" />
          </Tabs>

          {/* Tab 1: Thông tin công ty */}
          <TabPanel value={tabIndex} index={0}>
            {/* Image Upload Section - Redesigned */}
            <StyledCard sx={{ mb: 4 }}>
              <CardContent sx={{ p: 4 }}>
                <SectionHeader>
                  <CloudUpload color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                    Hình ảnh công ty
                  </Typography>
                </SectionHeader>

                <Grid container spacing={4}>
                  {/* Logo Upload */}
                  <Grid item xs={12} md={6}>
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        border: "2px dashed #e0e0e0",
                        textAlign: "center",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: "#1976d2",
                          backgroundColor: "#f8f9ff",
                        },
                      }}
                    >


                      <Box sx={{ mb: 3 }}>
                        <Avatar
                          src={currentEmployer?.logoURL || "/placeholder.svg"}
                          sx={{
                            width: 100,
                            height: 100,
                            mx: "auto",
                            border: "3px solid #fff",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                          }}
                        >
                          <Business sx={{ fontSize: 40, color: "#666" }} />
                        </Avatar>
                      </Box>

                      <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUpload />}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          px: 3,
                          py: 1,
                          background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                          "&:hover": {
                            background: "linear-gradient(45deg, #1565c0, #1976d2)",
                          },
                        }}
                      >
                        Thay đổi logo
                        <VisuallyHiddenInput type="file" onChange={uploadLogo} />
                      </Button>
                    </Paper>
                  </Grid>

                  {/* Background Upload */}
                  <Grid item xs={12} md={6}>
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        border: "2px dashed #e0e0e0",
                        textAlign: "center",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: "#1976d2",
                          backgroundColor: "#f8f9ff",
                        },
                      }}
                    >

                      <Box sx={{ mb: 3 }}>
                        <Box
                          component="img"
                          src={currentEmployer?.backgroundURL || "/placeholder.svg?height=80&width=160"}
                          alt="Ảnh bìa"
                          sx={{
                            width: 160,
                            height: 100,
                            objectFit: "cover",
                            borderRadius: 2,
                            border: "3px solid #fff",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            display: "block",
                            mx: "auto",
                          }}
                        />
                      </Box>


                      <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUpload />}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          px: 3,
                          py: 1,
                          background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                          "&:hover": {
                            background: "linear-gradient(45deg, #1565c0, #1976d2)",
                          },
                        }}
                      >
                        Thay đổi ảnh bìa
                        <VisuallyHiddenInput type="file" onChange={uploadBackground} />
                      </Button>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Upload Guidelines */}
             
              </CardContent>
            </StyledCard>

            {/* Company Information */}
            <StyledCard sx={{ mb: 4 }}>
              <CardContent>
                <SectionHeader>
                  <Business color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                    Thông tin công ty
                  </Typography>
                </SectionHeader>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <StyledTextField
                      label="Tên công ty *"
                      fullWidth
                      value={form.companyName}
                      onChange={(e) => handleChange("companyName", e.target.value)}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label="Khẩu hiệu công ty"
                      fullWidth
                      value={form.companyTitle}
                      onChange={(e) => handleChange("companyTitle", e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CountrySelect
                      value={form.companyCountry}
                      onChange={(val) => handleChange("companyCountry", val)}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: "#666", fontWeight: 500 }}>Ngày làm việc (bắt đầu)</InputLabel>
                      <StyledSelect
                        value={form.workDaysStart}
                        label="Ngày làm việc (bắt đầu)"
                        onChange={(e) => handleChange("workDaysStart", e.target.value)}
                      >
                        <MenuItem value="Monday">Thứ Hai</MenuItem>
                        <MenuItem value="Tuesday">Thứ Ba</MenuItem>
                        <MenuItem value="Wednesday">Thứ Tư</MenuItem>
                        <MenuItem value="Thursday">Thứ Năm</MenuItem>
                        <MenuItem value="Friday">Thứ Sáu</MenuItem>
                        <MenuItem value="Saturday">Thứ Bảy</MenuItem>
                        <MenuItem value="Sunday">Chủ Nhật</MenuItem>
                      </StyledSelect>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: "#666", fontWeight: 500 }}>Ngày làm việc (kết thúc)</InputLabel>
                      <StyledSelect
                        value={form.workDaysEnd}
                        label="Ngày làm việc (kết thúc)"
                        onChange={(e) => handleChange("workDaysEnd", e.target.value)}
                      >
                        <MenuItem value="Monday">Thứ Hai</MenuItem>
                        <MenuItem value="Tuesday">Thứ Ba</MenuItem>
                        <MenuItem value="Wednesday">Thứ Tư</MenuItem>
                        <MenuItem value="Thursday">Thứ Năm</MenuItem>
                        <MenuItem value="Friday">Thứ Sáu</MenuItem>
                        <MenuItem value="Saturday">Thứ Bảy</MenuItem>
                        <MenuItem value="Sunday">Chủ Nhật</MenuItem>
                      </StyledSelect>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: "#666", fontWeight: 500 }}>Quy mô công ty</InputLabel>
                      <StyledSelect
                        value={form.companySize}
                        label="Quy mô công ty (số nhân viên)"
                        onChange={(e) => handleChange("companySize", e.target.value)}
                      >
                        <MenuItem value="1-50">1-50 nhân viên</MenuItem>
                        <MenuItem value="50-100">50-100 nhân viên</MenuItem>
                        <MenuItem value="101-500">100-500 nhân viên</MenuItem>
                        <MenuItem value="501-1000">500-1000 nhân viên</MenuItem>
                        <MenuItem value="1000+">1000-2000 nhân viên</MenuItem>
                      </StyledSelect>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: "#666", fontWeight: 500 }}>Lĩnh vực hoạt động</InputLabel>
                      <StyledSelect
                        value={form.industry}
                        label="Lĩnh vực hoạt động"
                        onChange={(e) => handleChange("industry", e.target.value)}
                      >
                        <MenuItem value="IT Consultant">IT Consultant</MenuItem>
                        <MenuItem value="IT Production">IT Production</MenuItem>
                        <MenuItem value="E-commerce">E-commerce</MenuItem>
                        <MenuItem value="Fintech">Fintech</MenuItem>
                        <MenuItem value="Education">Education</MenuItem>
                        <MenuItem value="Healthcare">Healthcare</MenuItem>
                      </StyledSelect>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label="Website công ty"
                      fullWidth
                      value={form.companyURL}
                      onChange={(e) => handleChange("companyURL", e.target.value)}
                      InputProps={{
                        startAdornment: <Language sx={{ mr: 1, color: "#666" }} />,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label="LinkedIn"
                      fullWidth
                      value={form.linkedin}
                      onChange={(e) => handleChange("linkedin", e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label="Địa điểm công ty"
                      fullWidth
                      value={form.companyLocation}
                      onChange={(e) => handleChange("companyLocation", e.target.value)}
                      InputProps={{
                        startAdornment: <LocationOn sx={{ mr: 1, color: "#666" }} />,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label="Địa chỉ chi tiết"
                      fullWidth
                      value={form.companyAddress}
                      onChange={(e) => handleChange("companyAddress", e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={form.overtimeRequired}
                          onChange={(e) => handleChange("overtimeRequired", e.target.checked)}
                          sx={{
                            "&.Mui-checked": {
                              color: "#1976d2",
                            },
                          }}
                        />
                      }
                      label={<Typography sx={{ fontWeight: 500 }}>Yêu cầu làm thêm giờ (OT)</Typography>}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </StyledCard>

            {/* Representative Information */}
            <StyledCard sx={{ mb: 4 }}>
              <CardContent>
                <SectionHeader>
                  <Person color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                    Người đại diện
                  </Typography>
                </SectionHeader>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label="Người liên hệ"
                      fullWidth
                      value={form.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      InputProps={{
                        startAdornment: <Person sx={{ mr: 1, color: "#666" }} />,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label="Email công việc"
                      fullWidth
                      value={form.workEmail}
                      onChange={(e) => handleChange("workEmail", e.target.value)}
                      InputProps={{
                        startAdornment: <Email sx={{ mr: 1, color: "#666" }} />,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label="Vị trí công tác"
                      fullWidth
                      value={form.position}
                      onChange={(e) => handleChange("position", e.target.value)}
                      InputProps={{
                        startAdornment: <Work sx={{ mr: 1, color: "#666" }} />,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label="Số điện thoại"
                      fullWidth
                      value={form.phoneNumber}
                      onChange={(e) => handleChange("phoneNumber", e.target.value)}
                      InputProps={{
                        startAdornment: <Phone sx={{ mr: 1, color: "#666" }} />,
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </StyledCard>

            {/* Company Description */}
            <StyledCard sx={{ mb: 4 }}>
              <CardContent>
                <SectionHeader>
                  <Business color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                    Giới thiệu công ty
                  </Typography>
                </SectionHeader>

                <Box
                  sx={{
                    "& .ql-container": {
                      borderRadius: "12px",
                      border: "1px solid #e0e0e0",
                    },
                    "& .ql-toolbar": {
                      borderRadius: "12px 12px 0 0",
                      border: "1px solid #e0e0e0",
                      borderBottom: "none",
                    },
                  }}
                >
                  <RichTextEditor
                    value={form.companyDescription}
                    onChange={(value) => handleChange("companyDescription", value)}
                  />
                </Box>
              </CardContent>
            </StyledCard>

            {/* Save Button */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                sx={{
                  borderRadius: 3,
                  px: 6,
                  py: 2,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                  boxShadow: "0 8px 32px rgba(25, 118, 210, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #1565c0, #1976d2)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 40px rgba(25, 118, 210, 0.4)",
                  },
                }}
              >
                Lưu thông tin
              </Button>
            </Box>
          </TabPanel>

          {/* Tab 2: Multimedia */}
          <TabPanel value={tabIndex} index={1}>
            <StyledCard>
              <CardContent sx={{ textAlign: "center", py: 8 }}>
                <CloudUpload sx={{ fontSize: 80, color: "#ccc", mb: 2 }} />
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  Đa phương tiện
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Tính năng này sẽ được phát triển trong tương lai
                </Typography>
              </CardContent>
            </StyledCard>
          </TabPanel>
        </CardContent>
      </StyledCard>
    </Box>
  )
}

export default JobPostingForm
