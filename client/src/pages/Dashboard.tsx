import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Typography,
} from "@mui/material";
import { NavLink, Outlet } from "react-router"; // Correct import

export default function Dashboard() {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: "250px", // Width of the sidebar
          backgroundColor: "#f5f5f5", // Light gray background
          padding: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          sx={{
            padding: 2,
          }}
        >
          Dashboard
        </Typography>
        <Divider />
        <List>
          {[
            { text: "Add Patients", path: "add-patients" },
            { text: "Patient List", path: "patients" }, // Corrected path
            { text: "Search Patients", path: "search" },
            { text: "Select File", path: "select-file" },
          ].map(({ text, path }) => (
            <NavLink
              key={text}
              to={path}
              style={({ isActive }: any) => ({
                textDecoration: "none", // Remove underline
                color: isActive ? "#1976d2" : "black", // Active color
              })}
            >
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            </NavLink>
          ))}
        </List>
      </Box>

      {/* Content Area */}
      <Box
        sx={{
          flexGrow: 1, // Ensures the content area takes the remaining space
          padding: 2,
          backgroundColor: "#ffffff",
        }}
      >
        <Outlet />
        {/* The content for each route will be rendered here via Outlet */}
      </Box>
    </Box>
  );
}
