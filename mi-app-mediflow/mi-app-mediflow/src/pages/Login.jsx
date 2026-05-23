import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/userService";
import ThemeToggle from "../components/ThemeToggle";
import "../styles/Login.css";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await loginUser(correo, password);

      localStorage.setItem("user", JSON.stringify(user));

      navigate("/home");
    } catch (error) {
      alert(error.message || "Credenciales incorrectas");
    }
  };

  return (
    <div className="login-page">
      <div className="login-theme-toggle">
        <ThemeToggle />
      </div>

      <div className="login-card">
        <div className="login-brand">
          <div className="login-icon">
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>

          <h1 className="login-title">Mediflow</h1>
          <p className="login-subtitle">Inicia sesión en tu cuenta</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="login-field">
            <label>Correo electrónico</label>
            <div className="login-input-wrap">
              <span>✉️</span>
              <input
                type="email"
                placeholder="tu@correo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>
          </div>

          <div className="login-field">
            <label>Contraseña</label>
            <div className="login-input-wrap">
              <span>🔒</span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button className="login-button" type="submit">
            ↪ Ingresar
          </button>
        </form>

        <div className="login-footer">
          ¿Sin cuenta? <Link to="/register">Regístrate aquí</Link>
        </div>
      </div>
    </div>
  );
}