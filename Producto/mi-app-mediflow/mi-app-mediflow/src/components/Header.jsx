import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import Chat from "./Chat";
import { useState } from "react";


export default function Header() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const initials = user
    ? `${user.nombres?.[0] || ""}${user.apellidos?.[0] || ""}`.toUpperCase()
    : "?";

  const rolLabel = {
    PACIENTE: "Paciente",
    PROFESIONAL: "Profesional",
    ADMIN: "Admin",
  };

  return (
    <header className="header">
      <div className="header-inner">
        <Link
          to={user ? "/home" : "/"}
          className="header-logo"
        >
          <div className="header-logo-icon">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>

          <span className="header-logo-text">MediFlow</span>
        </Link>

        <nav className="header-nav">
          <Link to="/home">Inicio</Link>

          {user?.rol === "PACIENTE" && (
            <>
              <Link to="/appointments">Mis citas</Link>
              <Link to="/create">Agendar</Link>
              <Link to="/historial-clinico">Mi historial clínico</Link>
            </>
          )}

          {user?.rol === "PROFESIONAL" && (
            <>
              <Link to="/profesional/citas">Mis citas</Link>
              <Link to="/patients">Pacientes</Link>
              <Link to="/profesional/historial-clinico">Historial clínico</Link>
              <Link to="/profesional/agendar">Agendar</Link>
            </>
          )}

          {user?.rol === "ADMIN" && (
            <>
              <Link to="/professionals">Profesionales</Link>
              <Link to="/patients">Pacientes</Link>
            </>
          )}
        </nav>

        <div className="header-actions">
          <ThemeToggle />

          {user && (
            <div className="user-menu-wrapper">
              <button
                className="user-chip user-chip-button"
                onClick={() => setMenuAbierto(!menuAbierto)}
              >
                <div className="user-avatar">{initials}</div>

                <div>
                  <div className="user-name">{user.nombres}</div>
                  <div className="user-role-badge">
                    {rolLabel[user.rol] || user.rol}
                  </div>
                </div>

                <span className="user-menu-arrow">▾</span>
              </button>

              {menuAbierto && (
                <div className="user-dropdown">
                  {user.rol !== "ADMIN" && (
                    <button onClick={() => navigate("/perfil")}>
                      Mi perfil
                    </button>
                  )}

                  <button onClick={handleLogout}>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}