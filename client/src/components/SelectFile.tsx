import { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

declare global {
  interface Window {
    google: any;
    onApiLoad?: () => void;
  }
}

export default function SelectFile() {
  const [selectedFile, setSelectedFile] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const googleAccessToken = localStorage.getItem("googleAccessToken");
  const [pickerLoaded, setPickerLoaded] = useState(false);

  const handleSelectFile = () => {
    if (!googleAccessToken) {
      console.error("Google Access Token is missing.");
      return;
    }
    if (!pickerLoaded) {
      console.error("Picker API not yet loaded");
      return;
    }

    const view = new window.google.picker.View(
      window.google.picker.ViewId.SPREADSHEETS
    );
    const picker = new window.google.picker.PickerBuilder()
      .addView(view)
      .setOAuthToken(googleAccessToken)
      .setCallback((data: any) => pickerCallback(data))
      .build();
    picker.setVisible(true);
  };

  const pickerCallback = (data: any) => {
    if (
      data[window.google.picker.Response.ACTION] ===
      window.google.picker.Action.PICKED
    ) {
      const doc = data[window.google.picker.Response.DOCUMENTS][0];
      const selected = {
        id: doc[window.google.picker.Document.ID],
        name: doc[window.google.picker.Document.NAME],
      };
      setSelectedFile(selected);
      localStorage.setItem("selectedSheetId", selected.id);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js?onload=onApiLoad";
    script.async = true;
    document.body.appendChild(script);

    window.onApiLoad = () => {
      window.gapi.load("picker", () => {
        setPickerLoaded(true);
      });
    };

    return () => {
      document.body.removeChild(script);
      if (window.onApiLoad) {
        delete window.onApiLoad;
      }
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
      }}
    >
      <Typography variant="h6">
        Select a Google Sheet to Read & Write Data
      </Typography>

      <Button
        variant="contained"
        startIcon={<CloudUploadIcon />}
        sx={{ mt: 2 }}
        onClick={handleSelectFile}
        disabled={!pickerLoaded}
      >
        Select File
      </Button>

      {selectedFile && (
        <Typography sx={{ mt: 2, fontWeight: "bold" }}>
          Selected: {selectedFile.name}
        </Typography>
      )}
    </Box>
  );
}
