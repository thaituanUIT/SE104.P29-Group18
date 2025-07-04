// src/components/interview-management/InterviewForm.jsx
import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, TextField, MenuItem, Select, FormControl, InputLabel, Grid, Divider,
  DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import viLocale from "date-fns/locale/vi";

const InterviewForm = ({ interview = null, applicant, job, round, onClose, onSave, title }) => {
  const [formData, setFormData] = useState({
    date: new Date(),
    type: "Online",
    platform: "",
    link: "",
    location: "",
    interviewers: [],
    notes: "",
  });

  useEffect(() => {
    if (interview) {
      setFormData({
        date: interview.date,
        type: interview.type,
        platform: interview.platform || "",
        link: interview.link || "",
        location: interview.location || "",
        interviewers: interview.interviewers || [],
        notes: interview.notes || "",
      });
    } else {
        setFormData({
            date: new Date(),
            type: "Online",
            platform: "",
            link: "",
            location: "",
            interviewers: [],
            notes: "",
        });
    }
  }, [interview]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2, mt: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Ứng viên: {applicant.name}
          </Typography>
          <Typography variant="body2">
            Email: {applicant.email} 
          </Typography>
          <Typography variant="body2">
            Vị trí: {job?.title} | Vòng: {round?.name}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
              <DateTimePicker
                label="Thời gian phỏng vấn"
                value={formData.date}
                onChange={(newValue) => handleChange("date", newValue)}
                renderInput={(params) => <TextField {...params} fullWidth required />}
                sx={{ width: "100%" }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Hình thức phỏng vấn</InputLabel>
              <Select
                value={formData.type}
                label="Hình thức phỏng vấn"
                onChange={(e) => handleChange("type", e.target.value)}
              >
                <MenuItem value="Online">Online</MenuItem>
                <MenuItem value="Offline">Offline</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {formData.type === "Online" ? (
            <>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Nền tảng</InputLabel>
                  <Select
                    value={formData.platform}
                    label="Nền tảng"
                    onChange={(e) => handleChange("platform", e.target.value)}
                  >
                    <MenuItem value="Google Meet">Google Meet</MenuItem>
                    <MenuItem value="Zoom">Zoom</MenuItem>
                    <MenuItem value="Microsoft Teams">Microsoft Teams</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Link phỏng vấn"
                  fullWidth
                  value={formData.link}
                  onChange={(e) => handleChange("link", e.target.value)}
                />
              </Grid>
            </>
          ) : (
            <Grid item xs={12}>
              <TextField
                label="Địa điểm phỏng vấn"
                fullWidth
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField
              label="Người phỏng vấn (phân cách bằng dấu phẩy)"
              fullWidth
              value={formData.interviewers.join(", ")}
              onChange={(e) => handleChange("interviewers", e.target.value.split(", ").filter(i => i.trim() !== ""))}
              placeholder="VD: Nguyễn Văn A, Trần Thị B"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Ghi chú"
              fullWidth
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Lưu
        </Button>
      </DialogActions>
    </>
  );
};

export default InterviewForm;