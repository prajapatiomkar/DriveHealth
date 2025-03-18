import { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import axios from "axios";

const steps = ["Patient Details", "Prescription Details", "Physician Details"];

const AddPatient = ({}) => {
  type FormDataType = {
    [key: string]: string; // Allows string indexing
  };
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormDataType>({
    patientName: "",
    location: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
    patientId: "",
    prescription: "",
    dose: "",
    visitDate: "",
    nextVisit: "",
    physicianId: "",
    physicianName: "",
    physicianNumber: "",
    bill: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: false }); // Clear error when user types
  };

  const validateFields = (fields: string[]) => {
    const newErrors: { [key: string]: boolean } = {};
    let valid = true;

    fields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = true;
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const handleNext = () => {
    if (
      activeStep === 0 &&
      validateFields([
        "patientName",
        "location",
        "age",
        "gender",
        "phone",
        "address",
        "patientId",
      ])
    ) {
      setActiveStep((prevStep) => prevStep + 1);
    } else if (
      activeStep === 1 &&
      validateFields(["prescription", "dose", "visitDate", "nextVisit"])
    ) {
      setActiveStep((prevStep) => prevStep + 1);
    } else if (
      activeStep === 2 &&
      validateFields([
        "physicianId",
        "physicianName",
        "physicianNumber",
        "bill",
      ])
    ) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (
      validateFields([
        "physicianId",
        "physicianName",
        "physicianNumber",
        "bill",
      ])
    ) {
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

        const response = await axios.post(
          "http://localhost:5000/google-drive/create-patient-file",
          { ...formData, selectedSheetId: sheetId }, // Include sheetId in request body
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        alert(`Patient data appended successfully!`);
      } catch (error) {
        console.error("❌ Error creating patient file:", error);
        alert(
          "Failed to create patient file. Please check the console for details."
        );
      }
    }
  };

  return (
    <Box sx={{ width: "60%", margin: "left", mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Add Patient
      </Typography>
      <Box sx={{ display: "flex", width: "80%", margin: "auto" }}>
        <Box sx={{ width: "30%", pr: 2, mt: 1 }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        <Box sx={{ width: "70%" }}>
          <Box sx={{ mt: 0 }}>
            {activeStep === 0 && (
              <Box>
                <TextField
                  fullWidth
                  label="Patient Name"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  margin="normal"
                  error={errors.patientName}
                  helperText={errors.patientName ? "Required" : ""}
                />
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  margin="normal"
                  error={errors.location}
                  helperText={errors.location ? "Required" : ""}
                />
                <TextField
                  fullWidth
                  label="Age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  margin="normal"
                  error={errors.age}
                  helperText={errors.age ? "Required" : ""}
                />
                <TextField
                  fullWidth
                  select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  margin="normal"
                  error={errors.gender}
                  helperText={errors.gender ? "Required" : ""}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  margin="normal"
                  error={errors.phone}
                  helperText={errors.phone ? "Required" : ""}
                />
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  margin="normal"
                  error={errors.address}
                  helperText={errors.address ? "Required" : ""}
                />
                <TextField
                  fullWidth
                  label="Patient ID"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  margin="normal"
                  error={errors.patientId}
                  helperText={errors.patientId ? "Required" : ""}
                />
              </Box>
            )}

            {activeStep === 1 && (
              <Box>
                <TextField
                  fullWidth
                  label="Prescription"
                  name="prescription"
                  value={formData.prescription}
                  onChange={handleChange}
                  margin="normal"
                  error={errors.prescription}
                  helperText={errors.prescription ? "Required" : ""}
                />
                <TextField
                  fullWidth
                  label="Dose"
                  name="dose"
                  value={formData.dose}
                  onChange={handleChange}
                  margin="normal"
                  error={errors.dose}
                  helperText={errors.dose ? "Required" : ""}
                />
                <TextField
                  fullWidth
                  label="Visit Date"
                  name="visitDate"
                  type="date"
                  value={formData.visitDate}
                  onChange={handleChange}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  error={errors.visitDate}
                  helperText={errors.visitDate ? "Required" : ""}
                />
                <TextField
                  fullWidth
                  label="Next Visit"
                  name="nextVisit"
                  type="date"
                  value={formData.nextVisit}
                  onChange={handleChange}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  error={errors.nextVisit}
                  helperText={errors.nextVisit ? "Required" : ""}
                />
              </Box>
            )}

            {activeStep === 2 && (
              <Box>
                <TextField
                  fullWidth
                  label="Physician ID"
                  name="physicianId"
                  value={formData.physicianId}
                  onChange={handleChange}
                  margin="normal"
                  error={errors.physicianId}
                  helperText={errors.physicianId ? "Required" : ""}
                />
                <TextField
                  fullWidth
                  label="Physician Name"
                  name="physicianName"
                  value={formData.physicianName}
                  onChange={handleChange}
                  margin="normal"
                  error={errors.physicianName}
                  helperText={errors.physicianName ? "Required" : ""}
                />
                <TextField
                  fullWidth
                  label="Physician Number"
                  name="physicianNumber"
                  value={formData.physicianNumber}
                  onChange={handleChange}
                  margin="normal"
                  error={errors.physicianNumber}
                  helperText={errors.physicianNumber ? "Required" : ""}
                />
                <TextField
                  fullWidth
                  label="Bill"
                  name="bill"
                  type="number"
                  value={formData.bill}
                  onChange={handleChange}
                  margin="normal"
                  error={errors.bill}
                  helperText={errors.bill ? "Required" : ""}
                />
              </Box>
            )}

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="contained"
              >
                Back
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  color="primary"
                >
                  Finish
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  color="primary"
                >
                  Continue
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddPatient;
