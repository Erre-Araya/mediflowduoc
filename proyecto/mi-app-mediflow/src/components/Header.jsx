import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import logo from "../assets/favicon.png"

export default function Header() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="header">
      <h1 className="logo">
        <img src={logo} alt="Mediflow logo" className="logo-img" />
        Mediflow</h1>

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
          </>
        )}

        {user?.rol === "ADMIN" && (
          <>
            <Link to="/professionals">Profesionales</Link>
            <Link to="/patients">Pacientes</Link>
          </>
        )}
        {user && (
          <button onClick={handleLogout}>
            Salir
          </button>
        )}
        
      </nav>
    </header>
  );
}