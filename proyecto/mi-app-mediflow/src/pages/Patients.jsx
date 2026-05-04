import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";

export default function Patients() {
  const user = JSON.parse(localStorage.getItem("user"));

  // Lista de pacientes
  const [patients, setPatients] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // Control del modal de crear paciente (solo admin)
  const [modalAbierto, setModalAbierto] = useState(false);

  // Datos para los selects de región y comuna
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);

  // Mensajes de feedback dentro del modal
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Formulario del paciente nuevo
  const [form, setForm] = useState({
    run: "",
    nombres: "",
    apellidos: "",
    correo: "",
    telefono: "",
    regionId: "",
    comunaId: "",
    direccion: "",
    password: "1234pac",
    rol: "PACIENTE"
  });

  // Carga la lista de pacientes según el rol
  const cargarPacientes = () => {
    if (!user) return;

    // El profesional solo ve sus propios pacientes
    // El admin ve todos los pacientes del sistema
    const url =
      user.rol === "PROFESIONAL"
        ? `http://localhost:8080/api/citas/pacientes/profesional/${user.id}`
        : `http://localhost:8080/api/usuarios/rol/PACIENTE`;

    fetch(url, { headers: { rol: user.rol } })
      .then(res => res.json())
      .then(data => setPatients(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  };

  // Carga inicial: pacientes y regiones
  useEffect(() => {
    cargarPacientes();

    fetch("http://localhost:8080/api/regiones")
      .then(res => res.json())
      .then(data => setRegiones(Array.isArray(data) ? data : []));
  }, []);

  // Carga las comunas cuando el admin selecciona una región en el formulario
  useEffect(() => {
    if (form.regionId) {
      fetch(`http://localhost:8080/api/comunas/region/${form.regionId}`)
        .then(res => res.json())
        .then(data => setComunas(Array.isArray(data) ? data : []));
    } else {
      setComunas([]);
    }
  }, [form.regionId]);

  const abrirModal = () => {
    setForm({
      run: "",
      nombres: "",
      apellidos: "",
      correo: "",
      telefono: "",
      regionId: "",
      comunaId: "",
      direccion: "",
      password: "1234pac",
      rol: "PACIENTE"
    });
    setMensaje("");
    setError("");
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setMensaje("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear paciente");

      setMensaje("Paciente creado correctamente. Contraseña temporal: 1234pac");

      // Actualiza la tabla sin cerrar el modal,
      // así el admin puede crear otro sin volver a abrirlo
      cargarPacientes();

      // Cierra el modal después de un momento
      setTimeout(() => cerrarModal(), 1800);

    } catch (err) {
      setError(err.message);
    }
  };

  const pacientesFiltrados = patients.filter(p =>
    `${p.nombres} ${p.apellidos} ${p.correo}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  if (!user || (user.rol !== "PROFESIONAL" && user.rol !== "ADMIN")) {
    return (
      <div className="page-container">
        <div className="card">
          <p>No tienes acceso a esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />

      <div className="page-container">
        <div className="card">

          {/* Encabezado: título + botón crear (solo admin) */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            gap: "16px"
          }}>
            <h2 className="page-title" style={{ margin: 0 }}>
              {user.rol === "PROFESIONAL" ? "Mis pacientes" : "Pacientes"}
            </h2>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>

              <input
                className="input"
                placeholder="Buscar paciente..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                style={{ maxWidth: "220px" }}
              />

              {user.rol === "ADMIN" && (
                <button
                  className="btn btn-primary"
                  style={{ width: "auto" }}
                  onClick={abrirModal}
                >
                  + Crear paciente
                </button>
              )}

            </div>
          </div>

          {/* Tabla de pacientes */}
          {pacientesFiltrados.length === 0 ? (
            <p style={{ color: "var(--color-text-muted)" }}>
              No hay pacientes para mostrar.
            </p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nombres</th>
                    <th>Apellidos</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                  </tr>
                </thead>
                <tbody>
                  {pacientesFiltrados.map(p => (
                    <tr key={p.id}>
                      <td>{p.nombres}</td>
                      <td>{p.apellidos}</td>
                      <td>{p.correo}</td>
                      <td>{p.telefono || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>

      {/* Modal: crear paciente — solo visible para admin */}
      {modalAbierto && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div
            className="modal-card"
            style={{ maxWidth: "500px" }}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="modal-title">Crear paciente</h3>

            {mensaje && (
              <p className="msg-success" style={{ marginBottom: "12px" }}>
                {mensaje}
              </p>
            )}
            {error && (
              <p className="msg-error" style={{ marginBottom: "12px" }}>
                {error}
              </p>
            )}

            <form className="form" onSubmit={handleSubmit}>

              <input
                className="input"
                placeholder="RUN (sin puntos ni guión)"
                value={form.run}
                onChange={e => setForm({ ...form, run: e.target.value })}
              />

              <input
                className="input"
                placeholder="Nombres *"
                value={form.nombres}
                onChange={e => setForm({ ...form, nombres: e.target.value })}
                required
              />

              <input
                className="input"
                placeholder="Apellidos *"
                value={form.apellidos}
                onChange={e => setForm({ ...form, apellidos: e.target.value })}
                required
              />

              <input
                className="input"
                type="email"
                placeholder="Correo electrónico *"
                value={form.correo}
                onChange={e => setForm({ ...form, correo: e.target.value })}
                required
              />

              <input
                className="input"
                placeholder="Teléfono"
                value={form.telefono}
                onChange={e => setForm({ ...form, telefono: e.target.value })}
              />

              <input
                className="input"
                placeholder="Dirección"
                value={form.direccion}
                onChange={e => setForm({ ...form, direccion: e.target.value })}
              />

              <select
                className="input"
                value={form.regionId}
                onChange={e =>
                  setForm({ ...form, regionId: e.target.value, comunaId: "" })
                }
              >
                <option value="">Selecciona región</option>
                {regiones.map(r => (
                  <option key={r.id} value={r.id}>{r.nombre}</option>
                ))}
              </select>

              <select
                className="input"
                value={form.comunaId}
                onChange={e => setForm({ ...form, comunaId: e.target.value })}
                disabled={!form.regionId}
              >
                <option value="">Selecciona comuna</option>
                {comunas.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>

              <p style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
                El paciente recibirá la contraseña temporal que podrá cambiar al ingresar.
              </p>

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" className="btn btn-primary">
                  Crear paciente
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  style={{ width: "auto" }}
                  onClick={cerrarModal}
                >
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