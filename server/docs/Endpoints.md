## DriveHealth API Documentation

This document outlines the API endpoints for the DriveHealth application, which integrates with Google Sheets to manage patient data.

**Base URL:** `http://localhost:5000` (or your deployed backend URL)

### Authentication

- **Google OAuth 2.0:**
  - The application uses Google OAuth 2.0 for user authentication.
  - Users are redirected to Google's authentication page to grant access.
  - Upon successful authentication, Google redirects the user back to the application with an access token.

#### Endpoints

- **`GET google/callback`**
  - **Description:** Callback endpoint for Google OAuth 2.0.
  - **Redirects:**
    - `http://localhost:3000?token=${accessToken}`: Redirects the user to the frontend application with the access token as a query parameter.
  - **Usage:** This endpoint is automatically called by Google after successful authentication.

### Google Drive Integration

- **Google Sheets API:**
  - The application uses the Google Sheets API to store and retrieve patient data.
  - Data is stored in a Google Sheet specified by the user.

#### Endpoints

- **`POST google-drive/create-patient-file`**

  - **Description:** Creates a new Google Sheet or appends data to an existing sheet.
  - **Request Body:**
    ```json
    {
      "patientId": "123456",
      "patientName": "John Doe",
      "location": "New York",
      "age": "30",
      "gender": "Male",
      "phone": "123-456-7890",
      "address": "123 Main St",
      "prescription": "Aspirin",
      "dose": "10mg",
      "visitDate": "2024-01-01",
      "nextVisit": "2024-01-15",
      "physicianId": "7890",
      "physicianName": "Dr. Smith",
      "physicianNumber": "9876",
      "bill": "100"
    }
    ```
  - **Query Parameters:**
    - `selectedSheetId` (optional): The ID of an existing Google Sheet. If not provided, a new sheet will be created.
  - **Response:**
    ```json
    {
      "message": "✅ Patient data appended to sheet",
      "sheetId": "your-sheet-id"
    }
    ```
  - **Usage:** Used to add new patient data to a Google Sheet.

- **`POST google-drive/patients`**

  - **Description:** Retrieves all patient data from a Google Sheet.
  - **Query Parameters:**
    - `selectedSheetId` (required): The ID of the Google Sheet.
  - **Response:**
    ```json
    [
      {
        "patientId": "123456",
        "patientName": "John Doe"
        // ... other patient data ...
      }
      // ... more patient data ...
    ]
    ```
  - **Usage:** Used to fetch all patient records for display.

- **`PUT google-drive/patient/:patientId`**

  - **Description:** Updates a patient's data in a Google Sheet.
  - **Path Parameters:**
    - `patientId` (required): The ID of the patient to update.
  - **Request Body:**
    ```json
    {
      "patientName": "Jane Doe",
      "location": "Los Angeles"
      // ... other patient data to update ...
    }
    ```
  - **Query Parameters:**
    - `selectedSheetId` (required): The ID of the Google Sheet.
  - **Response:**
    ```json
    {
      "message": "✅ Patient data updated successfully"
    }
    ```
  - **Usage:** Used to modify existing patient records.

- **`GET google-drive/search-patient-by-id`**
  - **Description:** Searches for a patient by their ID.
  - **Query Parameters:**
    - `patientId` (required): The ID of the patient to search for.
    - `selectedSheetId` (required): The ID of the Google Sheet.
  - **Response:**
    ```json
    [
      {
        "patientId": "123456",
        "patientName": "John Doe"
        // ... other patient data ...
      }
    ]
    ```
    Or an empty array `[]` if no patient is found.
  - **Usage:** Used to retrieve a specific patient record by their ID.

### Notes

- All API endpoints require a valid Google Access Token in the `Authorization` header.
- The Access Token must be sent in the header like this: `Authorization: Bearer <Your_token_here>`
- Error handling is implemented to provide informative error messages.
- Make sure to replace `http://localhost:5000` with your actual backend URL when deploying.
- The Google sheet Id is stored in the local storage of the browser after the user selects a sheet.
