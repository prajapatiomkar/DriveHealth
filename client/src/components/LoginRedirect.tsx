import { useEffect } from "react";

const LoginRedirect = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("googleAccessToken", token); // Store token
      window.location.href = "/dashboard"; // Redirect to dashboard
    } else {
      // Redirect to backend for Google OAuth if not authenticated
      window.location.href = "http://localhost:5000/auth/google";
    }
  }, []);

  return <h2>Logging in...</h2>;
};

export default LoginRedirect;
