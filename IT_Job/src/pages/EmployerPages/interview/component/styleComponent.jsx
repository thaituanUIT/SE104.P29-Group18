// src/components/common/StyledComponents.jsx
import { TableCell, Rating } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.common.white,
}));

export const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#1976d2",
  },
});