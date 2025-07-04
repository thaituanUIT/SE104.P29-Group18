"use client"

import { useState } from "react"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Collapse from "@mui/material/Collapse"
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined"
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined"
import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined"
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined"
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import SvgIcon from "@mui/material/SvgIcon"
import { ReactComponent as Logo } from "~/assets/logo.svg"
import TopAppBar from "~/components/AppBar/AppBarEmployer/index"
import JobPost from "~/pages/EmployerPages/jobPostPage/index"
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined"
import CompanyInfo from "./companyInfo"
import { useConfirm } from "material-ui-confirm"
import { useDispatch } from "react-redux"
import { logOutEmployerAPI } from "~/redux/employer/employerSlice"
import EvaluationDashboard from "./evaluation"
import InterviewManagement from "./interview"
import TestManagement from "./exam"
import SubmittedCVs from "./CVApplied"
import EmployerDashboards from "./DashBoard"
import { styled } from "@mui/material/styles"

const SECTIONS = {
  DASHBOARD: "dashboard",
  POSTJOB: "postJob",
  CV: "CV",


  INTERVIEW: "interview",

  EXAM: "exam",
  COMPANY_INFO: "companyInfo",

}

const mainMenus = [
  {
    label: "Tổng quan",
    key: "overview",
    items: [{ key: SECTIONS.DASHBOARD, label: "Dashboard", icon: <SpaceDashboardOutlinedIcon fontSize="small" /> }],
  },
  {
    label: "Quản lý đăng tuyển",
    key: "recruitment",
    items: [
      { key: SECTIONS.POSTJOB, label: "Đăng tin tuyển dụng", icon: <AssignmentOutlinedIcon fontSize="small" /> },
      { key: SECTIONS.CV, label: "Hồ sơ ứng tuyển", icon: <FactCheckOutlinedIcon fontSize="small" /> },
      { key: SECTIONS.EXAM, label: "Quản lý kiểm tra", icon: <PersonSearchOutlinedIcon fontSize="small" /> },
      { key: SECTIONS.INTERVIEW, label: "Phỏng vấn", icon: <PersonSearchOutlinedIcon fontSize="small" /> },
    ],
  },
  {
    label: "Quản lý tài khoản",
    key: "accountManagement",
    items: [
      { key: SECTIONS.COMPANY_INFO, label: "Thông tin công ty", icon: <BusinessOutlinedIcon fontSize="small" /> },
      { key: "logout", label: "Đăng xuất", icon: <LogoutOutlinedIcon fontSize="small" /> },
    ],
  },
]

// Định nghĩa chiều rộng của sidebar
const SIDEBAR_WIDTH = 240; // THAY ĐỔI: Chiều rộng nhỏ hơn (ví dụ từ 280px xuống 240px)

const StyledSidebar = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: SIDEBAR_WIDTH,
  height: "100vh",
  background: "#F0F2F5", // THAY ĐỔI: Màu xám trắng hiện đại (Light Grey)
  boxShadow: "4px 0 20px rgba(0, 0, 0, 0.05)", // Giảm độ đậm của shadow cho màu sáng
  zIndex: 1200,
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: "rgba(0, 0, 0, 0.05)", // Thay đổi màu track cho phù hợp với nền sáng
  },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(0, 0, 0, 0.2)", // Thay đổi màu thumb cho phù hợp với nền sáng
    borderRadius: "3px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "rgba(0, 0, 0, 0.4)",
  },
}))

const StyledMainContent = styled(Box)(({ theme }) => ({
  marginLeft: SIDEBAR_WIDTH,
  minHeight: "100vh",
  backgroundColor: "#f8fafc", // Giữ nguyên màu nền của nội dung chính
  transition: "margin-left 0.3s ease",
  flexGrow: 1,
}))

const StyledMenuSection = styled(Box)(({ theme }) => ({
  marginBottom: "24px",
}))

const StyledMenuHeader = styled(Stack)(({ theme }) => ({
  padding: "12px 20px",
  cursor: "pointer",
  borderRadius: "12px",
  margin: "0 16px",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.05)", // Hover màu đen mờ cho nền sáng
  },
}))

const StyledMenuItem = styled(Stack)(({ isActive }) => ({
  padding: "12px 20px",
  margin: "4px 16px",
  borderRadius: "12px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  backgroundColor: isActive ? "rgba(0, 0, 0, 0.1)" : "transparent", // Active màu đen mờ hơn
  backdropFilter: isActive ? "blur(5px)" : "none", // Có thể giảm blur nếu màu nền sáng
  border: isActive ? "1px solid rgba(0, 0, 0, 0.15)" : "1px solid transparent", // Border đậm hơn cho nền sáng
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.07)", // Hover màu đen mờ hơn
    transform: "translateX(4px)",
  },
  "& .MuiSvgIcon-root": {
    color: "#4A4A4A", // THAY ĐỔI: Icon màu xám đậm cho nền sáng
    fontSize: "20px",
  },
  "& .menu-text": {
    color: "#4A4A4A", // THAY ĐỔI: Text màu xám đậm cho nền sáng
    fontWeight: isActive ? 600 : 400,
    fontSize: "14px",
  },
}))

const StyledLogo = styled(Box)(({ theme }) => ({
  padding: "24px 20px",
  borderBottom: "1px solid rgba(0, 0, 0, 0.1)", // Border cho nền sáng
  marginBottom: "24px",
}))

const SidebarItem = ({ icon, label, isActive, onClick }) => (
  <StyledMenuItem direction="row" spacing={2} alignItems="center" onClick={onClick} isActive={isActive}>
    {icon}
    <Typography className="menu-text">{label}</Typography>
  </StyledMenuItem>
)

const Boards = () => {
  const [selectedSection, setSelectedSection] = useState(SECTIONS.DASHBOARD)
  const [openMenus, setOpenMenus] = useState({
    overview: true,
    recruitment: true,
    accountManagement: true,
  })

  const toggleMenu = (menuKey) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }))
  }

  const dispatch = useDispatch()
  const confirm = useConfirm()
  const handleLogout = () => {
    confirm({
      title: "Bạn có chắc chắn muốn đăng xuất?",
      confirmationText: "Đăng xuất",
      confirmationButtonProps: {
        variant: "outlined",
        color: "error",
      },
      cancellationText: "Hủy",
    })
      .then(async () => {
        dispatch(logOutEmployerAPI())
      })
      .catch(() => {})
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc", width: "100vw" }}>
      {/* Sidebar - Cố định vị trí */}
      <StyledSidebar>
        <StyledLogo>
          <Stack direction="row" alignItems="center" spacing={2}>
            <SvgIcon
              sx={{
                color: "#4A4A4A", // THAY ĐỔI: Màu logo phù hợp với nền sáng
                fontSize: 40,
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))", // Shadow nhẹ hơn
              }}
              component={Logo}
              inheritViewBox
            />
            <Typography
              variant="h5"
              fontWeight="700"
              sx={{
                color: "#4A4A4A", // THAY ĐỔI: Màu text logo phù hợp với nền sáng
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              IT Jobs
            </Typography>
          </Stack>
        </StyledLogo>

        <Box sx={{ px: 1 }}>
          {mainMenus.map((menu) => (
            <StyledMenuSection key={menu.key}>
              <StyledMenuHeader
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                onClick={() => toggleMenu(menu.key)}
              >
                <Typography
                  fontWeight="600"
                  fontSize={15}
                  sx={{
                    color: "#616161", // THAY ĐỔI: Màu text header phù hợp với nền sáng
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {menu.label}
                </Typography>
                {openMenus[menu.key] ? (
                  <ExpandLessIcon sx={{ color: "#757575", fontSize: 20 }} /> // Màu icon phù hợp
                ) : (
                  <ExpandMoreIcon sx={{ color: "#757575", fontSize: 20 }} /> // Màu icon phù hợp
                )}
              </StyledMenuHeader>

              <Collapse in={openMenus[menu.key]} timeout="auto" unmountOnExit>
                <Box sx={{ mt: 1 }}>
                  {menu.items.map((item) => (
                    <SidebarItem
                      key={item.key}
                      icon={item.icon}
                      label={item.label}
                      isActive={selectedSection === item.key}
                      onClick={() => {
                        if (item.key === "logout") {
                          handleLogout()
                        } else {
                          setSelectedSection(item.key)
                        }
                      }}
                    />
                  ))}
                </Box>
              </Collapse>
            </StyledMenuSection>
          ))}
        </Box>
      </StyledSidebar>

      {/* Main Content Area */}
      <StyledMainContent>
        <Box sx={{ p: 3 }}>
          <TopAppBar />
          <Box sx={{ mt: 2 }}>
            {selectedSection === SECTIONS.DASHBOARD &&<EmployerDashboards/>}
            {selectedSection === SECTIONS.POSTJOB && <JobPost />}
            {selectedSection === SECTIONS.CV && <SubmittedCVs />}
 
   
            {selectedSection === SECTIONS.EXAM && <TestManagement />}
            {selectedSection === SECTIONS.INTERVIEW && <InterviewManagement />}
            {selectedSection === SECTIONS.COMPANY_INFO && <CompanyInfo />}
     
          </Box>
        </Box>
      </StyledMainContent>
    </Box>
  )
}

export default Boards