import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Typography,
} from "@mui/material";
import { NavLink, Outlet } from "react-router";

export default function Dashboard() {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box
        sx={{
          width: "250px",
          backgroundColor: "#f5f5f5",
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
            { text: "Patient List", path: "patients" },
            { text: "Search Patients", path: "search" },
            { text: "Select File", path: "select-file" },
          ].map(({ text, path }) => (
            <NavLink
              key={text}
              to={path}
              style={({ isActive }: any) => ({
                textDecoration: "none",
                color: isActive ? "#1976d2" : "black",
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

      <Box
        sx={{
          flexGrow: 1,
          padding: 2,
          backgroundColor: "#ffffff",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
