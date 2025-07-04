// findJobPage.jsx
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Grid, Container } from "@mui/material";
import JobSearchBar from "./index";
import JobListSidebar from "./jobListSidebar.jsx";
import JobDetailPanel from "./jobListDetailPannel";

export default function FindJobPage() {
  const [searchParams] = useSearchParams();
  const [selectedJob, setSelectedJob] = useState(null);

  // Lấy tham số từ URL
  const searchKeyword = searchParams.get("key") || "";
  const selectedCity = searchParams.get("city") || "All Cities";

  const handleJobSelect = (job) => {
    console.log("Selected job:", job);
    setSelectedJob(job);
  };

  return (
    <Box>
      {/* Search Bar */}
      <JobSearchBar />

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Grid container spacing={2} sx={{ height: "calc(100vh)" }}>
          {/* Job List Sidebar - Right */}
          <Grid item xs={12} md={5}>
            <JobListSidebar
              searchKeyword={searchKeyword}
              selectedCity={selectedCity}
              onJobSelect={handleJobSelect}
              selectedJobId={selectedJob?.id || selectedJob?._id || null}
            />
          </Grid>

          {/* Job Detail Panel - Left */}
          <Grid item xs={12} md={7}>
            {selectedJob ? (
              <JobDetailPanel job={selectedJob} />
            ) : (
              <Box sx={{ textAlign: "center", p: 2 }}>
                Please select a job to view details.
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}