// src/pages/Professionals.jsx
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Professionals() {
  const user = JSON.parse(localStorage.getItem("user"));

  // Lista de profesionales
  const [professionals, setProfessionals] = useState([]);

  // Control del modal de crear profesional
  const [modalProfesional, setModalProfesional] = useState(false);

  // Control del modal de crear especialidad (sobre el anterior)
  const [modalEspecialidad, setModalEspecialidad] = useState(false);

  // Especialidades disponibles para el select
  const [especialidades, setEspecialidades] = useState([]);

  // Formulario del profesional
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    password: "",
    especialidadId: "",
    numeroRegistro: "",
    horaInicio: "",
    horaFin: ""
  });

  // Formulario de la especialidad nueva
  const [formEspecialidad, setFormEspecialidad] = useState({
    nombre: "",
    descripcion: ""
  });

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Carga profesionales y especialidades al montar
  useEffect(() => {
    cargarProfesionales();
    cargarEspecialidades();
  }, []);

  const cargarProfesionales = () => {
    fetch("http://localhost:8080/api/profesionales")
      .then(res => res.json())
      .then(data => setProfessionals(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  };

  const cargarEspecialidades = () => {
    fetch("http://localhost:8080/api/especialidades")
      .then(res => res.json())
      .then(data => setEspecialidades(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  };

  const abrirModalProfesional = () => {
    setForm({
      nombres: "",
      apellidos: "",
      correo: "",
      password: "1234p",
      especialidadId: "",
      numeroRegistro: "",
      horaInicio: "",
      horaFin: ""
    });
    setMensaje("");
    setError("");
    setModalProfesional(true);
  };

  const cerrarModalProfesional = () => {
    setModalProfesional(false);
    setMensaje("");
    setError("");
  };

  const abrirModalEspecialidad = (e) => {
    // Importante: evitamos que el click propague al formulario del profesional
    e.preventDefault();
    setFormEspecialidad({ nombre: "", descripcion: "" });
    setModalEspecialidad(true);
  };

  const cerrarModalEspecialidad = () => {
    setModalEspecialidad(false);
  };

  // Crea el profesional
  const handleSubmitProfesional = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/profesionales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          rol: user.rol
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear profesional");

      setMensaje("Profesional creado correctamente");
      cargarProfesionales(); // Actualiza la tabla sin recargar la página
      setTimeout(() => cerrarModalProfesional(), 1500);

    } catch (err) {
      setError(err.message);
    }
  };

  // Crea la especialidad desde el modal anidado
  const handleSubmitEspecialidad = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/especialidades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          rol: user.rol
        },
        body: JSON.stringify(formEspecialidad)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear especialidad");

      // Recarga las especialidades y selecciona la nueva automáticamente
      await cargarEspecialidades();
      setForm(prev => ({ ...prev, especialidadId: String(data.id) }));
      cerrarModalEspecialidad();

    } catch (err) {
      alert(err.message);
    }
  };

  if (!user || user.rol !== "ADMIN") {
    return <p>No tienes acceso</p>;
  }

  return (
    <>
      <Header />

      <div className="page-container">
        <div className="card">

          {/* Encabezado de la sección */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px"
          }}>
            <h2 className="page-title" style={{ margin: 0 }}>
              Profesionales
            </h2>
            <button className="btn btn-primary" style={{ width: "auto" }}
              onClick={abrirModalProfesional}>
              + Crear profesional
            </button>
          </div>

          {/* Tabla de profesionales */}
          {professionals.length === 0 ? (
            <p style={{ color: "var(--color-text-muted)" }}>
              No hay profesionales registrados.
            </p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Especialidad</th>
                    <th>Correo</th>
                    <th>Horario</th>
                  </tr>
                </thead>
                <tbody>
                  {professionals.map(p => (
                    <tr key={p.id}>
                      <td>{p.usuario?.nombres} {p.usuario?.apellidos}</td>
                      <td>{p.especialidad?.nombre}</td>
                      <td>{p.usuario?.correo}</td>
                      <td>{p.horaInicio} — {p.horaFin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Crear profesional */}
      {modalProfesional && (
        <div className="modal-overlay" onClick={cerrarModalProfesional}>
          <div className="modal-card" onClick={e => e.stopPropagation()}
            style={{ maxWidth: "500px" }}>

            <h3 className="modal-title">Crear profesional</h3>

            {mensaje && <p className="msg-success" style={{ marginBottom: "12px" }}>{mensaje}</p>}
            {error && <p className="msg-error" style={{ marginBottom: "12px" }}>{error}</p>}

            <form className="form" onSubmit={handleSubmitProfesional}>
              <input className="input" name="nombres" placeholder="Nombres"
                value={form.nombres}
                onChange={e => setForm({ ...form, nombres: e.target.value })}
                required />

              <input className="input" name="apellidos" placeholder="Apellidos"
                value={form.apellidos}
                onChange={e => setForm({ ...form, apellidos: e.target.value })}
                required />

              <input className="input" name="correo" type="email" placeholder="Correo"
                value={form.correo}
                onChange={e => setForm({ ...form, correo: e.target.value })}
                required />

              <p style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
                El profesional recibirá la contraseña temporal <strong>1234</strong>.
                Podrá cambiarla al ingresar.
              </p>

              {/* Select de especialidad con link para crear una nueva */}
              <div>
                <select className="input" name="especialidadId"
                  value={form.especialidadId}
                  onChange={e => setForm({ ...form, especialidadId: e.target.value })}
                  required>
                  <option value="">Seleccione especialidad</option>
                  {especialidades.map(e => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>
                  ))}
                </select>

                {/* Link para abrir el modal de crear especialidad */}
                <p style={{ marginTop: "6px", fontSize: "13px",
                  color: "var(--color-text-muted)" }}>
                  ¿No existe la especialidad?{" "}
                  <button
                    onClick={abrirModalEspecialidad}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--color-primary)",
                      cursor: "pointer",
                      fontSize: "13px",
                      padding: 0,
                      textDecoration: "underline"
                    }}
                  >
                    Créala aquí
                  </button>
                </p>
              </div>

              <input className="input" name="numeroRegistro"
                placeholder="Número de registro"
                value={form.numeroRegistro}
                onChange={e => setForm({ ...form, numeroRegistro: e.target.value })} />

              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "13px",
                    color: "var(--color-text-muted)", marginBottom: "4px",
                    display: "block" }}>
                    Hora inicio
                  </label>
                  <input className="input" type="time" name="horaInicio"
                    value={form.horaInicio}
                    onChange={e => setForm({ ...form, horaInicio: e.target.value })}
                    required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "13px",
                    color: "var(--color-text-muted)", marginBottom: "4px",
                    display: "block" }}>
                    Hora fin
                  </label>
                  <input className="input" type="time" name="horaFin"
                    value={form.horaFin}
                    onChange={e => setForm({ ...form, horaFin: e.target.value })}
                    required />
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                <button type="submit" className="btn btn-primary">
                  Crear profesional
                </button>
                <button type="button" className="btn btn-danger"
                  style={{ width: "auto" }}
                  onClick={cerrarModalProfesional}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal anidado: Crear especialidad — va encima del modal de profesional */}
      {modalEspecialidad && (
        <div className="modal-overlay"
          style={{ zIndex: 1100 }}
          onClick={cerrarModalEspecialidad}>
          <div className="modal-card"
            style={{ maxWidth: "400px", zIndex: 1101 }}
            onClick={e => e.stopPropagation()}>

            <h3 className="modal-title">Nueva especialidad</h3>
            <p className="modal-info">
              Al crearla quedará seleccionada automáticamente.
            </p>

            <form className="form" onSubmit={handleSubmitEspecialidad}>
              <input className="input" placeholder="Nombre de la especialidad *"
                value={formEspecialidad.nombre}
                onChange={e =>
                  setFormEspecialidad({ ...formEspecialidad, nombre: e.target.value })
                }
                required />

              <input className="input" placeholder="Descripción (opcional)"
                value={formEspecialidad.descripcion}
                onChange={e =>
                  setFormEspecialidad({ ...formEspecialidad, descripcion: e.target.value })
                } />

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" className="btn btn-primary">
                  Crear especialidad
                </button>
                <button type="button" className="btn btn-danger"
                  style={{ width: "auto" }}
                  onClick={cerrarModalEspecialidad}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}