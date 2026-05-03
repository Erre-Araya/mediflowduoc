import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Calendar.css";

//Genera bloques de 30 min entre horaInicio y horaFin
function generarBloques(inicio, fin) {
  const bloques = [];
  const [hI, mI] = inicio.split(":").map(Number);
  const [hF, mF] = fin.split(":").map(Number);
  let actual = hI * 60 + mI;
  const limite = hF * 60 + mF;
  while (actual < limite) {
    const h = String(Math.floor(actual / 60)).padStart(2, "0");
    const m = String(actual % 60).padStart(2, "0");
    bloques.push(`${h}:${m}`);
    actual += 30;
  }
  return bloques;
}

//Formatea fecha para mostrar: "Lunes 02 Mayo 2025"
function formatearFecha(fecha) {
  return fecha.toLocaleDateString("es-CL", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

//Convierte Date a string YYYY-MM-DD para el backend
function fechaParaAPI(fecha) {
  return fecha.toISOString().split("T")[0];
}

export default function Calendar() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [fechaActual, setFechaActual] = useState(new Date());
  const [profesionales, setProfesionales] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidadFiltro, setEspecialidadFiltro] = useState("");
  const [citasDelDia, setCitasDelDia] = useState([]);
  const [pacientes, setPacientes] = useState([]);

  // Modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState(null);
  const [form, setForm] = useState({
    pacienteId: "",
    motivo: "",
    // Para crear paciente nuevo
    crearPaciente: false,
    nombreNuevo: "",
    apellidoNuevo: "",
    correoNuevo: "",
  });

  //Cargar profesionales y especialidades al montar
  useEffect(() => {
    fetch("http://localhost:8080/api/profesionales")
      .then(res => res.json())
      .then(data => setProfesionales(Array.isArray(data) ? data : []));

    fetch("http://localhost:8080/api/especialidades")
      .then(res => res.json())
      .then(data => setEspecialidades(Array.isArray(data) ? data : []));

    fetch("http://localhost:8080/api/usuarios/rol/PACIENTE", {
      headers: { rol: user.rol }
    })
      .then(res => res.json())
      .then(data => setPacientes(Array.isArray(data) ? data : []));
  }, []);

  //Cargar citas cada vez que cambia la fecha
  useEffect(() => {
    fetch(`http://localhost:8080/api/citas/fecha/${fechaParaAPI(fechaActual)}`)
      .then(res => res.json())
      .then(data => setCitasDelDia(Array.isArray(data) ? data : []));
  }, [fechaActual]);

  //Profesionales filtrados por especialidad
  const profesionalesFiltrados = especialidadFiltro
    ? profesionales.filter(p => String(p.especialidad?.id) === especialidadFiltro)
    : profesionales;

  // odos los bloques del día (unión de todos los horarios)
  const todosLosBloques = [...new Set(
    profesionalesFiltrados.flatMap(p =>
      generarBloques(
        p.horaInicio || "08:00",
        p.horaFin || "18:00"
      )
    )
  )].sort();

  //Verifica si un bloque está ocupado
  const estaOcupado = (profesionalId, hora) => {
    return citasDelDia.some(
      c => c.profesional?.id === profesionalId && c.hora?.startsWith(hora)
    );
  };

  //Obtiene la cita de un bloque ocupado
  const getCita = (profesionalId, hora) => {
    return citasDelDia.find(
      c => c.profesional?.id === profesionalId && c.hora?.startsWith(hora)
    );
  };

  const handleBloqueClick = (profesional, hora) => {
    if (estaOcupado(profesional.id, hora)) return;
    setBloqueSeleccionado({ profesional, hora });
    setForm({
      pacienteId: "",
      motivo: "",
      crearPaciente: false,
      nombreNuevo: "",
      apellidoNuevo: "",
      correoNuevo: ""
    });
    setModalAbierto(true);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();

    try {
      let pacienteId = form.pacienteId;

      //Si eligió crear un paciente nuevo, primero lo crea
      if (form.crearPaciente) {
        const res = await fetch("http://localhost:8080/api/usuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombres: form.nombreNuevo,
            apellidos: form.apellidoNuevo,
            correo: form.correoNuevo,
            password: "1234",
            rol: "PACIENTE"
          })
        });
        const nuevo = await res.json();
        if (!res.ok) throw new Error(nuevo.error || "Error al crear paciente");
        pacienteId = nuevo.id;

        //Lo agrega a la lista local para futuras citas
        setPacientes(prev => [...prev, nuevo]);
      }

      //Crea la cita
      const res = await fetch("http://localhost:8080/api/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioId: pacienteId,
          especialidadId: bloqueSeleccionado.profesional.especialidad?.id,
          profesionalId: bloqueSeleccionado.profesional.id,
          fecha: fechaParaAPI(fechaActual),
          hora: bloqueSeleccionado.hora,
          motivo: form.motivo,
          observaciones: ""
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear cita");

      //Actualiza las citas del día sin hacer otro fetch
      setCitasDelDia(prev => [...prev, data]);
      setModalAbierto(false);

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <Header />

      <div className="page-container">

        {/* Barra superior */}
        <div className="calendar-toolbar">
          <div className="calendar-nav">
            <button
              className="btn btn-sm"
              onClick={() => {
                const d = new Date(fechaActual);
                d.setDate(d.getDate() - 1);
                setFechaActual(d);
              }}
            >
              ←
            </button>

            <span className="calendar-fecha">
              {formatearFecha(fechaActual)}
            </span>

            <button
              className="btn btn-sm"
              onClick={() => {
                const d = new Date(fechaActual);
                d.setDate(d.getDate() + 1);
                setFechaActual(d);
              }}
            >
              →
            </button>
          </div>

          <select
            className="input"
            style={{ maxWidth: "240px" }}
            value={especialidadFiltro}
            onChange={e => setEspecialidadFiltro(e.target.value)}
          >
            <option value="">Todas las especialidades</option>
            {especialidades.map(e => (
              <option key={e.id} value={e.id}>{e.nombre}</option>
            ))}
          </select>
        </div>

        {/* Calendario */}
        <div className="table-container">
          <table className="calendar-table">
            <thead>
              <tr>
                <th className="calendar-th-hora">Hora</th>
                {profesionalesFiltrados.map(p => (
                  <th key={p.id}>
                    <div className="calendar-profesional-nombre">
                      {p.usuario?.nombres} {p.usuario?.apellidos}
                    </div>
                    <div className="calendar-profesional-esp">
                      {p.especialidad?.nombre}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {todosLosBloques.map(hora => (
                <tr key={hora}>
                  <td className="calendar-hora">{hora}</td>
                  {profesionalesFiltrados.map(p => {
                    const ocupado = estaOcupado(p.id, hora);
                    const cita = getCita(p.id, hora);
                    const fueraHorario =
                      hora < (p.horaInicio || "08:00") ||
                      hora >= (p.horaFin || "18:00");

                    if (fueraHorario) {
                      return <td key={p.id} className="calendar-bloque-fuera" />;
                    }

                    return (
                      <td
                        key={p.id}
                        className={`calendar-bloque ${ocupado ? "ocupado" : "libre"}`}
                        onClick={() => handleBloqueClick(p, hora)}
                        title={ocupado
                          ? `${cita?.usuario?.nombres} ${cita?.usuario?.apellidos} — ${cita?.estadoCita}`
                          : "Disponible — clic para agendar"
                        }
                      >
                        {ocupado ? (
                          <div className="calendar-cita-info">
                            <span className="calendar-cita-nombre">
                              {cita?.usuario?.nombres}
                            </span>
                            <span className={`calendar-badge ${cita?.estadoCita?.toLowerCase()}`}>
                              {cita?.estadoCita}
                            </span>
                          </div>
                        ) : (
                          <span className="calendar-libre-text">+ Agendar</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalAbierto && (
        <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Nueva cita</h3>

            <p className="modal-info">
              <strong>{bloqueSeleccionado?.profesional?.usuario?.nombres} {bloqueSeleccionado?.profesional?.usuario?.apellidos}</strong>
              {" — "}{bloqueSeleccionado?.hora} — {formatearFecha(fechaActual)}
            </p>

            <form className="form" onSubmit={handleGuardar}>

              {/* Toggle crear paciente */}
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={form.crearPaciente}
                    onChange={e => setForm({ ...form, crearPaciente: e.target.checked })}
                    style={{ marginRight: "8px" }}
                  />
                  Crear paciente nuevo
                </label>
              </div>

              {form.crearPaciente ? (
                <>
                  <input
                    className="input"
                    placeholder="Nombres"
                    value={form.nombreNuevo}
                    onChange={e => setForm({ ...form, nombreNuevo: e.target.value })}
                    required
                  />
                  <input
                    className="input"
                    placeholder="Apellidos"
                    value={form.apellidoNuevo}
                    onChange={e => setForm({ ...form, apellidoNuevo: e.target.value })}
                    required
                  />
                  <input
                    className="input"
                    type="email"
                    placeholder="Correo"
                    value={form.correoNuevo}
                    onChange={e => setForm({ ...form, correoNuevo: e.target.value })}
                    required
                  />
                </>
              ) : (
                <select
                  className="input"
                  value={form.pacienteId}
                  onChange={e => setForm({ ...form, pacienteId: e.target.value })}
                  required
                >
                  <option value="">Selecciona paciente</option>
                  {pacientes.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nombres} {p.apellidos}
                    </option>
                  ))}
                </select>
              )}

              <input
                className="input"
                placeholder="Motivo (opcional)"
                value={form.motivo}
                onChange={e => setForm({ ...form, motivo: e.target.value })}
              />

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" className="btn btn-primary">
                  Guardar cita
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setModalAbierto(false)}
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