import { Route, Routes } from "react-router";
import "./App.css";
import AddPatients from "./components/AddPatients";
import EditPatients from "./components/EditPatients";
import Search from "./components/Search";
import SelectFile from "./components/SelectFile";
import Dashboard from "./pages/Dashboard";
import LoginRedirect from "./components/LoginRedirect"; // Import LoginRedirect

function App() {
  return (
    <Routes>
      {/* Route for handling OAuth login */}
      <Route path="/" element={<LoginRedirect />} />

      <Route path="dashboard" element={<Dashboard />}>
        <Route path="add-patients" element={<AddPatients />} />
        <Route path="edit-patients" element={<EditPatients />} />
        <Route path="search" element={<Search />} />
        <Route path="select-file" element={<SelectFile />} />
      </Route>
    </Routes>
  );
}

export default App;
