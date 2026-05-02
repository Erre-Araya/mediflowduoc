import { Link } from "react-router-dom";
import "../styles/Header.css";

export default function Header() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <header className="header">
      <h1 className="logo">Mediflow</h1>

      <nav className="nav">
        <Link to="/home">Inicio</Link>

        {user?.rol === "PACIENTE" && (
          <>
            <Link to="/appointments">Mis citas</Link>
            <Link to="/create">Agendar</Link>
          </>
        )}

        {user?.rol === "PROFESIONAL" && (
          <>
            <Link to="/profesional/citas">Mis citas</Link>
            <Link to="/patients">Pacientes</Link>
            <Link to="/profesional/agendar">Agendar paciente</Link>
          </>
        )}

        {user?.rol === "ADMIN" && (
          <>
            <Link to="/admin/profesionales/crear">Crear profesional</Link>
            <Link to="/admin/especialidades/crear">Crear especialidad</Link>
          </>
        )}
      </nav>
    </header>
  );
}