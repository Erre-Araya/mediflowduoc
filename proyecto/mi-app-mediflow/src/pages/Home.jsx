import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function Home() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <Header />

      <div style={{ padding: "20px" }}>
        <h2>Bienvenid@: {user?.nombres}</h2>
        <h1>Panel Principal</h1>

        <div style={{ display: "flex", gap: "20px" }}>

          {user?.rol === "PACIENTE" && (
            <>
              <div style={{ border: "1px solid #ccc", padding: "15px" }}>
                <h3>Mis Citas</h3>
                <p>Revisa tus citas médicas</p>
                <Link to="/appointments">Ver citas</Link>
              </div>

              <div style={{ border: "1px solid #ccc", padding: "15px" }}>
                <h3>Agendar</h3>
                <p>Crear nueva cita</p>
                <Link to="/create">Agendar</Link>
              </div>
            </>
          )}

          {user?.rol === "PROFESIONAL" && (
            <>
              <div style={{ border: "1px solid #ccc", padding: "15px" }}>
                <h3>Mis Citas</h3>
                <p>Ver citas agendadas conmigo</p>
                <Link to="/profesional/citas">Ver citas</Link>
              </div>

              <div style={{ border: "1px solid #ccc", padding: "15px" }}>
                <h3>Pacientes</h3>
                <p>Listado de pacientes</p>
                <Link to="/patients">Ver pacientes</Link>
              </div>
            </>
          )}

          {user?.rol === "ADMIN" && (
            <>
              <div style={{ border: "1px solid #ccc", padding: "15px" }}>
                <h3>Crear profesional</h3>
                <p>Agregar profesionales al sistema</p>
                <Link to="/admin/profesionales/crear">Crear profesional</Link>
              </div>

              <div style={{ border: "1px solid #ccc", padding: "15px" }}>
                <h3>Crear especialidad</h3>
                <p>Agregar especialidades médicas</p>
                <Link to="/admin/especialidades/crear">Crear especialidad</Link>
              </div>

              <div style={{ border: "1px solid #ccc", padding: "15px" }}>
                <h3>Pacientes</h3>
                <p>Listado de pacientes</p>
                <Link to="/patients">Ver pacientes</Link>
              </div>
            </>
          )}

          <div style={{ border: "1px solid #ccc", padding: "15px" }}>
            <h3>Profesionales</h3>
            <p>Listado de profesionales</p>
            <Link to="/professionals">Ver profesionales</Link>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}