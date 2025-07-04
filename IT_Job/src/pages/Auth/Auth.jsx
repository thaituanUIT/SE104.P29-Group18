import { useLocation } from "react-router-dom"
import Box from "@mui/material/Box"
import LoginForm from "./LoginForm"
import RegisterForm from "./RegisterForm"

function Auth() {
  const location = useLocation() // get current location
  // console.log(location)
  const isLogin = location.pathname === "/employer/login"
  const isRegister = location.pathname === "/employer/register"

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
    >
      {isLogin && <LoginForm />}
      {isRegister && <RegisterForm />}
    </Box>
  )
}

export default Auth
