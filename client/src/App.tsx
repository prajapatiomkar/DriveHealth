import { Route, Routes } from "react-router";
import "./App.css";
import AddPatients from "./components/AddPatients";
import Search from "./components/Search";
import SelectFile from "./components/SelectFile";
import Dashboard from "./pages/Dashboard";
import LoginRedirect from "./components/LoginRedirect";
import PatientList from "./components/PatientList"; // Corrected import
import EditPatient from "./components/EditPatients";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginRedirect />} />

      <Route path="dashboard" element={<Dashboard />}>
        <Route path="add-patients" element={<AddPatients />} />
        <Route path="patients" element={<PatientList />} />{" "}
        {/* Corrected route */}
        <Route path="patients/:patientId" element={<EditPatient />} />{" "}
        {/* Add EditPatient route */}
        <Route path="search" element={<Search />} />
        <Route path="select-file" element={<SelectFile />} />
      </Route>
    </Routes>
  );
}

export default App;
