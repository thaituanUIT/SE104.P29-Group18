import React from 'react';
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import GeneralInformationModal from './components/generalInformation';
import { useState, useEffect } from 'react';
import { getUserProfile } from '~/apis';
import { selectCurrentUser, setUser } from '~/redux/user/userSlice';
import { useSelector } from 'react-redux';
import PageLoading from '~/components/Loading/PageLoading';
import { singleFileValidator } from "~/utils/validators";
import { updateUserProfile } from '~/apis';
import { Link } from '@mui/material';
import { toast } from 'react-toastify';
import { formatDate } from '~/utils/formatter';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})


const ManageCV = () => {
  // Dữ liệu giả lập (có thể thay bằng dữ liệu từ API)
  const user = useSelector(selectCurrentUser)
  const cvData = {
    fileName: 'Template (1).docx',
    lastUpload: '25/04/2025',
  };

  const personalInfo = {
    fullName: 'Thái Sơn Phạm',
    phoneNumber: '0327299509',
    preferredLocation: 'TP Hồ Chí Minh',
  };

  const generalInfo = {
    totalExperience: '3 years',
    currentJobLevel: 'Junior',
    expectedWorkingModel: 'Remote',
    industry: 'Apparel and Fashion',
    expectedSalary: '2.000 - 2.500 VND/month',
  };

  const [generalInfoModalOpen, setGeneralInfoModalOpen] = useState(false)
  const [generalInfoData, setGeneralInfoData] = useState(null)
  const [userData, setUserData] = useState(null)
  

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await getUserProfile(user.email)
        setUserData(data)
      } catch (err) {
        console.error('Lỗi khi lấy thông tin hồ sơ:', err);
      }
    };
    if (user?.email) fetchUserProfile();
  }, [user]);

  const handleOpenGeneralInfoModal = () => {
    setGeneralInfoModalOpen(true)
  }

  const handleCloseGeneralInfoModal = () => {
    setGeneralInfoModalOpen(false)
  }

  const handleSaveGeneralInfo = (data) => {
    setGeneralInfoData(data)
    console.log("Saved general information data:", data)
  }

  const uploadCv = (e) => {
    // Lấy file thông qua e.target?.files[0] và validate nó trước khi xử lý
    console.log('e.target?.files[0]: ', e.target?.files[0])
    const error = singleFileValidator(e.target?.files[0])
    if (error) {
      toast.error(error)
      return
    }

    // Sử dụng FormData để xử lý dữ liệu liên quan tới file khi gọi API
    let reqData = new FormData()
    reqData.append('cv', e.target?.files[0])

    // Cách để log được dữ liệu thông qua FormData
    console.log('reqData: ', reqData)
    for (const value of reqData.values()) {
      console.log( 'value: ',value)
      
    }

    // Gọi API...
    toast.promise((updateUserProfile(userData._id, reqData)),  {
      pending: 'Uploading'
    }).then(async () => {
      
      const updatedUser = await getUserProfile(user.email)
      setUserData(updatedUser)
      toast.success('CV uploaded successfully!')
    })
  }


  if (!userData)
    return <PageLoading caption={"Loading..."}/>
  
  console.log(userData)

  return (
    <>
      <Box
        sx={{
          mt: 3,
          p: 3,
          borderRadius: 1,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Bóng nhẹ
          bgcolor: 'white',
        }}
      >
        {/* Tiêu đề và mô tả */}
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Manage CVs
        </Typography>
        <Typography sx={{color: '#a6a6a6', fontSize: '13px'}} mb={3}>
          Upload your CV below to use it through your application process
        </Typography>

        {/* Phần Your CV */}
        <Box
          sx={{
            p: 2,
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            mb: 3,
          }}
        >
          <Typography variant="body1" fontWeight="bold" mb={2}>
            YOUR CV
          </Typography>
          <Box display="flex" alignItems="center" mb={2}>
            <DescriptionIcon sx={{ color: '#ef5350', mr: 1, fontSize: '30px' }} />
            <Box>
            {userData.cvLink ? (
              <Link
                href={userData.cvLink}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={{ fontWeight: 'bold', fontSize: '14px' }}
              >
                Your CV
              </Link>
            ) : (
              <Typography variant="body2" fontWeight="bold">
                Upload your CV
              </Typography>
            )}

              <Typography sx={{color: '#a6a6a6' , fontSize: '13px', mt:'2px'}}>
                {userData.cvLink ? `Last update: ${formatDate(userData.updatedAt)}` : ''}
              </Typography>
            </Box>
          </Box>
          <Divider sx={
            {
              mb: 2
            }
          }/>
          <Button
            variant="outlined"
            component="label"

            startIcon={<FileUploadOutlinedIcon />}
            sx={{
              borderColor: '#ef5350',

              color: '#ef5350',
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': {
                borderColor: '#ef5350',
                backgroundColor: '#ffebee',
              },
            }}
          >
            Upload CV
            <VisuallyHiddenInput type="file" onChange={uploadCv} />
          </Button>
          <Typography sx= {{color:'#414042', fontSize: '12px'}}  mt={1}>
            Please upload a .doc, .docx, or .pdf file, minimum 3MB and no password protection
          </Typography>
        </Box>

        {/* Phần Personal Information */}
        <Box
          sx={{
            p: 2,
            border: '1px solid #e0e0e0',
            borderRadius: 2,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="body1" fontWeight="bold">
              Personal information
            </Typography>
            <Button
              variant="text"
              startIcon={<EditIcon sx={{ color: '#ef5350' }} />}
              sx={{
                textTransform: 'none',
                color: '#ef5350',
              }}
            >
            </Button>
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            <Box display={'flex'} alignItems={'center'} gap={25}>
              <Typography sx={{
                  fontSize: '14px',
                  color: '#414042'
              }}>
                Full name
              </Typography>
              <Typography  sx={{
                  fontSize: '14.5px',
                  color: '#121212',
                  fontWeight: '600'
              }}>
                {userData.name}
              </Typography>
            </Box>
            <Box display={'flex'} alignItems={'center'} gap={21}>
              <Typography sx={{
                  fontSize: '14px',
                  color: '#414042'
              }}>
                Phone number
              </Typography>
              <Typography sx={{
                  fontSize: '14.5px',
                  color: '#121212',
                  fontWeight: '600'
              }}>
                {userData.phone}
              </Typography>
            </Box>
            <Box display={'flex'} alignItems={'center'} gap={14}>
              <Typography sx={{
                  fontSize: '14px',
                  color: '#414042'
              }}>
                Preferred work location
              </Typography>
              <Typography sx={{
                  fontSize: '14.5px',
                  color: '#121212',
                  fontWeight: '600'
              }}>
                
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
              
      <Box
      mt={3}
      sx={{
        p: 3.5,
        borderRadius: 1,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Bóng nhẹ
        bgcolor: 'white',
        
      }}
    >
      {/* Tiêu đề và nút Edit */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="body1" fontWeight="bold" mb={2}>
            General Information
          </Typography>
        <Button
          variant="text"
          startIcon={<EditIcon sx={{ color: '#ef5350' }} />}
          sx={{
            textTransform: 'none',
            color: '#ef5350',
          }}
          onClick={handleOpenGeneralInfoModal}
        >
        </Button>
      </Box>


      {/* Thông tin */}
      <Box display="flex" flexDirection="column" gap={1.5}>
        <Box display={'flex'} alignItems={'center'} gap={14}>
          <Typography sx={{
                  fontSize: '14px',
                  color: '#414042'
              }}>
            Total years of experience
          </Typography>
          <Typography fontSize='15px' fontWeight="bold">
            {generalInfoData?.yearsOfExperience}
          </Typography>
        </Box>
        <Box display={'flex'} alignItems={'center'} gap={21}>
          <Typography sx={{
                  fontSize: '14px',
                  color: '#414042'
              }}>
            Current job level
          </Typography>
          <Typography fontSize='15px' fontWeight="bold">
            {generalInfoData?.currentJobLevel}
          </Typography>
        </Box>
        <Box display={'flex'} alignItems={'center'} gap={14.5}>
          <Typography sx={{
                  fontSize: '14px',
                  color: '#414042'
              }}>
            Expected working model
          </Typography>
          <Typography fontSize='15px' fontWeight="bold">
            {generalInfoData?.expectedWorkingModel}
          </Typography>
        </Box>
        
        <Box display={'flex'} alignItems={'center'} gap={21.5}>
          <Typography sx={{
                  fontSize: '14px',
                  color: '#414042'
              }}>
            Expected salary
          </Typography>
          <Typography fontSize='15px' fontWeight="bold">
            {generalInfoData?.expectedSalaryMin && generalInfoData?.expectedSalaryMin && generalInfoData?.expectedSalaryCurrency ?`${generalInfoData?.expectedSalaryMin} - ${generalInfoData?.expectedSalaryMax} ${generalInfoData?.expectedSalaryCurrency}/month` : " "}
          </Typography>
        </Box>
      </Box>

      <GeneralInformationModal
            open={generalInfoModalOpen}
            onClose={handleCloseGeneralInfoModal}
            onSave={handleSaveGeneralInfo}
          />
    </Box>
    </>
  );
};

export default ManageCV;