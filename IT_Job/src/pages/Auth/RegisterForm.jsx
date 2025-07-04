"use client"

import { Link } from "react-router-dom"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { Card as MuiCard } from "@mui/material"
import TextField from "@mui/material/TextField"
import Zoom from "@mui/material/Zoom"
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
  PASSWORD_CONFIRMATION_MESSAGE
} from "~/utils/validators"
import { useForm, Controller } from "react-hook-form"
import FieldErrorAlert from "~/components/form/FieldErrorAlert"
import { useNavigate } from "react-router-dom"
import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import Grid from "@mui/material/Grid"
import { useState, useEffect } from "react"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import { employerRegisterAPI } from "../../apis"
import FormHelperText from "@mui/material/FormHelperText"
import { toast } from 'react-toastify'



const countryList = [
  "Vietnam",
  "Japan",
  "United States",
  "France",
  "Germany",
  "Thailand",
  "South Korea",
  "China",
  "India",
  "Canada",
  "Australia",
]

  const CountrySelect = ({ register, errors, control }) => {
  const [countries] = useState(countryList)

  return (
    <FormControl fullWidth size="small" error={!!errors.companyCountry}>
      <InputLabel id="country-select-label">Company Country</InputLabel>
      <Controller
        name="companyCountry"
        control={control}
        defaultValue=""
        rules={{ required: FIELD_REQUIRED_MESSAGE }}
        render={({ field }) => (
          <Select
            labelId="country-select-label"
            id="country-select"
            label="Company Country"
            {...field}
          >
            <MenuItem key="placeholder" value="" disabled>
              Select a country
            </MenuItem>
            {countries.map((country) => (
              <MenuItem key={country} value={country}>
                {country}
              </MenuItem>
            ))}
          </Select>
        )}
      />
      {errors.companyCountry && (
        <FormHelperText>{errors.companyCountry.message}</FormHelperText>
      )}
    </FormControl>
  )
}


const LocationSelect = ({ control, errors }) => {
  const locations = ["Hồ Chi Minh", "Hà Nội", "Đà Nẵng", "Others"]

  return (
    <FormControl fullWidth size="small" error={!!errors.companyLocation}>
      <InputLabel id="location-select-label">Company Location</InputLabel>
      <Controller
        name="companyLocation"
        control={control}
        defaultValue=""
        rules={{ required: FIELD_REQUIRED_MESSAGE }}
        render={({ field }) => (
          <Select labelId="location-select-label" id="location-select" label="Company Location" {...field}>
            <MenuItem value="" disabled>
              Select a location type
            </MenuItem>
            {locations.map((location) => (
              <MenuItem key={location} value={location}>
                {location}
              </MenuItem>
            ))}
          </Select>
        )}
      />
      {errors.companyLocation && <FormHelperText>{errors.companyLocation.message}</FormHelperText>}
    </FormControl>
  )
}

function RegisterForm() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm()
  const navigate = useNavigate()
const [bannerImage, setBannerImage] = useState("https://res.cloudinary.com/sonpham811205/image/upload/v1745163166/Blue_and_White_Photo-centric_Job_Poster_hwheht.png") // Default image
 
  const [termsAccepted, setTermsAccepted] = useState(false) // State to track terms acceptance

  const submitRegister = (data) => {
    // Create FormData object for backend submission
    const formData = new FormData()

    // Add all form fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })

    // Log the form data for debugging
    console.log("Form data to be submitted:", data)
    const { confirmPassword: confirm, ...registerData } = data
    
    console.log('heheh',registerData) // { email: "abc@gmail.com", password: "123456" }
    
    toast.promise(
      employerRegisterAPI(registerData),
      {
        pending: 'Registering account...'
      }
    ).then(employer => {
      navigate(`/employer/login?registeredEmail=${employer.email}`)
    })

  }



  return (
    <form onSubmit={handleSubmit(submitRegister)}>
      <Zoom in={true} style={{ transitionDelay: "200ms" }}>
        <MuiCard
          sx={{
            width: "900px",
            display: "flex",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Left side - Image section */}
          <Box
            sx={{
              width: "40%",
              display: "flex",
              position: "relative",
              backgroundImage: `url(${bannerImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Image upload option */}
           
          </Box>

          {/* Right side - Form */}
          <Box
            sx={{
              width: "60%",
              padding: "30px 40px",
              backgroundColor: "white",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" color="error" fontWeight="bold" sx={{ mr: 1 }}>
                IT_
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                Jobs
              </Typography>
            </Box>

            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Welcome to Employer Site
            </Typography>

            <Box sx={{ mb: 3 }}>

              <TextField
                fullWidth
                label="Email"
                type="text"
                variant="outlined"
                size="small"
                margin="normal"
                error={!!errors.email}
                {...register("email", {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: EMAIL_RULE,
                    message: EMAIL_RULE_MESSAGE,
                  },
                })}
              />
              <FieldErrorAlert errors={errors} fieldName="email" />

              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                size="small"
                margin="normal"
                error={!!errors.password}
                {...register("password", {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE,
                  },
                })}
              />
              <FieldErrorAlert errors={errors} fieldName="password" />

              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                variant="outlined"
                size="small"
                margin="normal"
                error={!!errors.confirmPassword}
                {...register("confirmPassword", {
                  required: FIELD_REQUIRED_MESSAGE,
                  validate: (value) => value === watch('password') || PASSWORD_CONFIRMATION_MESSAGE
                  
                })}
              />
              <FieldErrorAlert errors={errors} fieldName="confirmPassword" />
            </Box>

            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
              Company representative information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  size="small"
                  error={!!errors.fullName}
                  {...register("fullName", {
                    required: FIELD_REQUIRED_MESSAGE,
                  })}
                />
                <FieldErrorAlert errors={errors} fieldName="fullName" />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Position"
                  variant="outlined"
                  size="small"
                  error={!!errors.position}
                  {...register("position", {
                    required: FIELD_REQUIRED_MESSAGE,
                  })}
                />
                <FieldErrorAlert errors={errors} fieldName="position" />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Work Email"
                  variant="outlined"
                  size="small"
                  error={!!errors.workEmail}
                  {...register("workEmail", {
                    required: FIELD_REQUIRED_MESSAGE,
                    pattern: {
                      value: EMAIL_RULE,
                      message: EMAIL_RULE_MESSAGE,
                    },
                  })}
                />
                <FieldErrorAlert errors={errors} fieldName="workEmail" />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  variant="outlined"
                  size="small"
                  error={!!errors.phoneNumber}
                  {...register("phoneNumber", {
                    required: FIELD_REQUIRED_MESSAGE,
                  })}
                />
                <FieldErrorAlert errors={errors} fieldName="phoneNumber" />
              </Grid>
            </Grid>

            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
              Company Info
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  variant="outlined"
                  size="small"
                  error={!!errors.companyName}
                  {...register("companyName", {
                    required: FIELD_REQUIRED_MESSAGE,
                  })}
                />
                <FieldErrorAlert errors={errors} fieldName="companyName" />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Company URL"
                  variant="outlined"
                  size="small"
                  error={!!errors.companyURL}
                  {...register("companyURL", {
                    required: FIELD_REQUIRED_MESSAGE,
                  })}
                />
                <FieldErrorAlert errors={errors} fieldName="companyURL" />
              </Grid>
              <Grid item xs={6}>
                <CountrySelect register={register} control={control} errors={errors} />
                <FieldErrorAlert errors={errors} fieldName="companyCountry" />
              </Grid>
              <Grid item xs={6}>
                <LocationSelect control={control} errors={errors} />
                <FieldErrorAlert errors={errors} fieldName="companyLocation" />
              </Grid>
            </Grid>

          
            <FormControlLabel
              control={
                <Checkbox size="small" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
              }
              label={
                <Typography variant="caption">
                  I have read and agree to IT Jobs's{" "}
                  <Link style={{ color: "#0052cc", textDecoration: "none" }}>Terms & Conditions</Link> and{" "}
                  <Link style={{ color: "#0052cc", textDecoration: "none" }}>Privacy Policy</Link> in relation to my
                  personal information.
                </Typography>
              }
              sx={{ mt: 2, mb: 2 }}
            />

            <Button
              className="interceptor-loading"
              type="submit"
              variant="contained"
              color="primary"
              size="medium"
              fullWidth
              disabled={!termsAccepted}
              sx={{
                textTransform: "none",
                opacity: termsAccepted ? 1 : 0.7,
                cursor: termsAccepted ? "pointer" : "not-allowed",
              }}
            >
              Register
            </Button>

            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="caption">
                Already have an account?{" "}
                <Link to="/employer/login" style={{ color: "#0052cc", textDecoration: "none" }}>
                  Log in
                </Link>
              </Typography>
            </Box>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  )
}

export default RegisterForm
