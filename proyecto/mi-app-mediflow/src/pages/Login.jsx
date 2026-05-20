import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/userService";
import ThemeToggle from "../components/ThemeToggle";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await loginUser(correo, password);
      localStorage.setItem("user", JSON.stringify(user));
      if (user.debeCambiarPassword === true) {
        navigate("/cambiar-password");
      } else {
        navigate("/home");
      }
    } catch {
      setError("Correo o contraseña incorrectos.");
    }
  };

  return (
    <div className="login-page">

      {/* Toggle arriba a la derecha */}
      <div style={{ position: "fixed", top: 16, right: 20 }}>
        <ThemeToggle />
      </div>

      <div className="login-card">

        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
              stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <div className="login-logo-title">Mediflow</div>
          <div className="login-logo-sub">Inicia sesión en tu cuenta</div>
        </div>

        <form className="form" onSubmit={handleSubmit}>

          <div>
            <label className="field-label">Correo electrónico</label>
            <div className="input-icon-wrap">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <input
                className="input"
                type="email"
                placeholder="tu@correo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="field-label">Contraseña</label>
            <div className="input-icon-wrap">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <div className="msg-error">{error}</div>}

          <button className="btn btn-primary" type="submit" style={{ marginTop: "4px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="9" y2="12" />
            </svg>
            Ingresar
          </button>

          <p style={{ textAlign: "center", fontSize: "13.5px", color: "var(--text-muted)", marginTop: "4px" }}>
            ¿Sin cuenta?{" "}
            <Link to="/register" style={{ fontWeight: 600 }}>Regístrate aquí</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
