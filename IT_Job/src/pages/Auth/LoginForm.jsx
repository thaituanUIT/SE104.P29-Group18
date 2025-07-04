"use client"

import { Link } from "react-router-dom"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { Card as MuiCard } from "@mui/material"
import TextField from "@mui/material/TextField"
import Zoom from "@mui/material/Zoom"
import Alert from "@mui/material/Alert"
import { useForm } from "react-hook-form"
import FieldErrorAlert from "~/components/form/FieldErrorAlert"
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
} from "~/utils/validators"
import { useSearchParams } from "react-router-dom"
import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import { toast } from "react-toastify";
import { loginEmployerAPI } from "~/redux/employer/employerSlice"
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function LoginForm() {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [searchParams] = useSearchParams()
  const verifiedEmail = searchParams.get("verifiedEmail")
  const registeredEmail = searchParams.get("registeredEmail")
  const submitLogIn = (data) => {
    const { email, password } = data
    
    toast.promise(dispatch(loginEmployerAPI({email, password})),
  {
    pending: 'Logging in...'
  }).then((res) => {
    if(!res.error)
      navigate('/employer')
  })
}

  return (
    <form onSubmit={handleSubmit(submitLogIn)}>
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
          {/* Left side - Blue section */}
          <Box
            sx={{
              width: "40%",
              backgroundColor: "#0052cc",
              color: "white",
              padding: "40px 20px",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              backgroundImage:
                "url(https://i.pinimg.com/736x/31/5e/a9/315ea97166fe5cc6407294dbe3cbe681.jpg)",
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "2.5rem", mb: 2 }}>
              Join our
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: "bold", fontSize: "5rem", lineHeight: 1 }}>
              team
            </Typography>

            <Box sx={{ mt: "auto", mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Exciting opportunities await! Join us today.
              </Typography>

              <Box
                sx={{
                  position: "absolute",
                  bottom: "20px",
                  left: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#ffa000" }}>
                  IT
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  Developer
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right side - Form */}
          <Box
            sx={{
              width: "60%",
              padding: "30px 40px",
              backgroundColor: "white",
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

            <Typography variant="subtitle1" >
              Welcome to Employer Site
            </Typography>

            <Box
              sx={{
                marginTop: "1em",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                padding: "0",
              }}
            >
              {verifiedEmail && (
                <Alert severity="success" sx={{ ".MuiAlert-message": { overflow: "hidden" }, mb: 2 }}>
                  Your email&nbsp;
                  <Typography variant="span" sx={{ fontWeight: "bold", "&:hover": { color: "#fdba26" } }}>
                    {verifiedEmail}
                  </Typography>
                  &nbsp;has been verified.
                  <br />
                  Now you can login to enjoy our services! Have a good day!
                </Alert>
              )}
              {registeredEmail && (
                <Alert severity="info" sx={{ ".MuiAlert-message": { overflow: "hidden" }, mb: 2 }}>
                  An email has been sent to&nbsp;
                  <Typography variant="span" sx={{ fontWeight: "bold", "&:hover": { color: "#fdba26" } }}>
                    {registeredEmail}
                  </Typography>
                  <br />
                  Please check and verify your account before logging in!
                </Alert>
              )}
            </Box>

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
            </Box>

            <Button
              className="interceptor-loading"
              type="submit"
              variant="contained"
              color="primary"
              size="medium"
              fullWidth
              sx={{ textTransform: "none", mb: 2 }}
            >
              Login
            </Button>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="caption">
                Don't have an account?{" "}
                <Link to="/employer/register" style={{ color: "#0052cc", textDecoration: "none" }}>
                  Create account
                </Link>
              </Typography>
            </Box>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  )
}

export default LoginForm
