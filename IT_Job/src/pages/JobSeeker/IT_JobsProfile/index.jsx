import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as education } from '~/assets/education.svg';
import { ReactComponent as experience } from '~/assets/experience.svg';
import { ReactComponent as certificate } from '~/assets/certi.svg';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkIcon from '@mui/icons-material/Link';
import { Grid, CircularProgress, Alert, Snackbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ProfileModal from './component/profileModal';
import EducationModal from './component/educationModal';
import WorkExperienceModal from './component/experienceModal';
import CertificatesModal from './component/certificateModal';
import PageLoading from '~/components/Loading/PageLoading';
import { 
  getUserProfile, 
  updateUserProfile, 
  addEducation, 
  updateEducation, 
  deleteEducation,
  addExperience,
  updateExperience,
  deleteExperience,
  addCertificate,
  updateCertificate,
  deleteCertificate
} from '~/apis/index';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '~/redux/user/userSlice';

const ITJobsProfileSection = () => {
  // State for user data
  const [userInfo, setUserInfo] = useState({
    _id: '',
    name: "",
    title: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    personalLink: "",
    avatar: "",
    education: [],
    experience: [],
    certificates: []
  });
  const currentUser = useSelector(selectCurrentUser)

  // State for loading and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Modal states
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [educationModalOpen, setEducationModalOpen] = useState(false);
  const [workModalOpen, setWorkModalOpen] = useState(false);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  
  // Edit states
  const [editingEducation, setEditingEducation] = useState(null);
  const [editingExperience, setEditingExperience] = useState(null);
  const [editingCertificate, setEditingCertificate] = useState(null);

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      // In a real app, you would get the email from auth context or similar
      const email = currentUser.email
      const userData = await getUserProfile(email);
      setUserInfo(userData);
    } catch (err) {
      setError('Failed to load profile data');
      showSnackbar('Failed to load profile data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Show snackbar notification
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Load user data on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Profile modal handlers
  const handleOpenProfileModal = () => {
    setProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setProfileModalOpen(false);
  };

  const handleSaveProfile = async (userData) => {
    const {_id, ...data} = userData 
    try {
      setLoading(true);
      await updateUserProfile(userInfo._id, data);
      setUserInfo({ ...userInfo, ...data });
      showSnackbar('Profile updated successfully');
    } catch (err) {
      showSnackbar('Failed to update profile', 'error');
    } finally {
      setLoading(false);
      setProfileModalOpen(false);
    }
  };

  // Education modal handlers
  const handleOpenEducationModal = (education = null) => {
    setEditingEducation(education);
    setEducationModalOpen(true);
  };

  const handleCloseEducationModal = () => {
    setEditingEducation(null);
    setEducationModalOpen(false);
  };

  const handleSaveEducation = async (educationData) => {
    try {
      setLoading(true);
      
      if (editingEducation) {
        // Update existing education
        await updateEducation(userInfo._id, editingEducation.id, educationData);
        const updatedEducation = userInfo.education.map(edu => 
          edu.id === editingEducation.id ? { ...edu, ...educationData } : edu
        );
        setUserInfo({ ...userInfo, education: updatedEducation });
        showSnackbar('Education updated successfully');
      } else {
        // Add new education
        const result = await addEducation(userInfo._id, educationData);
        const newEducation = [...userInfo.education, result.education];
        setUserInfo({ ...userInfo, education: newEducation });
        showSnackbar('Education added successfully');
      }
    } catch (err) {
      showSnackbar('Failed to save education', 'error');
    } finally {
      setLoading(false);
      setEducationModalOpen(false);
      setEditingEducation(null);
    }
  };

  const handleDeleteEducation = async (educationId) => {
    try {
      setLoading(true);
      await deleteEducation(userInfo._id, educationId);
      const updatedEducation = userInfo.education.filter(edu => edu.id !== educationId);
      setUserInfo({ ...userInfo, education: updatedEducation });
      showSnackbar('Education deleted successfully');
    } catch (err) {
      showSnackbar('Failed to delete education', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Experience modal handlers
  const handleOpenExperienceModal = (experience = null) => {
    setEditingExperience(experience);
    setWorkModalOpen(true);
  };

  const handleCloseExperienceModal = () => {
    setEditingExperience(null);
    setWorkModalOpen(false);
  };

  const handleSaveExperience = async (experienceData) => {
    try {
      setLoading(true);
      
      if (editingExperience) {
        // Update existing experience
        await updateExperience(userInfo._id, editingExperience.id, experienceData);
        const updatedExperience = userInfo.experience.map(exp => 
          exp.id === editingExperience.id ? { ...exp, ...experienceData } : exp
        );
        setUserInfo({ ...userInfo, experience: updatedExperience });
        showSnackbar('Experience updated successfully');
      } else {
        // Add new experience
        const result = await addExperience(userInfo._id, experienceData);
        const newExperience = [...userInfo.experience, result.experience];
        setUserInfo({ ...userInfo, experience: newExperience });
        showSnackbar('Experience added successfully');
      }
    } catch (err) {
      showSnackbar('Failed to save experience', 'error');
    } finally {
      setLoading(false);
      setWorkModalOpen(false);
      setEditingExperience(null);
    }
  };

  const handleDeleteExperience = async (experienceId) => {
    try {
      setLoading(true);
      await deleteExperience(userInfo._id, experienceId);
      const updatedExperience = userInfo.experience.filter(exp => exp.id !== experienceId);
      setUserInfo({ ...userInfo, experience: updatedExperience });
      showSnackbar('Experience deleted successfully');
    } catch (err) {
      showSnackbar('Failed to delete experience', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Certificate modal handlers
  const handleOpenCertificateModal = (certificate = null) => {
    setEditingCertificate(certificate);
    setCertificateModalOpen(true);
  };

  const handleCloseCertificateModal = () => {
    setEditingCertificate(null);
    setCertificateModalOpen(false);
  };

  const handleSaveCertificate = async (certificateData) => {
    try {
      setLoading(true);
      
      if (editingCertificate) {
        // Update existing certificate
        await updateCertificate(userInfo._id, editingCertificate.id, certificateData);
        const updatedCertificates = userInfo.certificates.map(cert => 
          cert.id === editingCertificate.id ? { ...cert, ...certificateData } : cert
        );
        setUserInfo({ ...userInfo, certificates: updatedCertificates });
        showSnackbar('Certificate updated successfully');
      } else {
        // Add new certificate
        const result = await addCertificate(userInfo._id, certificateData);
        const newCertificates = [...userInfo.certificates, result.certificate];
        setUserInfo({ ...userInfo, certificates: newCertificates });
        showSnackbar('Certificate added successfully');
      }
    } catch (err) {
      showSnackbar('Failed to save certificate', 'error');
    } finally {
      setLoading(false);
      setCertificateModalOpen(false);
      setEditingCertificate(null);
    }
  };

  const handleDeleteCertificate = async (certificateId) => {
    try {
      setLoading(true);
      await deleteCertificate(userInfo._id, certificateId);
      const updatedCertificates = userInfo.certificates.filter(cert => cert.id !== certificateId);
      setUserInfo({ ...userInfo, certificates: updatedCertificates });
      showSnackbar('Certificate deleted successfully');
    } catch (err) {
      showSnackbar('Failed to delete certificate', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !userInfo.name) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !userInfo.name) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  
  return (
    <>
    {loading && (
      <PageLoading caption={"Loading board"}/>
    )}
    
    <Box mt={3}>
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          position: 'relative',
        }}
      >
        <IconButton
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 1,
            color: 'primary.main'
          }}
          onClick={handleOpenProfileModal}
        >
          <EditIcon />
        </IconButton>

        <CardContent>
          <Stack direction="row" spacing={5} alignItems="center" mb={4} ml={4} mt={1}>
            <Avatar
              src={userInfo.picture}
              sx={{ width: 80, height: 80 }}
            />
            <Box>
              <Typography sx={{ fontSize: '24px' }} fontWeight="bold">
                {userInfo.name}
              </Typography>
              <Typography sx={{ fontWeight: 'bold', color: '#a6a6a6' }}>
                {userInfo.title}
              </Typography>
            </Box>
          </Stack>

          <Grid container spacing={4} ml={1.5} sx={{ color: '#a6a6a6' }}>
            <Grid item xs={12} sm={4}>
              <Stack direction="row" spacing={1} alignItems="center">
                <MailOutlineIcon fontSize="small" />
                <Typography>{userInfo.email}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PhoneIcon fontSize="small" />
                <Typography>{userInfo.phone}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CakeIcon fontSize="small" />
                <Typography>{userInfo.dob}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction="row" spacing={1} alignItems="center">
                <WcIcon fontSize="small" />
                <Typography>{userInfo.gender}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocationOnIcon fontSize="small" />
                <Typography>{userInfo.address}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction="row" spacing={1} alignItems="center">
                <LinkIcon fontSize="small" />
                <Typography>{userInfo.personalLink}</Typography>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <ProfileModal 
        open={profileModalOpen} 
        onClose={handleCloseProfileModal} 
        userData={userInfo} 
        onSave={handleSaveProfile} 
      />
    </Box>

    <Box mt={2}>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" ml={'36px'}>
              <Typography variant="h6" fontWeight="bold">
                Education
              </Typography>
               {/* Ẩn SvgIcon nếu có dữ liệu */}
               {(!userInfo.education || userInfo.education.length === 0) && (
                <SvgIcon component={education} inheritViewBox sx={{ fontSize: '70px', ml: '20px' }} />
              )}
            </Box>
            <Box display="flex" gap={2}>
              <IconButton
                sx={{
                  borderRadius: '50%',
                  color: '#ef5350',
                  bgcolor: '#ffebee',
                  width: 30,
                  height: 30,
                  mt: '0px',
                  '&:hover': {
                    bgcolor: '#ffcdd2',
                  },
                }}
                onClick={() => handleOpenEducationModal()}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Thêm đường kẻ ngang dưới tiêu đề Education */}
          {userInfo.education && userInfo.education.length > 0 && <Divider sx={{ my: 1, ml: 4 }} />}

          {/* Hiển thị dữ liệu học vấn nếu có */}
          {userInfo.education && userInfo.education.length > 0 ? (
            userInfo.education.map((item, index) => (
              <Box key={item.id || index} mt={2}>
                {index > 0 && <Divider sx={{ my: 2, ml: 4 }} />}
                <Box display="flex" alignItems="center" justifyContent="space-between" >
                  <Box>
                    <Typography sx={{ml: '36px', mt: '5px', color: '#414042 '}} fontSize={'16px'} fontWeight="bold">
                      {item.major}
                    </Typography>
                    <Typography sx={{ml: '36px', mt: '5px', color: '#414042 '}} variant="body2" color="text.primary">
                      {item.school}
                    </Typography>
                    <Typography sx={{ml: '36px', mt: '5px', color: '#414042 '}} variant="body2" color="text.secondary">
                      {item.isCurrentlyStudying ? `${item.fromMonth}/${item.fromYear} - NOW` : `${item.fromMonth}/${item.fromYear} - ${item.toMonth}/${item.toYear} `}
                    </Typography>
                    <Typography sx={{ml: '36px', mt: '5px', color: '#414042 '}} variant="body2" color="text.secondary">
                      {item.additionalDetails}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton 
                      sx={{ color: '#ef5350' }}
                      onClick={() => handleOpenEducationModal(item)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      sx={{ color: '#ef5350' }} 
                      onClick={() => handleDeleteEducation(item.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{color: '#a6a6a6', ml: '36px'}}>
              Share your background education
            </Typography>
          )}
        </CardContent>
      </Card>

      <EducationModal 
        open={educationModalOpen} 
        onClose={handleCloseEducationModal} 
        onSave={handleSaveEducation}
        initialData={editingEducation} 
      />
    </Box>

    <Box mt={2}>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" ml={'36px'}>
              <Typography variant="h6" fontWeight="bold">
                Experience
              </Typography>
              {/* Ẩn SvgIcon nếu có dữ liệu */}
              {(!userInfo.experience || userInfo.experience.length === 0) && (
                <SvgIcon component={experience} inheritViewBox sx={{ fontSize: '70px', ml: '20px' }} />
              )}
            </Box>
            <Box display="flex" gap={2}>
              <IconButton
                sx={{
                  borderRadius: '50%',
                  color: '#ef5350',
                  bgcolor: '#ffebee',
                  width: 30,
                  height: 30,
                  mt: '0px',
                  '&:hover': {
                    bgcolor: '#ffcdd2',
                  },
                }}
                onClick={() => handleOpenExperienceModal()}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Thêm đường kẻ ngang dưới tiêu đề Experience */}
          {userInfo.experience && userInfo.experience.length > 0 && <Divider sx={{ my: 1, ml: 4 }} />}

          {/* Hiển thị dữ liệu kinh nghiệm nếu có */}
          {userInfo.experience && userInfo.experience.length > 0 ? (
            userInfo.experience.map((item, index) => (
              <Box key={item.id || index} mt={2}>
                {index > 0 && <Divider sx={{ my: 2, ml: 4 }} />}
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography sx={{ ml: '36px', mt: '6px', color: '#414042' }} fontSize={'16px'} fontWeight="bold">
                      {item.jobTitle}
                    </Typography>
                    <Typography sx={{ ml: '36px', mt: '6px', color: '#414042' }} variant="body2" color="text.primary">
                      {item.company}
                    </Typography>
                    <Typography sx={{ ml: '36px', mt: '6px', color: '#414042' }} variant="body2" color="text.secondary">
                      {item.isCurrentlyWorking ? `${item.fromMonth}/${item.fromYear} - NOW` : `${item.fromMonth}/${item.fromYear} - ${item.toMonth}/${item.toYear} `}
                    </Typography>
                    <Typography sx={{ ml: '36px', mt: '6px', color: '#414042' }} variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton 
                      sx={{ color: '#ef5350' }}
                      onClick={() => handleOpenExperienceModal(item)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      sx={{ color: '#ef5350' }} 
                      onClick={() => handleDeleteExperience(item.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ color: '#a6a6a6', ml: '36px' }}>
              Highlight detailed information about your job history
            </Typography>
          )}
        </CardContent>
      </Card>

      <WorkExperienceModal 
        open={workModalOpen} 
        onClose={handleCloseExperienceModal} 
        onSave={handleSaveExperience}
        initialData={editingExperience}
      />
    </Box>

    <Box mt={2}>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" ml={'36px'}>
              <Typography variant="h6" fontWeight="bold">
                Certificate
              </Typography>
              {/* Ẩn SvgIcon nếu có dữ liệu */}
              {(!userInfo.certificates || userInfo.certificates.length === 0) && (
                <SvgIcon component={certificate} inheritViewBox sx={{ fontSize: '70px', ml: '20px' }} />
              )}
            </Box>
            <Box display="flex" gap={2}>
              <IconButton
                sx={{
                  borderRadius: '50%',
                  color: '#ef5350',
                  bgcolor: '#ffebee',
                  width: 30,
                  height: 30,
                  mt: '0px',
                  '&:hover': {
                    bgcolor: '#ffcdd2',
                  },
                }}
                onClick={() => handleOpenCertificateModal()}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Thêm đường kẻ ngang dưới tiêu đề Certificate */}
          {userInfo.certificates && userInfo.certificates.length > 0 && <Divider sx={{ my: 1, ml: 4 }} />}

          {/* Hiển thị dữ liệu chứng chỉ nếu có */}
          {userInfo.certificates && userInfo.certificates.length > 0 ? (
            userInfo.certificates.map((item, index) => (
              <Box key={item.id || index} mt={2}>
                {index > 0 && <Divider sx={{ my: 2, ml: 4 }} />}
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography sx={{ ml: '36px', mt: '6px', color: '#414042' }} fontSize={'16px'} fontWeight="bold">
                      {item.certificateName}
                    </Typography>
                    <Typography sx={{ ml: '36px', mt: '6px', color: '#414042' }} variant="body2" color="text.primary">
                      {item.organization}
                    </Typography>
                    <Typography sx={{ ml: '36px', mt: '6px', color: '#414042' }} variant="body2" color="text.secondary">
                      {`${item.issueMonth}/${item.issueYear}`}
                    </Typography>
                    <Typography sx={{ ml: '36px', mt: '6px', color: '#414042' }} variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                    {item.certificateURL && (
                      <Link
                        href={item.certificateURL}
                        target="_blank"
                        rel="noopener"
                        sx={{
                          ml: '36px',
                          mt: '5px',
                          color: '#1976d2',
                          display: 'inline-flex',
                          alignItems: 'center',
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        Certificate Link
                        <OpenInNewIcon sx={{ml: '6px'}}/>
                      </Link>
                    )}
                  </Box>
                  <Box>
                    <IconButton 
                      sx={{ color: '#ef5350' }}
                      onClick={() => handleOpenCertificateModal(item)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      sx={{ color: '#ef5350' }} 
                      onClick={() => handleDeleteCertificate(item.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ color: '#a6a6a6', ml: '36px' }}>
              Provides evidence of your specific expertise and skills
            </Typography>
          )}
        </CardContent>
      </Card>

      <CertificatesModal
        open={certificateModalOpen}
        onClose={handleCloseCertificateModal}
        onSave={handleSaveCertificate}
        initialData={editingCertificate}
      />
    </Box>

    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
        {snackbar.message}
      </Alert>
    </Snackbar>
    </>
  );
};

export default ITJobsProfileSection;