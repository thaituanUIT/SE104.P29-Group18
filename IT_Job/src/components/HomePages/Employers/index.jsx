"use client"

import { CardMedia, Typography, Avatar, Box, IconButton, styled, Paper, Link, CircularProgress } from "@mui/material"
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"
import BookmarkIcon from "@mui/icons-material/Bookmark"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { getNewJobsAPI, getEmployer } from "~/apis/index"; // Adjust path as needed
import PageLoading from "~/components/Loading/PageLoading"

// Styled components
const MainContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  maxWidth: 800,
  margin: "auto",
  paddingBottom: 80,
  marginTop: 20
}))

const BackgroundContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "95%",
  maxWidth: 750,
  margin: "auto",
  borderRadius: 8,
  overflow: "hidden",
  boxShadow: "0 8px 40px rgba(0, 0, 0, 0.12)",
}))

const OverlayCard = styled(Paper)(({ theme }) => ({
  position: "absolute",
  width: "83.33%",
  left: "50%",
  top: "85%",
  transform: "translate(-50%, -50%)",
  borderRadius: 8,
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
  backgroundColor: "white",
  padding: theme.spacing(3),
  display: "flex",
  alignItems: "center",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  zIndex: 10,
  "&:hover": {
    boxShadow: "0 15px 40px rgba(0, 0, 0, 0.2)",
    transform: "translate(-50%, -50%) translateY(-5px)",
  },
}))

const CompanyLogo = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  border: "3px solid white",
  backgroundColor: "white",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
}))

const StyledLink = styled(Link)(({ theme }) => ({
  color: "#f87760",
  textDecoration: "none",
  fontWeight: 500,
  fontSize: "0.875rem",
  display: "flex",
  alignItems: "center",
  transition: "all 0.2s ease",
  cursor: "pointer",
  "&:hover": {
    textDecoration: "underline",
    color: "#fa3310",
  },
}))

export default function CompanyProfileCard() {
  const [companies, setCompanies] = useState([]);
  const [bookmarks, setBookmarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch companies from API
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);

        // Step 1: Fetch new jobs
        const jobs = await getNewJobsAPI();
        console.log("Jobs Response:", jobs);

        // Step 2: Extract unique employers from jobs
        const employerMap = new Map();
        for (const job of jobs) {
          const employerId = job.employerId;
          if (employerId && !employerMap.has(employerId)) {
            employerMap.set(employerId, { employerId, jobCount: 1 });
          } else if (employerId) {
            employerMap.get(employerId).jobCount += 1;
          }
        }

        // Limit to 5 unique employers
        const uniqueEmployers = Array.from(employerMap.values()).slice(0, 5);
        if (uniqueEmployers.length === 0) {
          throw new Error("No employers found in job data.");
        }

        // Step 3: Fetch details for each employer
        
          const employer = await getEmployer();
         
      

   
    

        setCompanies(employer);
      } catch (err) {
        setError("Failed to load companies: " + err.message);
        console.error("Error fetching companies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const toggleBookmark = (companyId) => {
    setBookmarks((prev) => ({
      ...prev,
      [companyId]: !prev[companyId],
    }));
  };

  if (!companies)
    return <PageLoading caption={"Loading..."}/>

  console.log(companies)

  return (
    <Box sx={{ paddingBottom: 5, textAlign: 'center' }}>
      <Typography variant="h4" fontWeight="bold" sx={{ padding: '30px 0 30px 0', color: "black" }}>
        Top Company ✨
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : companies.length === 0 ? (
        <Typography>No companies available.</Typography>
      ) : (
        <Swiper
          spaceBetween={20}
          centeredSlides={true}
          slidesPerView={1}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          modules={[Autoplay, Pagination, Navigation]}
          style={{ width: "100%", paddingBottom: 40 }}
        >
          {companies.map((company) => (
            <SwiperSlide key={company.id}>
              <MainContainer>
                <BackgroundContainer>
                  <CardMedia
                    component="img"
                    height="240"
                    image={company.backgroundURL}
                    alt={`${company.companyName} team photo`}
                    sx={{
                      filter: "brightness(0.9)",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "50%",
                      background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
                    }}
                  />
                </BackgroundContainer>

                <OverlayCard elevation={6}>
                  <Box sx={{ mr: 3 }}>
                    <CompanyLogo
                      src={company.logoURL}
                      alt={`${company.companyName} Logo`}
                    />
                  </Box>

                  <Box sx={{ flex: 1, textAlign: "left" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                      <Box>
                        <Typography
                          variant="h5"
                          component="div"
                          fontWeight="bold"
                          sx={{
                            color: "#333",
                            mb: 0.5,
                            fontSize: { xs: "1.1rem", sm: "1.3rem" },
                          }}
                        >
                          {company.companyName}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "text.secondary",
                            fontWeight: 500,
                            fontSize: "0.85rem",
                          }}
                        >
                          {company.industry}
                        </Typography>
                      </Box>

                      <IconButton
                        aria-label="bookmark"
                        onClick={() => toggleBookmark(company.id)}
                        sx={{
                          color: bookmarks[company.id] ? "#f87760" : "text.secondary",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "scale(1.1)",
                            color: bookmarks[company.id] ? "#f87760" : "#fa3310",
                          },
                        }}
                      >
                        {bookmarks[company.id] ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                      </IconButton>
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        mb: 2,
                        lineHeight: 1.5,
                        fontSize: "0.85rem",
                        display: { xs: "none", sm: "block" },
                      }}
                    >
                      {company.companyTitle}
                    </Typography>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                      <StyledLink href="#" underline="hover">
                        {company.jobCount} vị trí tuyển dụng
                        <ChevronRightIcon sx={{ ml: 0.5, fontSize: "1rem" }} />
                      </StyledLink>
                    </Box>
                  </Box>
                </OverlayCard>
              </MainContainer>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </Box>
  );
}