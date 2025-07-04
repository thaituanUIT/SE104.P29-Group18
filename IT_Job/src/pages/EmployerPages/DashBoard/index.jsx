"use client";

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Paper, Chip,
  Snackbar, Alert, List, ListItem, ListItemText, ListItemIcon,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { PieChart, BarChart, LineChart } from '@mui/x-charts';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useSelector } from 'react-redux';
import { selectCurrentEmployer } from '~/redux/employer/employerSlice';

// Import API services from index.js
import {
  fetchApplicationsByEmployerIdDashBoard,
  fetchJobdByEmployerId,
  getInterviewsByJobId,
  getTestProgressByApplicationId,
} from '~/apis/index'; // Adjust path as needed

// --- Styled Components ---
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#fff',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
}));

const MetricValue = styled(Typography)(() => ({
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#333',
}));

const MetricTitle = styled('span')(() => ({
  fontSize: '0.9rem',
  color: '#666',
}));

// --- Dashboard Component ---
const EmployerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    jobs: [],
    applications: [],
    interviews: [],
    testProgress: [],
  });
  const [error, setError] = useState(null);
  const employer = useSelector(selectCurrentEmployer);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      if (!employer || !employer._id) {
        setError('Employer ID not available.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const employerId = employer._id;

        // Fetch jobs
        const jobs = await fetchJobdByEmployerId(employerId);
        // Fetch applications
        const applications = await fetchApplicationsByEmployerIdDashBoard(employerId);
        // Fetch interviews for each job
        const jobIds = jobs.map(job => job._id);
        const interviewsPromises = jobIds.map(jobId => getInterviewsByJobId(jobId));
        const interviews = (await Promise.all(interviewsPromises)).flat();
        // Fetch test progress for each application
        const testProgressPromises = applications.map(app => getTestProgressByApplicationId(app.id));
        const testProgress = (await Promise.all(testProgressPromises)).flat();

        setDashboardData({ jobs, applications, interviews, testProgress });
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employer]); // Depend on employer to re-fetch if it changes

  // Compute metrics
  const metrics = {
    totalActiveJobs: dashboardData.jobs.length,
    totalApplicants: dashboardData.applications.length,
    applicantsInInterview: (() => {
      const jobApplicantMap = new Map();
      dashboardData.interviews.forEach(interview => {
        if (!jobApplicantMap.has(interview.jobId)) {
          jobApplicantMap.set(interview.jobId, new Set());
        }
        jobApplicantMap.get(interview.jobId).add(interview.applicantId);
      });
      return Array.from(jobApplicantMap.values()).reduce((sum, set) => sum + set.size, 0);
    })(),
  };

  // Applicant Status Pie Chart Data
  const statusCounts = dashboardData.applications.reduce((acc, app) => {
    const status = app.status || 'Pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  const pieChartData = Object.entries(statusCounts).map(([label, value], index) => ({
    id: index,
    value,
    label,
  }));

  // Interview Progress Bar Chart Data
  const interviewStatusByJob = dashboardData.jobs.map(job => {
    const jobInterviews = dashboardData.interviews.filter(int => int.jobId === job._id);
    return {
      jobTitle: job.title,
      confirmed: jobInterviews.filter(int => int.status === 'Đã xác nhận').length,
      completed: jobInterviews.filter(int => int.status === 'Đã hoàn thành').length,
      cancelled: jobInterviews.filter(int => int.status === 'Chờ xác nhận').length,
    };
  });

  // Applicants Over Time Line Chart Data
  const startDate = dashboardData.applications.length > 0
    ? new Date(Math.min(...dashboardData.applications.map(app => {
        const [day, month, year] = app.appliedDate.split('/');
        return new Date(`${year}-${month}-${day}`);
      })))
    : new Date();
  const endDate = dashboardData.applications.length > 0
    ? new Date(Math.max(...dashboardData.applications.map(app => {
        const [day, month, year] = app.appliedDate.split('/');
        return new Date(`${year}-${month}-${day}`);
      })))
    : new Date();
  const dates = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }

  const lineChartData = dates.map(date => ({
    date: new Date(date),
    count: dashboardData.applications.filter(app => {
      const [day, month, year] = app.appliedDate.split('/');
      const appDate = new Date(`${year}-${month}-${day}`).toISOString().split('T')[0];
      return appDate === date.toISOString().split('T')[0];
    }).length,
  }));


  const lineChartSeries = [{
    data: lineChartData.map(d => d.count),
    label: 'Applicants',
  }];


  // Recent Interviews
  const recentInterviews = dashboardData.interviews
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
    .map(int => ({
      ...int,
      applicantName: dashboardData.applications.find(app => app.id === int.applicantId)?.name || 'Unknown', // Adjusted to 'name' based on your data
      jobTitle: dashboardData.jobs.find(job => job._id === int.jobId)?.title || 'Unknown',
    }));

    console.log(dashboardData.applications)

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5' }}>
      <Typography variant="h4" gutterBottom>
        Employer Dashboard
      </Typography>

      {/* Error Snackbar */}
      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Metrics Grid */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <StyledPaper>
                <WorkIcon sx={{ fontSize: 40, color: '#2196F3' }} />
                <MetricValue>{metrics.totalActiveJobs}</MetricValue>
                <MetricTitle>Active Jobs</MetricTitle>
              </StyledPaper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StyledPaper>
                <PeopleIcon sx={{ fontSize: 40, color: '#4CAF50' }} />
                <MetricValue>{metrics.totalApplicants}</MetricValue>
                <MetricTitle>Total Applicants</MetricTitle>
              </StyledPaper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StyledPaper>
                <HourglassEmptyIcon sx={{ fontSize: 40, color: '#FFC107' }} />
                <MetricValue>{metrics.applicantsInInterview}</MetricValue>
                <MetricTitle>In Interview</MetricTitle>
              </StyledPaper>
            </Grid>
          </Grid>

          {/* Charts Grid */}
          <Grid container spacing={3}>
            {/* Applicant Status Pie Chart */}
            <Grid item xs={12} md={6}>
              <StyledPaper>
                <Typography variant="h6" gutterBottom>
                  Applicant Status Distribution
                </Typography>
                {pieChartData.length > 0 ? (
                  <PieChart
                    series={[{ data: pieChartData }]}
                    width={400}
                    height={200}
                  />
                ) : (
                  <Typography>No applicant status data to display.</Typography>
                )}
              </StyledPaper>
            </Grid>

            {/* Interview Progress Bar Chart */}
            <Grid item xs={12} md={6}>
              <StyledPaper>
                <Typography variant="h6" gutterBottom>
                  Interview Progress by Job
                </Typography>
                {interviewStatusByJob.length > 0 ? (
                  <BarChart
                    xAxis={[{ scaleType: 'band', data: interviewStatusByJob.map(j => j.jobTitle) }]}
                    series={[
                      { data: interviewStatusByJob.map(j => j.confirmed), label: 'Confirmed' },
                      { data: interviewStatusByJob.map(j => j.completed), label: 'Completed' },
                      { data: interviewStatusByJob.map(j => j.cancelled), label: 'Wait for confirmation' },
                    ]}
                    width={480}
                    height={200}
                  />
                ) : (
                  <Typography>No interview progress data to display.</Typography>
                )}
              </StyledPaper>
            </Grid>

            {/* Applicants Over Time Line Chart */}
            <Grid item xs={12}>
              <StyledPaper>
                <Typography variant="h6" gutterBottom>
                  Applicants Over Time
                </Typography>
                {lineChartData.length > 0 && lineChartSeries[0].data.some(count => count > 0) ? (
                  <LineChart
                    xAxis={[{ data: dates.map(d => new Date(d)), scaleType: 'time' }]}
                    series={lineChartSeries}
                    width={800}
                    height={300}
                  />
                ) : (
                  <Typography>No application data to display over time.</Typography>
                )}
              </StyledPaper>
            </Grid>

            {/* Recent Interviews */}
            <Grid item xs={12}>
              <StyledPaper>
                <Typography variant="h6" gutterBottom>
                  Recent Interviews
                </Typography>
                {recentInterviews.length > 0 ? (
                  <List>
                    {recentInterviews.map(int => (
                      <ListItem key={int._id}>
                        <ListItemIcon>
                          <EventNoteIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${int.applicantName} - ${int.jobTitle}`}
                          secondary={`Date: ${new Date(int.date).toLocaleDateString('en-GB')} | Status: ${int.status}`}
                        />
                        <Chip label={int.status} color={int.status === 'Đã hoàn thành' ? 'success' : 'default'} />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography>No recent interviews to display.</Typography>
                )}
              </StyledPaper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default EmployerDashboard;