import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { registerUser } from "../services/userService";

export default function CreatePatient() {
  const user = JSON.parse(localStorage.getItem("user"));

  // Solo profesional y admin pueden entrar
  if (!user || (user.rol !== "PROFESIONAL" && user.rol !== "ADMIN")) {
    return <p>No tienes acceso a esta página</p>;
  }

  const [form, setForm] = useState({
    run: "",
    nombres: "",
    apellidos: "",
    correo: "",
    password: "1234", 
    regionId: "",
    comunaId: "",
    direccion: "",
    telefono: "",
    rol: "PACIENTE" //siempre paciente, no lo puede cambiar
  });

  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Cargar regiones al montar el componente
  useEffect(() => {
    fetch("http://localhost:8080/api/regiones")
      .then(res => res.json())
      .then(data => setRegiones(data))
      .catch(err => console.error(err));
  }, []);

  // Cargar comunas cuando cambia la región
  useEffect(() => {
    if (form.regionId) {
      fetch(`http://localhost:8080/api/comunas/region/${form.regionId}`)
        .then(res => res.json())
        .then(data => setComunas(data))
        .catch(err => console.error(err));
    } else {
      setComunas([]);
    }
  }, [form.regionId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      await registerUser(form);
      setMensaje("Paciente creado correctamente. Contraseña temporal: 1234");
      // Limpiamos el formulario pero mantenemos rol y password
      setForm({
        run: "",
        nombres: "",
        apellidos: "",
        correo: "",
        password: "1234",
        regionId: "",
        comunaId: "",
        direccion: "",
        telefono: "",
        rol: "PACIENTE"
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Header />

      <div className="page-container" style={{ display: "flex", justifyContent: "center" }}>

        <div className="card" style={{ width: "500px" }}>

          <h2 className="page-title">Crear paciente</h2>

          {mensaje && <p className="msg-success">{mensaje}</p>}
          {error && <p className="msg-error">{error}</p>}

          <form className="form" onSubmit={handleSubmit}>

            <input
              className="input"
              name="run"
              placeholder="RUN (sin puntos ni guión)"
              value={form.run}
              onChange={handleChange}
            />

            <input
              className="input"
              name="nombres"
              placeholder="Nombres"
              value={form.nombres}
              onChange={handleChange}
              required
            />

            <input
              className="input"
              name="apellidos"
              placeholder="Apellidos"
              value={form.apellidos}
              onChange={handleChange}
              required
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
              name="correo"
              type="email"
              placeholder="Correo electrónico"
              value={form.correo}
              onChange={handleChange}
              required
            />

            <input
              className="input"
              name="direccion"
              placeholder="Dirección"
              value={form.direccion}
              onChange={handleChange}
            />

            <label>Región</label>
            <select
              className="input"
              name="regionId"
              value={form.regionId}
              onChange={handleChange}
            >
              <option value="">Selecciona región</option>
              {regiones.map(r => (
                <option key={r.id} value={r.id}>{r.nombre}</option>
              ))}
            </select>

            <label>Comuna</label>
            <select
              className="input"
              name="comunaId"
              value={form.comunaId}
              onChange={handleChange}
              disabled={!form.regionId}
            >
              <option value="">Selecciona comuna</option>
              {comunas.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>

            <p style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
              La contraseña temporal será <strong>1234</strong>. El paciente puede cambiarla después.
            </p>

            <button className="btn btn-primary" type="submit">
              Crear paciente
            </button>

          </form>

        </div>

      </div>

      <Footer />
    </>
  );
}