import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import Calendar from "./Calendar";

export default function Home() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <Header />

      <div className="page-container">
        <h2>Bienvenid@: {user?.nombres}</h2>
        <h1>Panel Principal</h1>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px"
        }}>

          {user?.rol === "PACIENTE" && (
            <>
              <div className="card">
                <h3>Mis Citas</h3>
                <p>Revisa tus citas médicas</p>
                <Link to="/appointments">Ver citas</Link>
              </div>

              <div className="card">
                <h3>Agendar</h3>
                <p>Crear nueva cita</p>
                <Link to="/create">Agendar</Link>
              </div>
            </>
          )}

          {user?.rol === "PROFESIONAL" && (
            <>
              <div className="card">
                <h3>Mis Citas</h3>
                <p>Ver citas agendadas conmigo</p>
                <Link to="/profesional/citas">Ver citas</Link>
              </div>

              <div className="card">
                <h3>Pacientes</h3>
                <p>Listado de pacientes</p>
                <Link to="/patients">Ver pacientes</Link>
              </div>
            </>
          )}

          {user?.rol === "ADMIN" && (
            <>

            </>
          )}
        </div>

      <Calendar embedded={true} />
      </div>

      <Footer />
    </>
  );
}