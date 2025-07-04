import { useEffect, useState } from "react"
import ApplyAndJD from "~/components/JobDetail/applyAndJD"
import CompanyInfoBoard from "~/components/JobDetail/companyInfoBoard"
import Footer from "~/components/HomePages/Footer"
import CustomeAppBar from "~/components/AppBar/AppBar/AppBar.jsx"
import { Box, Divider, Grid } from "@mui/material"
import { useLocation } from "react-router-dom"
import { getJobByIdAPI, getEmployerByIdAPI } from "~/apis"
import { toast } from "react-toastify"
import PageLoading from "~/components/Loading/PageLoading"
import { selectCurrentUser } from "~/redux/user/userSlice"
import { fetchAppliedJobs, selectAppliedJobs, selectApplyLoading, selectApplyError
  
 } from "~/redux/apply/applySilce"
 import { useSelector, useDispatch } from 'react-redux';


function useQuery() {
  return new URLSearchParams(useLocation().search)
}

function JobDetail() {
 
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const query = useQuery()
  const jobId = query.get('jobId')
  const employerId = query.get('employerId')
  const [jobData, setJobData] = useState(null)
  const [employerData, setEmployerData] = useState(null)
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const appliedJobs = useSelector(selectAppliedJobs);
  const applyLoading = useSelector(selectApplyLoading);

  console.log("jobId:", jobId)
console.log("employerId:", employerId)


  useEffect(() => {
    const fetchJob = async () => {
      try {

        const [job, employer] = await Promise.all([
          getJobByIdAPI(jobId),
          getEmployerByIdAPI(employerId)
        ])
        setEmployerData(employer)
        setJobData(job)


        
      } catch (err) {
        toast.error("Lỗi khi lấy dữ liệu công việc.")
      } 
    }
    if (jobId && employerId) fetchJob()

    if (currentUser?.email) {
      dispatch(fetchAppliedJobs(currentUser.email))
    }
  }, [jobId, employerId, currentUser, dispatch])

  const hasApplied = appliedJobs.some((job) => job.toString() === jobId);

  if(!jobData || !employerData)
    return <PageLoading caption={'Loading detail job'}/>

  return (
    <Box
      sx={{
        background: `linear-gradient(to right, #1f1e1e 55%, #911625 100%)top, #f5f5f5 bottom`,
        backgroundSize: "100% 15%, 100% 85%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <CustomeAppBar />
      <Box marginTop={7.5}>
        <Divider sx={{ backgroundColor: "#f5f5f5" }} />
        <Grid container spacing={2} paddingX={16} marginBottom={5}>
          <ApplyAndJD job={jobData} companyData={employerData} hasApplied={hasApplied}
            applyLoading={applyLoading}/>
          <CompanyInfoBoard companyData={employerData} employerId={employerId}/>
        </Grid>
      </Box>
      <Footer />
    </Box>
  )
}

export default JobDetail
