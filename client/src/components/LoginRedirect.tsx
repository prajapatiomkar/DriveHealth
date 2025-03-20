import { useEffect, useState } from "react";
import { Button, Typography, Box, Container } from "@mui/material";

const LoginRedirect = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const existingToken = localStorage.getItem("googleAccessToken");

    if (token) {
      localStorage.setItem("googleAccessToken", token);
      window.location.href = "/dashboard/select-file";
      return; // Prevent further execution of useEffect
    }

    if (existingToken) {
      window.location.href = "/dashboard/select-file";
      return; // Prevent further execution of useEffect
    }

    setShowWelcome(true); // Show welcome screen if no token
  }, []);

  const handleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  if (showWelcome) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "90vh",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Welcome to DriveHealth
          </Typography>
          <Typography variant="body1" paragraph>
            Please log in to access your dashboard.
          </Typography>
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Login with Google
          </Button>
        </Box>
      </Container>
    );
  }

  return <h2>Logging in...</h2>;
};

export default LoginRedirect;
