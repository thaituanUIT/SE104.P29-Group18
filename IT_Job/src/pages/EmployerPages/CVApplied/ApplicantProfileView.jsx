"use client"
import { Box, Card, CardContent, Avatar, Typography, Stack, IconButton, Grid, Divider, Link } from "@mui/material"
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import PhoneIcon from "@mui/icons-material/Phone"
import CakeIcon from "@mui/icons-material/Cake"
import WcIcon from "@mui/icons-material/Wc"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import LinkIcon from "@mui/icons-material/Link"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"

const ApplicantProfileView = ({ applicant, onClose }) => {
  if (!applicant) return null

  return (
    <Box sx={{ p: 3, bgcolor: "white", height: "100vh", overflowY: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <IconButton onClick={onClose}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          Hồ sơ ứng viên
        </Typography>
        <Box width={40} /> {/* Empty box for alignment */}
      </Box>

      {/* Personal Information */}
      <Box mt={3}>
        <Card
          sx={{
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <CardContent>
            <Stack direction="row" spacing={5} alignItems="center" mb={4} ml={4} mt={1}>
              <Avatar src={applicant.avatar} sx={{ width: 80, height: 80 }} />
              <Box>
                <Typography sx={{ fontSize: "24px" }} fontWeight="bold">
                  {applicant.name}
                </Typography>
                <Typography sx={{ fontWeight: "bold", color: "#a6a6a6" }}>{applicant.title || "Job Seeker"}</Typography>
              </Box>
            </Stack>

            <Grid container spacing={4} ml={1.5} sx={{ color: "#a6a6a6" }}>
              <Grid item xs={12} sm={4}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <MailOutlineIcon fontSize="small" />
                  <Typography>{applicant.email}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PhoneIcon fontSize="small" />
                  <Typography>{applicant.phone}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CakeIcon fontSize="small" />
                  <Typography>{applicant.dob || "N/A"}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <WcIcon fontSize="small" />
                  <Typography>{applicant.gender || "N/A"}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LocationOnIcon fontSize="small" />
                  <Typography>{applicant.address || "N/A"}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LinkIcon fontSize="small" />
                  <Typography>{applicant.personalLink || "N/A"}</Typography>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Education */}
      <Box mt={2}>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" ml={"36px"}>
              <Typography variant="h6" fontWeight="bold">
                Education
              </Typography>
            </Box>

            {applicant.education && applicant.education.length > 0 ? (
              <>
                <Divider sx={{ my: 1, ml: 4 }} />
                {applicant.education.map((item, index) => (
                  <Box key={index} mt={2}>
                    {index > 0 && <Divider sx={{ my: 2, ml: 4 }} />}
                    <Box>
                      <Typography sx={{ ml: "36px", mt: "5px", color: "#414042" }} fontSize={"16px"} fontWeight="bold">
                        {item.major}
                      </Typography>
                      <Typography sx={{ ml: "36px", mt: "5px", color: "#414042" }} variant="body2" color="text.primary">
                        {item.school}
                      </Typography>
                      <Typography
                        sx={{ ml: "36px", mt: "5px", color: "#414042" }}
                        variant="body2"
                        color="text.secondary"
                      >
                        {item.isCurrentlyStudying
                          ? `${item.fromMonth}/${item.fromYear} - NOW`
                          : `${item.fromMonth}/${item.fromYear} - ${item.toMonth}/${item.toYear}`}
                      </Typography>
                      <Typography
                        sx={{ ml: "36px", mt: "5px", color: "#414042" }}
                        variant="body2"
                        color="text.secondary"
                      >
                        {item.additionalDetails}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ color: "#a6a6a6", ml: "36px" }}>
                No education information provided
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Experience */}
      <Box mt={2}>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" ml={"36px"}>
              <Typography variant="h6" fontWeight="bold">
                Experience
              </Typography>
            </Box>

            {applicant.experience && applicant.experience.length > 0 ? (
              <>
                <Divider sx={{ my: 1, ml: 4 }} />
                {applicant.experience.map((item, index) => (
                  <Box key={index} mt={2}>
                    {index > 0 && <Divider sx={{ my: 2, ml: 4 }} />}
                    <Box>
                      <Typography sx={{ ml: "36px", mt: "6px", color: "#414042" }} fontSize={"16px"} fontWeight="bold">
                        {item.jobTitle}
                      </Typography>
                      <Typography sx={{ ml: "36px", mt: "6px", color: "#414042" }} variant="body2" color="text.primary">
                        {item.company}
                      </Typography>
                      <Typography
                        sx={{ ml: "36px", mt: "6px", color: "#414042" }}
                        variant="body2"
                        color="text.secondary"
                      >
                        {item.isCurrentlyWorking
                          ? `${item.fromMonth}/${item.fromYear} - NOW`
                          : `${item.fromMonth}/${item.fromYear} - ${item.toMonth}/${item.toYear}`}
                      </Typography>
                      <Typography
                        sx={{ ml: "36px", mt: "6px", color: "#414042" }}
                        variant="body2"
                        color="text.secondary"
                      >
                        {item.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ color: "#a6a6a6", ml: "36px" }}>
                No experience information provided
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Certificates */}
      <Box mt={2} mb={4}>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" ml={"36px"}>
              <Typography variant="h6" fontWeight="bold">
                Certificate
              </Typography>
            </Box>

            {applicant.certificates && applicant.certificates.length > 0 ? (
              <>
                <Divider sx={{ my: 1, ml: 4 }} />
                {applicant.certificates.map((item, index) => (
                  <Box key={index} mt={2}>
                    {index > 0 && <Divider sx={{ my: 2, ml: 4 }} />}
                    <Box>
                      <Typography sx={{ ml: "36px", mt: "6px", color: "#414042" }} fontSize={"16px"} fontWeight="bold">
                        {item.certificateName}
                      </Typography>
                      <Typography sx={{ ml: "36px", mt: "6px", color: "#414042" }} variant="body2" color="text.primary">
                        {item.organization}
                      </Typography>
                      <Typography
                        sx={{ ml: "36px", mt: "6px", color: "#414042" }}
                        variant="body2"
                        color="text.secondary"
                      >
                        {`${item.issueMonth}/${item.issueYear}`}
                      </Typography>
                      <Typography
                        sx={{ ml: "36px", mt: "6px", color: "#414042" }}
                        variant="body2"
                        color="text.secondary"
                      >
                        {item.description}
                      </Typography>
                      {item.certificateURL && (
                        <Link
                          href={item.certificateURL}
                          target="_blank"
                          rel="noopener"
                          sx={{
                            ml: "36px",
                            mt: "5px",
                            color: "#1976d2",
                            display: "inline-flex",
                            alignItems: "center",
                            textDecoration: "none",
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                        >
                          Certificate Link
                          <OpenInNewIcon sx={{ ml: "6px" }} />
                        </Link>
                      )}
                    </Box>
                  </Box>
                ))}
              </>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ color: "#a6a6a6", ml: "36px" }}>
                No certificate information provided
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default ApplicantProfileView
