import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import apiFunctions from "./global/GlobalFunction";
import { API_URL, BASE_URL } from "./global/Constant";
import Toast from "./Toast";
import { Button, Typography, Paper } from "@mui/material";
import axios from "axios";

const DetailPage = () => {
  const [searchparams] = useSearchParams();
  let id = searchparams.get("id");
  const [singleRow, setSingleRow] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const request = axios.CancelToken.source();
    getDetailById(request, id);
    return () => request.cancel();
  }, []);

  const getDetailById = async (request, id) => {
    try {
      const getDetailById = await apiFunctions.GET_REQUEST(
        BASE_URL + API_URL.GET_SINGLE_ROW_BY_ID + `${id}`,
        request
      );
      if (getDetailById.status === 200) {
        const successToast = new Toast(
          "Row fetched successfully",
          "success",
          500
        );
        successToast.show();
        setSingleRow(getDetailById.data.data);
      } else {
        if (axios.isCancel(getDetailById)) {
          console.log("API request canceled");
        } else {
          const successToast = new Toast(
            getDetailById.response.data.message,
            "error",
            getDetailById.response.status
          );
          successToast.show();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5", // BMW light gray background
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center", // Center content vertically
        padding: "20px", // Add padding to prevent horizontal scroll
        overflowX: "hidden", // Remove horizontal scroll
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#1E2E3E", // BMW dark blue
          padding: "10px 15px", // Reduced padding for a leaner look
          color: "#ffffff", // White text
          textAlign: "center",
          borderBottom: "2px solid #0070C9", // Thin border for a modern touch
          fontWeight: "500", // Semi-bold for clean text
        }}
      >
        <Typography variant="h5" sx={{ fontSize: "1.2rem" }}>
          Row Details
        </Typography>
      </Box>

      {/* Back Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(-1)}
        sx={{
          mt: 2,
          mb: 3,
          fontSize: "0.8rem", // Smaller font size
          padding: "5px 15px", // Reduced padding for a compact look
          backgroundColor: "#0070C9", // BMW blue
          "&:hover": {
            backgroundColor: "#005B99", // Darker BMW blue
          },
        }}
      >
        Back
      </Button>

      {/* Details Section */}
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: "600px", // Restrict card width to prevent overflow
          backgroundColor: "#ffffff",
          padding: "15px", // Compact padding
          borderRadius: "8px", // Rounded corners
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
          overflow: "hidden", // Prevent inner scroll
        }}
      >
        {/* Title */}
        <Typography
          variant="h6"
          color="#1E2E3E"
          textAlign="center"
          sx={{ fontWeight: "600", fontSize: "1rem", mb: 2 }}
        >
          Row Details
        </Typography>

        {/* Data Rows */}
        {Object.entries(singleRow || {})
          .filter(([key]) => key !== "_id") // Filter out the "_id" field
          .map(([key, value], index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 10px", // Compact padding for each row
                backgroundColor: index % 2 === 0 ? "#F7FBFF" : "#ffffff", // Alternating row colors
                borderRadius: "5px",
                wordBreak: "break-word", // Handle long text gracefully
                fontSize: "0.9rem", // Smaller font size for data rows
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: "#1E2E3E",
                  fontWeight: "500",
                  fontSize: "0.9rem", // Smaller font for keys
                }}
              >
                {key}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#555555",
                  fontSize: "0.9rem", // Smaller font for values
                }}
              >
                {value}
              </Typography>
            </Box>
          ))}
      </Paper>
    </Box>
  );
};

export default DetailPage;
