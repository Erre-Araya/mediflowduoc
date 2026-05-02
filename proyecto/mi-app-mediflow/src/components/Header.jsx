import { Link } from "react-router-dom";
import "../styles/Header.css"

const user = JSON.parse(localStorage.getItem("user"));

export default function Header() {
  return (
    <header className="header">
      <h2>Mediflow</h2>

      <nav>
        <Link to="/home">Inicio</Link> |{" "}
        <Link to="/appointments">Citas</Link> |{" "}
        <Link to="/create">Agendar</Link> |{" "}
        <Link to="/patients">Pacientes</Link> |{" "}
        <Link to="/profile">Perfil</Link>
        {user?.rol === "ADMIN" && (
        <>
          <Link to="/admin/especialidades/crear">Crear especialidad</Link>
          <Link to="/admin/profesionales/crear">Crear profesional</Link>
        </>
      )}
              
      </nav>
    </header>
  );
}