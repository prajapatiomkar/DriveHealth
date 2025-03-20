import { useNavigate } from "react-router";
import { Button } from "@mui/material";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("googleAccessToken");
    localStorage.removeItem("selectedSheetId");

    navigate("/");
  };

  return (
    <Button variant="outlined" color="error" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
