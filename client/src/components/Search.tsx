import React, { useState } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import axios from "axios";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("googleAccessToken");
      const sheetId = localStorage.getItem("selectedSheetId");

      if (!token) {
        alert("Authentication required. Please log in again.");
        return;
      }

      if (!sheetId) {
        alert("Please select a Google Sheet first.");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/google-drive/search-patient-by-id",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            patientId: searchTerm,
            selectedSheetId: sheetId,
          },
        }
      );

      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching patient by ID:", error);
      alert(
        "Failed to search patient by ID. Please check the console for details."
      );
    }
  };

  return (
    <Box>
      <Typography variant="h4" align="center" gutterBottom>
        Search Patients
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Search Term"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>
      {searchResults.length === 0 ? (
        <Typography variant="body1" align="center" mt={20}>
          No patient found.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Patient Id</TableCell>
                <TableCell>Patient Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Prescription</TableCell>
                <TableCell>Dose</TableCell>
                <TableCell>Visit Date</TableCell>
                <TableCell>Next Visit</TableCell>
                <TableCell>Physician Id</TableCell>
                <TableCell>Physician Name</TableCell>
                <TableCell>Physician Number</TableCell>
                <TableCell>Bill</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchResults.map((patient) => (
                <TableRow key={patient.patientId}>
                  <TableCell>{patient.patientId}</TableCell>
                  <TableCell>{patient.patientName}</TableCell>
                  <TableCell>{patient.location}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{patient.address}</TableCell>
                  <TableCell>{patient.prescription}</TableCell>
                  <TableCell>{patient.dose}</TableCell>
                  <TableCell>{patient.visitDate}</TableCell>
                  <TableCell>{patient.nextVisit}</TableCell>
                  <TableCell>{patient.physicianId}</TableCell>
                  <TableCell>{patient.physicianName}</TableCell>
                  <TableCell>{patient.physicianNumber}</TableCell>
                  <TableCell>{patient.bill}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
