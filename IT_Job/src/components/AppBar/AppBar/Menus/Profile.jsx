import { useState } from 'react';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { useAuth0 } from "@auth0/auth0-react"
import { selectCurrentUser, clearDataUser } from '~/redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate()
  const { logout } = useAuth0();
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
     
      dispatch(clearDataUser());
      logout({ logoutParams: { returnTo: window.location.origin } });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 1 }}
          aria-controls={open ? 'basic-menu-profile' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            alt={currentUser?.name || 'User'}
            src={currentUser?.picture}
            sx={{ width: 30, height: 30 }}
          />
        </IconButton>
      </Tooltip>
      <Menu
        disableScrollLock={true}
        id="basic-menu-profile"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        MenuListProps={{
          'aria-labelledby': 'basic-button-profile',
        }}
      >
        <MenuItem
          sx={{
            '&:hover': { color: 'primary.main' },
          }}
          onClick={() => navigate('/seeker/dashboard')}
        >
          <Avatar
            sx={{ height: 28, width: 28, mr: 1 }}
            alt={currentUser?.name || 'User'}
            src={currentUser?.picture}
          />
          DashBoard
        </MenuItem>
        <Divider />

        <MenuItem 
          onClick={() => navigate('/seeker/myJobs')}
        
        >
          <ListItemIcon>
            <AssignmentOutlinedIcon fontSize="small" />
          </ListItemIcon>
          My Jobs
        </MenuItem> 

        <MenuItem
          onClick={() => navigate('/seeker/profile')}
        >
          <ListItemIcon>
            <FactCheckOutlinedIcon fontSize="small" />
          </ListItemIcon>
          IT Jobs Profile
        </MenuItem>
        
        <MenuItem
           onClick={() => navigate('/seeker/cv')}
        >
          <ListItemIcon>
            <BusinessOutlinedIcon fontSize="small" />
          </ListItemIcon>
          CV Attachment
        </MenuItem>

        <MenuItem
         onClick={() => navigate('/seeker/jobInvite')}
        >
          <ListItemIcon>
            <MarkEmailUnreadOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Jobs Invitation
        </MenuItem>

        <MenuItem
          sx={{
            '&:hover': { color: 'red', '& .icon_logout': { color: 'red' } },
          }}
          onClick={handleLogout}
        >
          <ListItemIcon className="icon_logout">
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}


export default Profile;
