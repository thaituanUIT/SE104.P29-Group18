// src/components/interview-management/InterviewManagementDashboard.jsx
"use client"; // Required for Next.js App Router

import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import JobCard from './JobCard'; // Import JobCard component

const InterviewManagementDashboard = ({ jobs, applicants, setSelectedJob }) => {

  return (
    <Box mt={5}>

      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid item xs={12} sm={6} md={4} key={job.id}>
            <JobCard job={job} onClick={() => setSelectedJob(job)} applicants={applicants} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default InterviewManagementDashboard;