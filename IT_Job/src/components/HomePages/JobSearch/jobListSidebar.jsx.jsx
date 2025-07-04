"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemButton,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Divider
} from "@mui/material";
import {
  LocationOn as LocationOnIcon,
  AttachMoney as MoneyIcon,
  Search as SearchIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import { getJobsWithFiltersAPI } from "~/apis/index"; // Import trực tiếp từ /apis/index

const JobListSidebar = ({ searchKeyword, selectedCity, onJobSelect, selectedJobId }) => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [localSearch, setLocalSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Fetch jobs from API when component mounts or filters change
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const filters = {
          skills: searchKeyword,
          city: selectedCity !== "All Cities" ? selectedCity : undefined,
          sortBy,
          page,
          limit,
        };
        const { jobs: fetchedJobs, totalJobs } = await getJobsWithFiltersAPI(filters); // Sử dụng API trực tiếp
        setJobs(fetchedJobs);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [searchKeyword, selectedCity, sortBy, page, limit]);

  // Filter and sort jobs based on local search
  useEffect(() => {
    let filtered = [...jobs];
    if (localSearch) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(localSearch.toLowerCase()) ||
          job.companyName.toLowerCase().includes(localSearch.toLowerCase()) ||
          job.skills.some((skill) => skill.toLowerCase().includes(localSearch.toLowerCase()))
      );
    }
    setFilteredJobs(filtered);
  }, [localSearch, jobs]);

  // Auto-select first job when jobs change
  useEffect(() => {
    if (filteredJobs.length > 0 && !selectedJobId) {
      onJobSelect(filteredJobs[0]);
    }
  }, [filteredJobs, selectedJobId, onJobSelect]);

  const formatSalary = (salary) => {
    return salary ? `${salary.min} - ${salary.max} ${salary.currency || "USD"}` : "N/A";
  };

  if (loading) {
    return (
      <Paper sx={{ height: "calc(100vh)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="h6">Loading jobs...</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ height: "calc(100vh)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Tìm thấy {filteredJobs.length} công việc
        </Typography>

        {/* Local search */}
        <TextField
          fullWidth
          size="small"
          placeholder="Tìm kiếm trong kết quả..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {/* Sort */}
        <FormControl fullWidth size="small">
          <InputLabel>Sắp xếp theo</InputLabel>
          <Select value={sortBy} label="Sắp xếp theo" onChange={(e) => setSortBy(e.target.value)}>
            <MenuItem value="newest">Mới nhất</MenuItem>
            <MenuItem value="salary_high">Lương cao nhất</MenuItem>
            <MenuItem value="applicants">Ít ứng viên nhất</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Job list */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <List sx={{ p: 0 }}>
          {filteredJobs.map((job, index) => (
            <ListItem key={job._id} disablePadding>
              <ListItemButton
                selected={selectedJobId === job._id}
                onClick={() => onJobSelect(job)}
                sx={{
                  p: 3,
                  borderBottom: index < filteredJobs.length - 1 ? 1 : 0,
                  borderColor: "divider",
                  "&.Mui-selected": {
                    backgroundColor: "#e3f2fd",
                    borderLeft: "4px solid #1976d2",
                  },
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <Box sx={{ width: "100%" }}>
                  {/* 1. Tên job */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Typography variant="body1" fontWeight="bold" sx={{ lineHeight: 1.3, flex: 1, pr: 1 }}>
                      {job.title}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      {job.isHot && (
                        <Chip
                          label="HOT"
                          size="small"
                          sx={{ backgroundColor: "#ff4444", color: "white", fontSize: "10px", height: 20 }}
                        />
                      )}
                      {job.isUrgent && (
                        <Chip
                          label="URGENT"
                          size="small"
                          sx={{ backgroundColor: "#ff5722", color: "white", fontSize: "10px", height: 20 }}
                        />
                      )}
                    </Box>
                  </Box>

                  {/* 2. Logo công ty + tên công ty */}
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar src={job.logo} alt={job.companyName} sx={{ width: 38, height: 38, mr: 1.5 }} />
                    <Typography variant="body2" color="text.secondary" fontWeight="medium">
                      {job.companyName}
                    </Typography>
                  </Box>

                  {/* 3. Mức lương */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#4caf50",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <MoneyIcon fontSize="small" sx={{ mr: 0.5 }} />
                      {formatSalary(job.salary)}
                    </Typography>
                  </Box>

                  {/* 4. Đường kẻ mờ */}
                  <Divider sx={{ my: 2, opacity: 0.5 }} />

                  {/* 5. Vị trí (level) */}
                  <Box sx={{ mb: 1.5 }}>
                    <Typography variant="body2" sx={{ display: "flex", alignItems: "center", fontWeight: "medium" }}>
                      <WorkIcon fontSize="small" sx={{ mr: 0.5, color: "text.secondary" }} />
                      {job.position || "N/A"}
                    </Typography>
                  </Box>

                  {/* 6. Loại hình công việc + địa điểm */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, flexWrap: "wrap" }}>
                    <Typography variant="body2" color="text.secondary">
                      <BusinessIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: "middle" }} />
                      {job.workplace}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <LocationOnIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: "middle" }} />
                      {job.location || "N/A"}
                    </Typography>
                  </Box>

                  {/* 7. Skills */}
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {job.skills.slice(0, 4).map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: "11px",
                          height: 22,
                          borderColor: "#1976d2",
                          color: "#1976d2",
                          "&:hover": {
                            backgroundColor: "#e3f2fd",
                          },
                        }}
                      />
                    ))}
                    {job.skills.length > 4 && (
                      <Chip
                        label={`+${job.skills.length - 4}`}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: "11px",
                          height: 22,
                          borderColor: "#757575",
                          color: "#757575",
                        }}
                      />
                    )}
                  </Box>

                  {job.acceptFresher && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#2196f3",
                        mt: 2,
                        display: "block",
                        fontSize: "12px",
                      }}
                    >
                      👨‍🎓 Fresher Accepted
                    </Typography>
                  )}
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default JobListSidebar;