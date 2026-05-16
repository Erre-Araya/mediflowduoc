import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const initials = user
    ? `${user.nombres?.[0] || ""}${user.apellidos?.[0] || ""}`.toUpperCase()
    : "?";

  const rolLabel = { PACIENTE: "Paciente", PROFESIONAL: "Profesional", ADMIN: "Admin" };

  return (
    <header className="header">
      <div className="header-inner">

        {/* Logo */}
        <Link to="/home" className="header-logo" style={{ textDecoration: "none" }}>
          <div className="header-logo-icon">
            {/* heartbeat icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <span className="header-logo-text">Mediflow</span>
        </Link>

        {/* Nav links */}
        <nav className="header-nav">
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
        </nav>

        {/* User chip + logout */}
        <div className="header-actions">
          {user && (
            <>
              <div className="user-chip">
                <div className="user-avatar">{initials}</div>
                <div>
                  <div className="user-name">{user.nombres}</div>
                  <div className="user-role-badge">{rolLabel[user.rol] || user.rol}</div>
                </div>
              </div>

              <button
                className="btn btn-ghost"
                onClick={handleLogout}
                style={{ padding: "7px 14px", fontSize: "13px" }}
                title="Cerrar sesión"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Salir
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
