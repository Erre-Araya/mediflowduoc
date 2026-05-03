import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Appointments from "./pages/Appointments";
import CreateAppointment from "./pages/CreateAppointment";
import Patients from "./pages/Patients";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Professionals from "./pages/Professionals";
import AdminCreateSpecialty from "./pages/AdminCreateSpecialty";
import ProfessionalAppointments from "./pages/ProfessionalAppointments";
import ProfessionalCreateAppointment from "./pages/ProfessionalCreateAppointment";
import CreatePatient from "./pages/CreatePatient";
import Calendar from "./pages/Calendar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/home" element={<Home />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/create" element={<CreateAppointment />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/professionals" element={<Professionals />} />
        <Route path="/admin/especialidades/crear" element={<AdminCreateSpecialty />} />
        <Route path="/profesional/citas" element={<ProfessionalAppointments />} />
        <Route path="/profesional/agendar" element={<ProfessionalCreateAppointment />} />
        <Route path="/create-patient" element={<CreatePatient />} />
        <Route path="/calendar" element={<Home />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;