import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  Box,
  Typography,
} from "@mui/material";
import { Edit as EditIcon, Search as SearchIcon } from "@mui/icons-material";
import axios from "axios";
import EditPatient from "./EditPatients";

const PatientList = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
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
          "http://localhost:5000/google-drive/patients",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            params: {
              selectedSheetId: sheetId,
            },
          }
        );

        setPatients(response.data);
      } catch (error) {
        console.error("❌ Error fetching patients:", error);
        alert(
          "Failed to fetch patient data. Please check the console for details."
        );
      }
    };

    fetchPatients();
  }, []);

  const handleEdit = (patientId: string) => {
    setEditingPatientId(patientId);
  };

  const handleCloseEdit = () => {
    setEditingPatientId(null);
  };

  const filteredPatients = patients.filter((patient) => {
    return (
      patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Box>
      <Typography variant="h4" align="center" gutterBottom>
        Edit Patients
      </Typography>
      {editingPatientId ? (
        <EditPatient patientId={editingPatientId} onClose={handleCloseEdit} />
      ) : (
        <Box>
          <TextField
            label="Search Patients"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Actions</TableCell>
                  <TableCell>Patient Id</TableCell>
                  <TableCell>Patient Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Address</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.patientId}>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(patient.patientId)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>{patient.patientId}</TableCell>
                    <TableCell>{patient.patientName}</TableCell>
                    <TableCell>{patient.location}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>{patient.address}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default PatientList;
