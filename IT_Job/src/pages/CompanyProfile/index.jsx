"use client"
import { Box, Container, Typography, Button, Paper, Grid, Divider, Link } from "@mui/material"
import {
  Language as LanguageIcon,
  People as PeopleIcon,
  Edit as EditIcon,
  LocationOn as LocationOnIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material"
import CustomeAppBar from "~/components/AppBar/AppBar/AppBar"
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import AddAlertIcon from '@mui/icons-material/AddAlert';
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageLoading from "~/components/Loading/PageLoading";
import { toast } from "react-toastify";
import { followCompanyAPI, getEmployerByIdAPI, getUserProfile } from "~/apis";
import { getCountryCode } from "~/utils/flagCountry";
import { sanitizeHTML } from "~/utils/formatter";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "~/redux/user/userSlice";

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const CompanyProfile = () => {

  const user = useSelector(selectCurrentUser)
  const query = useQuery()
  const employerId = query.get('employerId')
  const [companyData, setCompanyData] = useState(null)
  const [isFollowing, setIsFollowing] = useState(false)

  const handleFollowClick = async () => {
    try {
      // Gửi yêu cầu lên server (giả định API này là toggle)
      const res = await followCompanyAPI({ email: user.email, employerId })
  
      // Giả sử API trả về trạng thái mới (true/false)
      const newFollowState = res?.isFollowing ?? !isFollowing
  
      setIsFollowing(newFollowState)
  
      if (newFollowState) {
        toast.success("Bạn đã theo dõi công ty!")
      } else {
        toast.info("Đã hủy theo dõi công ty.")
      }
    } catch (error) {
      toast.error("Đã có lỗi khi thực hiện theo dõi. Vui lòng thử lại.")
      console.error(error)
    }
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employerData, userData] = await Promise.all([
          getEmployerByIdAPI(employerId),
          getUserProfile(user.email),
        ])
  
        setCompanyData(employerData)
  
        const followedCompanies = userData.saveCompany || []
        setIsFollowing(followedCompanies.includes(employerId))
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu công ty hoặc người dùng:", error)
        // Bạn có thể set state báo lỗi nếu muốn hiển thị thông báo riêng
      }
    }
  
    if (employerId && user?.email) {
      fetchData()
    }
  }, [employerId, user])
  
  
  

    if(!companyData)
        return <PageLoading caption={"Loading..."}/>
    console.log(companyData)
  return (
    <>
    <CustomeAppBar/>

    <Box bgcolor={"whitesmoke"}>
      <Container sx={{ py: 14 }}>
        {/* Company Banner and Logo */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            mb: 4,
          }}
        >
          {/* Banner */}
          <Box
            sx={{
              height: 200,
              background: "linear-gradient(90deg, rgba(0,59,36,1) 0%, rgba(9,121,75,1) 35%, rgba(0,212,97,1) 100%)",
              position: "relative",
              backgroundImage: `url('${companyData.backgroundURL}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></Box>

          {/* Logo and Company Name */}
          <Box sx={{ px: 3, py: 3, position: "relative" }}>
            <Box
              sx={{
                position: "absolute",
                top: -60,
                left: 30,
                width: 140,
                height: 140,
                bgcolor: "white",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={companyData.logoURL}
                alt="STEI Institute Logo"
                style={{ maxWidth: "80%", maxHeight: "80%" }}
              />
            </Box>

            <Box sx={{ ml: 21, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#121212" }}>
                  {companyData.companyName}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <LanguageIcon sx={{ fontSize: 18, color: "#121212", mr: 0.5 }} />
                  <Link href="https://stei.edu.vn/" target="_blank" sx={{ color: "#222423", mr: 3 }}>
                    {companyData.companyURL}
                  </Link>

                  <LinkedInIcon sx={{ fontSize: 18, color: "#121212", mr: 0.5 }} />
                  <Link href="https://stei.edu.vn/" target="_blank" sx={{ color: "#222423", mr: 3 }}>
                    {companyData.linkedin}
                  </Link>
                  
                </Box>
              </Box>
              <Button
                variant={isFollowing ? "outlined" : "contained"}
                startIcon={
                  isFollowing ? (
                    <FavoriteRoundedIcon sx={{ color: "#e53935", transition: "all 0.3s ease" }} />
                  ) : (
                    <AddAlertIcon />
                  )
                }
                onClick={handleFollowClick}
                sx={{
                  bgcolor: isFollowing ? "#fce4ec" : "white",
                  color: isFollowing ? "#1e88e5" : "#00a86b",
                  borderColor: isFollowing ? "#f48fb1" : "transparent",
                  "&:hover": {
                    bgcolor: isFollowing ? "#f8bbd0" : "#f5f5f5",
                  },
                  transition: "all 0.3s ease",
                  textTransform: "none",
                  fontWeight: 500,
                  borderWidth: 1.5,
                  borderStyle: "solid",
                }}
              >
                {isFollowing ? "Đã theo dõi" : "Theo dõi công ty"}
              </Button>


            </Box>
          </Box>
        </Paper>

        {/* Main Content - General Information and Contact Information side by side */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* General Information Section */}
          <Grid item xs={12} md={8.5}>
                 
                 <Paper elevation={0} sx={{ borderRadius: 2, p: 4,borderTop: "5px solid #ab261a",  }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                General information
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" sx={{ color: "#a6a6a6" }} gutterBottom>
                    Company type
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {companyData.industry}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" sx={{ color: "#a6a6a6" }} gutterBottom>
                    Working days
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {`${companyData.workDaysStart} - ${companyData.workDaysEnd}`} 
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" sx={{ color: "#a6a6a6" }} gutterBottom>
                    Company size
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {`${companyData.companySize} employees`}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography variant="body2" sx={{ color: "#a6a6a6" }} gutterBottom>
                        Country
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                        component="img"
                        src={`https://flagcdn.com/w40/${getCountryCode(companyData.companyCountry)}.png`}
                        alt="Japan Flag"
                        sx={{
                            width: 24,
                            height: 16,
                            borderRadius: "2px",
                            objectFit: "cover",
                            mr: 1,
                        }}
                        />
                        <Typography variant="body1" fontWeight="medium">
                            Viet Nam
                        </Typography>
                    </Box>
                    </Grid>

 
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" sx={{ color: "#a6a6a6" }} gutterBottom>
                    Overtime policy
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {companyData.overtimeRequired ? "Extra salary for OT" : "No OT"}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            p: 3,
            borderTop: "5px solid #ab261a",
            marginTop: '23px'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Giới thiệu công ty
          </Typography>
          <Typography
                variant="body2"
                mt={1}
                sx={{ whiteSpace: "pre-line" }}
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(companyData.companyDescription) }}
                />

        </Paper>
          </Grid>

          {/* Contact Information - Moved up to be side by side with General Information */}
          <Grid item xs={12} md={3.5}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 2,
                p: 3,
                height: "100%",
                 borderTop: "5px solid #ab261a",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Thông tin liên hệ
              </Typography>

              {/* Representative */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <PersonIcon sx={{ color: "#ab261a", mr: 1 }} />
                  <Typography variant="body2" fontWeight="bold" fontSize={'15px'} sx={{color: '#a6a6a6'}}>
                    Người đại diện
                  </Typography>
                </Box>
                <Typography sx={{ ml: 4, fontSize: '13.5px' }}>
                  {companyData.fullName}
                </Typography>
              </Box>

              {/* Work Email */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <EmailIcon sx={{ color: "#ab261a", mr: 1 }} />
                  <Typography variant="body2" fontWeight="bold" fontSize={'15px'} sx={{color: '#a6a6a6'}}>
                    Work Email
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ ml: 4,  fontSize: '13.5px' }}>
                  {companyData.workEmail}
                </Typography>
              </Box>

              {/* Phone Number */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <PhoneIcon sx={{ color: "#ab261a", mr: 1 }} />
                  <Typography variant="body2" fontWeight="bold" fontSize={'15px'} sx={{color: '#a6a6a6'}}>
                    Phone Number
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ ml: 4 ,  fontSize: '13.5px'}}>
                  {companyData.phoneNumber}
                </Typography>
              </Box>

              {/* Company Address */}
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <LocationOnIcon sx={{ color: "#ab261a", mr: 1 }} />
                  <Typography variant="body2" fontWeight="bold" fontSize={'15px'} sx={{color: '#a6a6a6'}}>
                    Địa chỉ công ty
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ ml: 4 ,  fontSize: '13.5px'}}>
                    {companyData.companyAddress}
                </Typography>
              </Box>

              {/* Map */}
            
            </Paper>
          </Grid>
        </Grid>

        {/* Company Introduction */}
       
      </Container>
    </Box>
    </>
  )
}

export default CompanyProfile
