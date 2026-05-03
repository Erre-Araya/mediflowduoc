import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css";
import { loginUser } from "../services/userService";
import { useNavigate } from "react-router-dom";

function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
    const user = await loginUser(correo, password);
    if (!user || user.error) {
      setError(user.error || "Credenciales incorrectas");
      return;
    }
    localStorage.setItem("user", JSON.stringify(user));
    navigate("/home");
    } catch (err) {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="page-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div className="card" style={{ width: "320px" }}>
        
        <h2 className="page-title" style={{ textAlign: "center" }}>
          Iniciar sesión
        </h2>

        {error && <p className="msg-error">{error}</p>}

        <form className="form" onSubmit={handleSubmit}>
          <input
            className="input"
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />

          <input
            className="input"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="btn btn-primary" type="submit">
            Ingresar
          </button>

          <p style={{ textAlign: "center", fontSize: "0.9rem" }}>
            ¿Aún no tienes cuenta? <Link to="/register">Regístrate</Link>
          </p>
        </form>

      </div>
    </div>
  );
}

export default Login;