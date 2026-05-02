import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Appointments from "./pages/Appointments";
import CreateAppointment from "./pages/CreateAppointment";
import Patients from "./pages/Patients";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Professionals from "./pages/Professionals";
import AdminCreateProfessional from "./pages/AdminCreateProfessional";
import AdminCreateSpecialty from "./pages/AdminCreateSpecialty";
import ProfessionalAppointments from "./pages/ProfessionalAppointments";
import ProfessionalCreateAppointment from "./pages/ProfessionalCreateAppointment";

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
        <Route path="/admin/profesionales/crear" element={<AdminCreateProfessional />} />
        <Route path="/admin/especialidades/crear" element={<AdminCreateSpecialty />} />
        <Route path="/profesional/citas" element={<ProfessionalAppointments />} />
        <Route path="/profesional/agendar" element={<ProfessionalCreateAppointment />}/>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;