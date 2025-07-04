"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import Badge from "@mui/material/Badge"
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Tooltip from "@mui/material/Tooltip"
import Button from "@mui/material/Button"
import Menu from "@mui/material/Menu"
import Avatar from "@mui/material/Avatar"
import ListItemText from "@mui/material/ListItemText"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import { styled } from "@mui/material/styles"
import { useNavigate } from "react-router-dom"
import {socket} from "~/socket"
import {
  addNotifications,
  fetchJobNotificationsAPI,
  markJobNotificationsAsReadAPI,
  markAllLocalAsRead,
  selectCurrentNotifications
} from "~/redux/notification/notificationSlice"
import { selectCurrentUser } from "~/redux/user/userSlice"
import { formatDate } from "~/utils/formatter"

const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 8,
    marginTop: theme.spacing(1),
    minWidth: 320,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  },
}))

const NotificationItem = styled(ListItem)(({ theme, isread }) => ({
  padding: theme.spacing(1.5),
  borderBottom: "1px solid #f0f0f0",
  backgroundColor: isread === "true" ? "transparent" : "rgba(25, 118, 210, 0.04)",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
  "&:last-child": {
    borderBottom: "none",
  },
}))

const NotificationHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderBottom: "1px solid #f0f0f0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}))

function Notifications() {
  const dispatch = useDispatch()
  const notifications = useSelector(selectCurrentNotifications)
  const user = useSelector(selectCurrentUser)
  const [anchorEl, setAnchorEl] = useState(null)
  const navigate = useNavigate()

  const open = Boolean(anchorEl)
  const unreadCount = notifications.filter((notif) => !notif.isRead).length

  const handleClickNotificationIcon = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleNotificationClick = (notification) => {
    // Navigate to job details
    console.log(notification)
    navigate(`/jobDetail/?jobId=${notification.jobId}&employerId=${notification.companyId}`)
    dispatch(markJobNotificationsAsReadAPI(user.email))
    dispatch(markAllLocalAsRead())
    handleClose()
  }

  const handleMarkAllAsRead = () => {
    dispatch(markJobNotificationsAsReadAPI(user.email))
    dispatch(markAllLocalAsRead())
  }

  useEffect(() => {
    if (user?.email) dispatch(fetchJobNotificationsAPI(user.email))
  }, [user?.email, dispatch])

  useEffect(() => {
    socket.on("FE_NOTIFICATION_NEW_JOBS", (data) => {
      dispatch(addNotifications(data))
    })
    return () => socket.off("FE_NOTIFICATION_NEW_JOBS")
  }, [dispatch])

  return (
    <Box>
      <Tooltip title="Thông báo">
        <IconButton
          color="inherit"
          sx={{ color: "white" }}
          id="notification-button"
          aria-controls={open ? "notification-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClickNotificationIcon}
        >
          <Badge
            badgeContent={unreadCount}
            color="error"
            sx={{
              "& .MuiBadge-badge": {
                fontSize: "0.75rem",
                minWidth: "18px",
                height: "18px",
              },
            }}
          >
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <StyledMenu
        id="notification-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "notification-button",
          sx: { padding: 0 },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <NotificationHeader>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Thông báo
          </Typography>
          {unreadCount > 0 && (
            <Button
              size="small"
              onClick={handleMarkAllAsRead}
              sx={{
                textTransform: "none",
                fontSize: "0.75rem",
              }}
            >
              Đánh dấu đã đọc
            </Button>
          )}
        </NotificationHeader>

        <Box sx={{ maxHeight: 320, overflowY: "auto" }}>
          {notifications.length === 0 ? (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Không có thông báo
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {console.log("testtest", notifications)}
              {notifications.map((notification, index) => (
                <NotificationItem
                  key={index}
                  isread={(notification.isRead ?? false).toString()}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={notification.logoURL}
                      sx={{ width: 40, height: 40 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" display="block">
                          {notification.companyName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" > 
                          Ngày đăng: {formatDate(notification.createdAt)}
                        </Typography>
                      </Box>
                    }
                  />
                  {!notification.isRead && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "primary.main",
                        ml: 1,
                      }}
                    />
                  )}
                </NotificationItem>
              ))}
            </List>
          )}
        </Box>
      </StyledMenu>
    </Box>
  )
}

export default Notifications
