import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { changePasswordObligatorio } from "../services/userService";

export default function ChangePassword() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmar) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      await changePasswordObligatorio(user.id, password);

      const updatedUser = {
        ...user,
        debeCambiarPassword: false
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));


      navigate("/home");

    } catch (error) {
      alert(error.message);
    }

    const updatedUser = {
      ...user,
      debeCambiarPassword: false
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    alert("Contraseña actualizada");
    navigate("/home");
  };

  return (
    <>
    <div className="page-container" style={{display: "flex", justifyContent: "center"}}>
      <div className="card" style={{ padding: "20px", height: "400px" }}>
        <h2 className="page-title">Cambiar contraseña</h2>

        <form onSubmit={handleSubmit} className="form">
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <br /><br />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            required
          />

          <br /><br />

          <button className="btn btn-primary" type="submit">Guardar contraseña</button>
        </form>
      </div>
    </div>
    <Footer/>
    </>
  );
}