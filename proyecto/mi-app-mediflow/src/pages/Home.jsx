import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function Home() {
    const user = JSON.parse(localStorage.getItem("user"));
  return (
    <>
      <Header />
        <h2>Bienvenid@: {user?.nombres}</h2>;
      <div style={{ padding: "20px" }}>
        <h1>Panel Principal</h1>

        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ border: "1px solid #ccc", padding: "15px" }}>
            <h3>Citas</h3>
            <p>Gestiona tus citas médicas</p>
            <Link to="/appointments">Ver citas</Link>
          </div>

          <div style={{ border: "1px solid #ccc", padding: "15px" }}>
            <h3>Agendar</h3>
            <p>Crear nueva cita</p>
            <Link to="/create">Agendar</Link>
          </div>

          <div style={{ border: "1px solid #ccc", padding: "15px" }}>
            <h3>Pacientes</h3>
            <p>Listado de pacientes</p>
            <Link to="/patients">Ver pacientes</Link>
          </div>

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