import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

    const res = await fetch(`http://localhost:8080/api/usuarios/${user.id}/password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Error al cambiar contraseña");
      return;
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
    <div style={{ padding: "20px" }}>
      <h2>Cambiar contraseña</h2>

      <form onSubmit={handleSubmit}>
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

        <button type="submit">Guardar contraseña</button>
      </form>
    </div>
  );
}