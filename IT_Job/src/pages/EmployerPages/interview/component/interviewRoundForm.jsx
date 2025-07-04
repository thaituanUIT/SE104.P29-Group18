// src/components/interview-management/InterviewRoundForm.jsx
import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, TextField, Grid, Divider, DialogTitle, DialogContent, DialogActions
} from "@mui/material";

const InterviewRoundForm = ({ job, onClose, onSave, title }) => {
  const [formData, setFormData] = useState({
    name: "",
    order: (job?.interviewRounds ? Math.max(0, ...job.interviewRounds.map(r => r.order)) + 1 : 1),
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      order: (job?.interviewRounds ? Math.max(0, ...job.interviewRounds.map(r => r.order)) + 1 : 1)
    }));
  }, [job]);

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
            Vị trí: {job?.title}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Tên vòng phỏng vấn"
              fullWidth
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              placeholder="Ví dụ: Vòng 1: Phỏng vấn kỹ thuật"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Thứ tự"
              type="number"
              fullWidth
              value={formData.order}
              onChange={(e) => handleChange("order", Number.parseInt(e.target.value))}
              InputProps={{ inputProps: { min: 1 } }}
              helperText="Thứ tự vòng phỏng vấn trong quy trình"
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

export default InterviewRoundForm;