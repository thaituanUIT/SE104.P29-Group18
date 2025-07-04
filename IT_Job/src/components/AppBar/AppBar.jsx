import Box from "@mui/material/Box";
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { ReactComponent as Logo } from "~/assets/logo.svg";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import AllJobs from "~/components/AppBar/Menus/AllJobs";
import ItCompany from "./Menus/ItCompany";
import AboutUs from "./Menus/AboutUs";
import { useAuth0 } from "@auth0/auth0-react";
import Profile  from '~/components/AppBar/Menus/Profile'
import Notifications  from '~/components/AppBar/Menus/Notifications'
import { useEffect } from "react";
import { useDispatch } from 'react-redux';
import {  Button,  Divider} from "@mui/material";
import { setUser } from "~/redux/user/userSlice";
import { useNavigate } from "react-router-dom";


function AppBar() {
  const navigate = useNavigate()
  const { loginWithRedirect, isAuthenticated, isLoading, user } = useAuth0()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(
      setUser({
        user: user || null,
        isAuthenticated,
        isLoading,
      })
    );
  }, [user, isAuthenticated, isLoading, dispatch]);
  return (
    <Box
      sx={{
        width: "100%",
        height: (theme) => theme.trello.appBarHeight,
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        justifyContent: "space-between",
        boxSizing: "border-box",
        gap: 5,
        overflowX: "auto",
        backgroundImage: "linear-gradient(to right, #1f1e1e 55%, #911625 100%)",
      }}
    >
      {/* Left Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box onClick={() => navigate('/')} sx={{ display: "flex", alignItems: "center", gap: 0.1, textDecoration: 'none', cursor: 'pointer' }} >
          <SvgIcon
            sx={{ color: "text.primary", fontSize: 90,  }}
            component={Logo}
            inheritViewBox
          />
          <Typography
            variant="h6"
            sx={{ color: "white", fontWeight: "bold" }}
          >
            IT Jobs
          </Typography>
        </Box>
        <Box sx={{display: {xs: 'none', md: 'flex'}, gap: 0.8, marginLeft: 3 ,alignItems: 'center'}}>
          <AllJobs />
          <ItCompany/>
          <AboutUs />
        </Box>  
      </Box>
      {/* Right Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        { !isAuthenticated ? <> <Button variant="outlined" sx={{color: 'text.primary'}} onClick={() => loginWithRedirect()} >Login/ Register</Button>
       <Divider orientation="vertical" variant="middle" flexItem sx={{ marginLeft: '5px',border: '1px solid red' }}/>
       <Button onClick={() => navigate("/employer/register")} startIcon={<BusinessCenterIcon />}  variant="contained" sx={{marginLeft: '10px', backgroundColor: 'black'}}>Đăng tuyển & Tìm hồ sơ</Button></> :
       <>
       <Notifications/>
       <Profile/>
       
       </>
       }
      
        
      </Box>
    </Box>
  );
}

export default AppBar;
