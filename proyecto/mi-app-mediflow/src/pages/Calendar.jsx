import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Calendar.css";

function horaAMinutos(hora) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

//Genera bloques de 30 min entre horaInicio y horaFin
function generarBloques(inicio, fin) {
  const bloques = [];

  if (!inicio || !fin) return bloques;

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

function formatearFecha(fecha) {
  return fecha.toLocaleDateString("es-CL", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

function fechaParaAPI(fecha) {
  return fecha.toISOString().split("T")[0];
}

export default function Calendar({ mode }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.rol === "ADMIN";

  const [fechaActual, setFechaActual] = useState(new Date());
  const [profesionales, setProfesionales] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidadFiltro, setEspecialidadFiltro] = useState("");
  const [citasDelDia, setCitasDelDia] = useState([]);
  const [pacientes, setPacientes] = useState([]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState(null);

  const [form, setForm] = useState({
    pacienteId: "",
    motivo: "",
    crearPaciente: false,
    nombreNuevo: "",
    apellidoNuevo: "",
    correoNuevo: "",
    busquedaPaciente: ""
  });

  //Carga inicial
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

  //✅ SOLO UN useEffect (CORRECTO)
  useEffect(() => {
    let url = "";

    if (user?.rol === "PROFESIONAL") {
      url = `http://localhost:8080/api/citas/profesional/usuario/${user.id}`;
    } else if (user?.rol === "ADMIN") {
      url = `http://localhost:8080/api/citas/fecha/${fechaParaAPI(fechaActual)}`;
    } else {
      url = `http://localhost:8080/api/citas/usuario/${user.id}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => setCitasDelDia(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));

  }, [fechaActual]);

  const profesionalesFiltrados =
    user?.rol === "ADMIN"
      ? especialidadFiltro
        ? profesionales.filter(p => String(p.especialidad?.id) === especialidadFiltro)
        : profesionales
      : profesionales.filter(p => p.usuario?.id === user?.id);

  const todosLosBloques = [...new Set(
    profesionalesFiltrados.flatMap(p =>
      generarBloques(p.horaInicio || "08:00", p.horaFin || "18:00")
    )
  )].sort();

  const estaOcupado = (profesionalId, hora) => {
    return citasDelDia.some(
      c =>
        c.profesional?.id === profesionalId &&
        c.hora?.startsWith(hora) &&
        c.fecha === fechaParaAPI(fechaActual)
    );
  };

  const getCita = (profesionalId, hora) => {
    return citasDelDia.find(
      c =>
        c.profesional?.id === profesionalId &&
        c.hora?.startsWith(hora) &&
        c.fecha === fechaParaAPI(fechaActual)
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
      correoNuevo: "",
      busquedaPaciente: ""
    });
    setModalAbierto(true);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();

    try {
      let pacienteId = form.pacienteId;

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
        setPacientes(prev => [...prev, nuevo]);
      }

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

      setCitasDelDia(prev => [...prev, data]);
      setModalAbierto(false);

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <div className="page-container">

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
                      horaAMinutos(hora) < horaAMinutos(p.horaInicio || "08:00") ||
                      horaAMinutos(hora) >= horaAMinutos(p.horaFin || "18:00");

                    if (fueraHorario) {
                      return <td key={`${p.id}-${hora}`} className="calendar-bloque-fuera" />;
                    }

                    return (
                      <td
                        key={p.id}
                        className={`calendar-bloque ${ocupado ? "ocupado" : "libre"}`}
                        onClick={ocupado ? undefined : () => handleBloqueClick(p, hora)}
                        style={{ cursor: ocupado ? "not-allowed" : "pointer" }}
                        title={ocupado
                          ? `${cita?.usuario?.nombres} ${cita?.usuario?.apellidos} — ${cita?.estadoCita}`
                          : "Disponible — clic para agendar"}
                      >
                        {ocupado && (
                          <div className="calendar-cita-info">
                            <span className="calendar-cita-nombre">
                              {cita?.usuario?.nombres}
                            </span>
                            <span className={`calendar-badge ${cita?.estadoCita?.toLowerCase()}`}>
                              {cita?.estadoCita}
                            </span>
                          </div>
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

      {/* MODAL */}
      {modalAbierto && (
        <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Nueva cita</h3>

            <p className="modal-info">
              <strong>
                {bloqueSeleccionado?.profesional?.usuario?.nombres} {bloqueSeleccionado?.profesional?.usuario?.apellidos}
              </strong>
              {" — "}{bloqueSeleccionado?.hora} — {formatearFecha(fechaActual)}
            </p>

            <form className="form" onSubmit={handleGuardar}>

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
                  <input className="input" placeholder="Nombres"
                    value={form.nombreNuevo}
                    onChange={e => setForm({ ...form, nombreNuevo: e.target.value })}
                    required />

                  <input className="input" placeholder="Apellidos"
                    value={form.apellidoNuevo}
                    onChange={e => setForm({ ...form, apellidoNuevo: e.target.value })}
                    required />

                  <input className="input" type="email" placeholder="Correo"
                    value={form.correoNuevo}
                    onChange={e => setForm({ ...form, correoNuevo: e.target.value })}
                    required />
                </>
              ) : (
                <>
                  <input
                    className="input"
                    placeholder="Buscar paciente..."
                    value={form.busquedaPaciente}
                    onChange={e => setForm({ ...form, busquedaPaciente: e.target.value })}
                  />

                  <div className="paciente-lista">
                    {pacientes
                      .filter(p =>
                        `${p.nombres} ${p.apellidos}`.toLowerCase()
                          .includes(form.busquedaPaciente.toLowerCase())
                      )
                      .slice(0, 8)
                      .map(p => (
                        <div
                          key={p.id}
                          className="paciente-item"
                          onClick={() =>
                            setForm({
                              ...form,
                              pacienteId: p.id,
                              busquedaPaciente: `${p.nombres} ${p.apellidos}`
                            })
                          }
                        >
                          {p.nombres} {p.apellidos}
                        </div>
                      ))}
                  </div>
                </>
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
                <button type="button" className="btn btn-danger"
                  onClick={() => setModalAbierto(false)}>
                  Cancelar
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}