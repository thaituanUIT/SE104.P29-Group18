// src/components/interview-management/EvaluationForm.jsx
import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, TextField, MenuItem, Select, FormControl, InputLabel, Grid, Divider,
  DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { StyledRating } from "./styleComponent"; // Import StyledRating
import AddIcon from "@mui/icons-material/Add";
import StarIcon from "@mui/icons-material/Star";

const EvaluationForm = ({ interview, applicant, job, round, onClose, onSave, isOverallEvaluation = false }) => {
  // State for specific interview evaluation fields
  const [evaluation, setEvaluation] = useState({
    result: interview?.evaluation?.result || "Đạt",
    strengths: interview?.evaluation?.strengths || "",
    weaknesses: interview?.evaluation?.weaknesses || "",
    comments: interview?.evaluation?.comments || "",
  });

  // State for overall applicant evaluation specific fields
  const [overallFormData, setOverallFormData] = useState({
    currentOverallStatus: applicant?.currentOverallStatus || "Đang đánh giá",
    skills: [...(applicant?.skills || [])],
    overallNotes: applicant?.overallNotes || "",
  });

  useEffect(() => {
    if (isOverallEvaluation && applicant) {
      setOverallFormData({
        currentOverallStatus: applicant.currentOverallStatus || "Đang đánh giá",
        skills: [...(applicant.skills || [])],
        overallNotes: applicant.overallNotes || "",
      });
    } else if (interview) {
      setEvaluation({
        result: interview.evaluation?.result || "Đạt",
        strengths: interview.evaluation?.strengths || "",
        weaknesses: interview.evaluation?.weaknesses || "",
        comments: interview.evaluation?.comments || "",
      });
    }
  }, [interview, applicant, isOverallEvaluation]);

  const handleChange = (field, value) => {
    if (isOverallEvaluation) {
      setOverallFormData((prev) => ({ ...prev, [field]: value }));
    } else {
      setEvaluation((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSkillChange = (index, field, value) => {
    const updatedSkills = [...overallFormData.skills];
    updatedSkills[index][field] = value;
    setOverallFormData((prevState) => ({
      ...prevState,
      skills: updatedSkills,
    }));
  };

  const handleAddSkill = () => {
    setOverallFormData((prevState) => ({
      ...prevState,
      skills: [...prevState.skills, { name: "", rating: 1 }],
    }));
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = [...overallFormData.skills];
    updatedSkills.splice(index, 1);
    setOverallFormData((prevState) => ({
      ...prevState,
      skills: updatedSkills,
    }));
  };

  const handleSubmit = () => {
    if (isOverallEvaluation) {
      onSave(overallFormData);
    } else {
      onSave({ evaluation: evaluation });
    }
  };

  return (
    <>
      <DialogTitle>{isOverallEvaluation ? "Đánh giá Tổng quan Ứng viên" : "Đánh giá Phỏng vấn"}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2, mt: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Ứng viên: {applicant.name}
          </Typography>
          <Typography variant="body2">
            Vị trí: {job?.title}
            {!isOverallEvaluation && round && ` | Vòng: ${round?.name}`}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {isOverallEvaluation ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="overall-status-select-label">Trạng thái Tổng quan</InputLabel>
                <Select
                  labelId="overall-status-select-label"
                  id="overall-status-select"
                  value={overallFormData.currentOverallStatus}
                  label="Trạng thái Tổng quan"
                  onChange={(e) => handleChange("currentOverallStatus", e.target.value)}
                >
                  <MenuItem value="Đạt">Đạt</MenuItem>
                  <MenuItem value="Không đạt">Không đạt</MenuItem>
                  <MenuItem value="Đang đánh giá">Đang đánh giá</MenuItem>
                  <MenuItem value="Chờ phỏng vấn">Chờ phỏng vấn</MenuItem>
                  <MenuItem value="Chờ làm test">Chờ làm test</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Kỹ năng:</Typography>
              {overallFormData.skills.map((skill, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <TextField
                    label="Tên kỹ năng"
                    value={skill.name}
                    onChange={(e) => handleSkillChange(index, "name", e.target.value)}
                    size="small"
                    sx={{ flexGrow: 1 }}
                  />
                  <StyledRating
                    value={skill.rating}
                    onChange={(e, newValue) => handleSkillChange(index, "rating", newValue)}
                    icon={<StarIcon fontSize="inherit" />}
                  />
                  <Button onClick={() => handleRemoveSkill(index)} size="small" color="error">
                    Xóa
                  </Button>
                </Box>
              ))}
              <Button onClick={handleAddSkill} variant="outlined" size="small" startIcon={<AddIcon />}>
                Thêm kỹ năng
              </Button>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Ghi chú tổng quan"
                fullWidth
                multiline
                rows={4}
                value={overallFormData.overallNotes}
                onChange={(e) => handleChange("overallNotes", e.target.value)}
              />
            </Grid>
          </Grid>
        ) : (
          // Standard interview evaluation fields
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Kết quả đánh giá</InputLabel>
                <Select
                  value={evaluation.result}
                  label="Kết quả đánh giá"
                  onChange={(e) => handleChange("result", e.target.value)}
                >
                  <MenuItem value="Đạt">Đạt</MenuItem>
                  <MenuItem value="Không đạt">Không đạt</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Điểm mạnh"
                fullWidth
                multiline
                rows={2}
                value={evaluation.strengths}
                onChange={(e) => handleChange("strengths", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Điểm yếu"
                fullWidth
                multiline
                rows={2}
                value={evaluation.weaknesses}
                onChange={(e) => handleChange("weaknesses", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nhận xét & Đề xuất"
                fullWidth
                multiline
                rows={3}
                value={evaluation.comments}
                onChange={(e) => handleChange("comments", e.target.value)}
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Lưu đánh giá
        </Button>
      </DialogActions>
    </>
  );
};

export default EvaluationForm;