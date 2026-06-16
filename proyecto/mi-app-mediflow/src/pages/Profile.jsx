import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  updateUser,
  changePasswordPerfil,
} from "../services/userService";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [form, setForm] = useState({
    nombres: user?.nombres || "",
    apellidos: user?.apellidos || "",
    correo: user?.correo || "",
    telefono: user?.telefono || "",
    direccion: user?.direccion || "",
  });

  const [passwordActual, setPasswordActual] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  if (!user || user.rol === "ADMIN") {
    return (
      <>
        <Header />
        <div className="page-container">
          <div className="card">
            <p>No tienes acceso a esta página.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const guardarDatos = async (e) => {
    e.preventDefault();

    try {
      const actualizado = await updateUser(user.id, form);

      const nuevoUser = {
        ...user,
        ...actualizado,
      };

      localStorage.setItem("user", JSON.stringify(nuevoUser));

      alert("Datos actualizados correctamente");
    } catch (error) {
      alert(error.message);
    }
  };

  const guardarPassword = async (e) => {
    e.preventDefault();

    if (!passwordActual) {
      alert("Debes ingresar tu contraseña actual");
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      alert("Las contraseñas nuevas no coinciden");
      return;
    }

    if (nuevaPassword.length < 4) {
      alert("La nueva contraseña debe tener al menos 4 caracteres");
      return;
    }

    try {
      await changePasswordPerfil(
        user.id,
        passwordActual,
        nuevaPassword
      );

      setPasswordActual("");
      setNuevaPassword("");
      setConfirmarPassword("");

      alert("Contraseña actualizada correctamente");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <Header />

      <div className="page-container">
        <h2 className="page-title">Mi perfil</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
          }}
        >
          <div className="card">
            <h3>Datos personales</h3>

            <form className="form" onSubmit={guardarDatos}>
              <input
                className="input"
                name="nombres"
                placeholder="Nombres"
                value={form.nombres}
                onChange={handleChange}
              />

              <input
                className="input"
                name="apellidos"
                placeholder="Apellidos"
                value={form.apellidos}
                onChange={handleChange}
              />

              <input
                className="input"
                name="correo"
                placeholder="Correo"
                value={form.correo}
                onChange={handleChange}
              />

              <input
                className="input"
                name="telefono"
                placeholder="Teléfono"
                value={form.telefono}
                onChange={handleChange}
              />

              <input
                className="input"
                name="direccion"
                placeholder="Dirección"
                value={form.direccion}
                onChange={handleChange}
              />

              <button className="btn btn-primary" type="submit">
                Guardar datos
              </button>
            </form>
          </div>

          <div className="card">
            <h3>Cambiar contraseña</h3>

            <form className="form" onSubmit={guardarPassword}>
              <input
                className="input"
                type="password"
                placeholder="Contraseña actual"
                value={passwordActual}
                onChange={(e) => setPasswordActual(e.target.value)}
              />

              <input
                className="input"
                type="password"
                placeholder="Nueva contraseña"
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
              />

              <input
                className="input"
                type="password"
                placeholder="Confirmar nueva contraseña"
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
              />

              <button className="btn btn-primary" type="submit">
                Cambiar contraseña
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}