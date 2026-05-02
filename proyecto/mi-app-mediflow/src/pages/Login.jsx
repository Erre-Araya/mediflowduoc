import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css";
import { loginUser } from "../services/userService";
import { useNavigate } from "react-router-dom";

function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

    try {
      const user = await loginUser(correo, password);

      if (!user || user.error) {
        alert(user.error || "Credenciales incorrectas");
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));
      navigate("/home");

    } catch (err) {
      alert(err.error || "Credenciales incorrectas");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>

        <input type="email" placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required/>

        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)}required/>

        <button type="submit">Ingresar</button>

        <p>
          ¿Aun no tienes cuenta?{" "}
          <Link to="/register">Regístrate</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;