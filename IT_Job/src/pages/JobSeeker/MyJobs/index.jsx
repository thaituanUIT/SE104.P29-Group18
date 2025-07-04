import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WorkOffOutlinedIcon from '@mui/icons-material/WorkOffOutlined';
// import { SvgIcon } from '@mui/icons-material/InfoOutlined';
import { ReactComponent as nodata } from '~/assets/nodatafound.svg';
import SvgIcon from '@mui/material/SvgIcon';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Divider from '@mui/material/Divider';
import { fetchJobDetails, getSavedJobDetails } from '~/apis/index'
import { useSelector } from 'react-redux'
import { selectAppliedJobs } from '../../../redux/apply/applySilce';
import { formatText, formatDate, formatPostedAgo, formatExpiresIn } from '~/utils/formatter';
import { selectCurrentUser } from '~/redux/user/userSlice';
import { useNavigate } from 'react-router-dom';


const MyJobs = () => {
  // Trạng thái cho tab đang chọn
  const currentUser = useSelector(selectCurrentUser)
  const [selectedTab, setSelectedTab] = useState(0);
    const [jobData, setJobData] = useState([])
    const [jobSaved, setJobSaved] = useState([])

  // Dữ liệu giả lập (có thể thay bằng dữ liệu từ API)
  const navigate = useNavigate()

  const idJobApplied = useSelector(selectAppliedJobs)
  const email = currentUser.email

  useEffect(() => {
    const fetchJob = async (idJobApplied) => {
      const jobData = await fetchJobDetails(idJobApplied)
      setJobData(jobData)
    }
    
    const fetchSavedJobs = async (email) => {
      const savedJobs = await getSavedJobDetails(email)
      setJobSaved(savedJobs)
    }

   if(idJobApplied)
    fetchJob(idJobApplied)

   if(email)
    fetchSavedJobs(email)
  }, [idJobApplied, email])

  console.log("heh", jobSaved)
  const getStatusStyles = (status) => {
    switch (status) {
      case 'Đang tuyển':
        return { backgroundColor: '#2e7d32', color: 'white' } // Xanh lá đậm → thể hiện "đang mở", năng động
      case 'Hết thời hạn':
        return { backgroundColor: '#c62828', color: 'white' } // Đỏ đậm → biểu thị "đóng", khẩn cấp
      default:
        return { backgroundColor: '#9e9e9e', color: 'white' } // Xám trung tính
    }
  };
  

  // Xử lý thay đổi tab
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ p: 2, mt: 3, borderRadius: 1,          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Bóng nhẹ
    }}>


      {/* Tabs */}
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        sx={{
            mb: 2,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#818285', // Màu mặc định
              '&.Mui-selected': {
                color: '#ef5350', // Màu khi tab được chọn
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#ef5350',
            },
          }}
      >
        <Tab
          label={
            <Badge
              badgeContent={jobData.length}
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: '#ef5350', // Màu đỏ cho badge
                  color: 'white',
                  fontSize: '12px',
                  minWidth: '20px',
                  height: '20px',
                },
              }}
            >
              <Box sx={{ mr: 1 }}>Applied Jobs</Box>
            </Badge>
          }
        />
        <Tab
          label={
            <Badge
              badgeContent={jobSaved.length}
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: '#ef5350', // Màu xám cho badge
                  color: 'white',
                  fontSize: '12px',
                  minWidth: '20px',
                  height: '20px',
                },
              }}
            >
              <Box sx={{ mr: 1 }}>Saved Jobs</Box>
            </Badge>
          }
        />
      </Tabs>

      {/* Thông báo về thời gian lưu trữ */}
      <Box display="flex" alignItems="center"  bgcolor={'#b6b9bf'} height={38}>
        <InfoOutlinedIcon sx={{  mr: 1, ml: 2, color: 'whitesmoke' }} fontSize="small" />
        <Typography variant="body2" sx={{color: 'whitesmoke'}}>
          Your applied jobs are stored for the last 12 months.
        </Typography>
      </Box>

      {/* Nội dung tab */}
      {selectedTab === 0 && (
        <Box sx={{ textAlign: 'center', mt: 5, mb: 2 }}>
          {jobData.length === 0 ? (
            <>
                <SvgIcon component={nodata} inheritViewBox sx={{ fontSize: '70px', ml: '20px' }} />

              <Typography fontSize={'12px'} sx={{color: '#a6a6a6', fontWeight: 'normal'}} mb={2}>
                You haven’t applied to any jobs in the last 12 months.
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  borderColor: '#ef5350', // Viền đỏ
                  color: '#ef5350', // Chữ đỏ
                  textTransform: 'none',
                  fontWeight: 'bold',
                 
                }}
              >
                Explore jobs
              </Button>
            </>
          ) : (
            // Nội dung khi có dữ liệu (có thể thêm danh sác
            jobData.map((job, index) => (
              <Box key={job._id}>
                {index > 0 && <Divider sx={{ my: 2 }} />} {/* Đường thẳng phân cách nếu có từ 2 công việc trở lên */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    borderRadius: 2,
                    transition: 'box-shadow 0.3s ease-in-out', // Hiệu ứng transition
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Bóng nhẹ khi hover
                    },
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Box
                      component="img"
                      src={job.logo}
                      alt={`${job.company} logo`}
                      sx={{ width: 75, height: 75, mr: 2, border: '1px solid #e0e0e0' }}
                    />
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="body1" fontWeight="bold">
                        {job.title}
                      </Typography>
                      <Typography variant="body2" sx={{color: '#121212', fontSize: '12px', mt:' 3px'}}>    {job.company}
                      </Typography>
                      <Typography variant="body2" sx={{color: '#a6a6a6', fontSizeL: '12px', mt: '3px'}}>
                        {job.locations.join(', ')} - {formatText(job.jobType)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box textAlign="right">
                    <Button
                      variant="contained"
                      sx={{
                        ...getStatusStyles(job.status),
                        textTransform: 'none',
                        fontWeight: 'bold',
                       
                        px: 2,
                        py: 0.5,
                      }}
                    >
                      {job.status}
                    </Button>
                  </Box>
                </Box>
              </Box>
            ))
          )}
        </Box>
      )}

      {selectedTab === 1 && (
        <Box sx={{ textAlign: 'center', mt: 5, mb:2 }}>
          {jobSaved.length === 0 ? (
            <>
                 <SvgIcon component={nodata} inheritViewBox sx={{ fontSize: '70px', ml: '20px' }} />

                 <Typography fontSize={'12px'} sx={{color: '#a6a6a6', fontWeight: 'normal'}} mb={2}>

                You haven’t saved any jobs yet.
              </Typography>
              <Button
                variant="outlined"
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
                Explore jobs
              </Button>
            </>
          ) : (
            // Nội dung khi có dữ liệu (có thể thêm danh sách công việc ở đây)
            jobSaved.map((job, index) => (
              <Box key={job.id}>
                {index > 0 && <Divider sx={{ my: 2 }} />} {/* Đường thẳng phân cách nếu có từ 2 công việc trở lên */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    borderRadius: 2,
                    transition: 'box-shadow 0.3s ease-in-out', // Hiệu ứng transition
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Bóng nhẹ khi hover
                    },
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Box
                      component="img"
                      src={job.logo}
                      alt={`${job.company} logo`}
                      sx={{ width: 75, height: 75, mr: 2, border: '1px solid #e0e0e0' }}
                    />
                    <Box textAlign={'left'}>
                      <Typography variant="body1" fontWeight="bold">
                        {job.title}
                      </Typography>
                      <Typography variant="body2" color="text.primary"  sx={{color: '#121212', fontSize: '12px', mt:' 4px'}}>
                        {job.company}
                      </Typography>
                      <Typography variant="body2" color="text.secondary"  sx={{color: '#a6a6a6', fontSize: '12px', mt:' 4px'}}>
                        {job.locations.join(', ')} - {formatText(job.jobType)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
                    <Box textAlign="right">
                      <Typography sx={{fontSize: '13px', color: '#121212'}} >
                        {formatPostedAgo(job.createdAt)}
                      </Typography>
                      <Typography sx={{fontSize: '12px', color: '#ff9119'}}>
                        {formatExpiresIn(job.deadline)}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/jobDetail?jobId=${job._id}&employerId=${job.employerId}`)}
                      sx={{
                        mt: '3px',
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
                      Apply now
                    </Button>
                  </Box>
                </Box>
              </Box>
            ))
          )}
        </Box>
      )}
    </Box>
  );
};

export default MyJobs;

//jobDetail?jobId=637&employerId=68084f842