import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Calendar.css";

// Convierte "HH:MM" a minutos para poder comparar horas correctamente
function horaAMinutos(hora) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

// Genera bloques de 30 minutos entre horaInicio y horaFin
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

// Formatea la fecha para mostrarla al usuario en español
function formatearFecha(fecha) {
  return fecha.toLocaleDateString("es-CL", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

// Convierte un objeto Date a string "YYYY-MM-DD" para el backend
function fechaParaAPI(fecha) {
  return fecha.toISOString().split("T")[0];
}

export default function Calendar() {
  const user = JSON.parse(localStorage.getItem("user"));

  // Estados del calendario
  const [fechaActual, setFechaActual] = useState(new Date());
  const [profesionales, setProfesionales] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidadFiltro, setEspecialidadFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("ACTIVAS");
  const [citasDelDia, setCitasDelDia] = useState([]);

  // Estados para el formulario del modal
  const [pacientes, setPacientes] = useState([]);
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);

  // Estados del modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState(null);

  // Estados del buscador de pacientes
  const [busqueda, setBusqueda] = useState("");
  const [mostrarLista, setMostrarLista] = useState(false);

  // Estado del formulario dentro del modal
  const [form, setForm] = useState({
    pacienteId: "",
    motivo: "",
    crearPaciente: false,
    run: "",
    nombreNuevo: "",
    apellidoNuevo: "",
    correoNuevo: "",
    telefonoNuevo: "",
    regionId: "",
    comunaId: "",
    direccion: ""
  });

  // Carga inicial: profesionales, especialidades, pacientes y regiones
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

    fetch("http://localhost:8080/api/regiones")
      .then(res => res.json())
      .then(data => setRegiones(Array.isArray(data) ? data : []));
  }, []);

  // Carga comunas cuando el usuario selecciona una región en el formulario
  useEffect(() => {
    if (form.regionId) {
      fetch(`http://localhost:8080/api/comunas/region/${form.regionId}`)
        .then(res => res.json())
        .then(data => setComunas(Array.isArray(data) ? data : []));
    } else {
      setComunas([]);
    }
  }, [form.regionId]);

  // Carga las citas del día — se vuelve a ejecutar cada vez que cambia la fecha
  useEffect(() => {
    let url = "";

    if (user?.rol === "ADMIN") {
      url = `http://localhost:8080/api/citas/fecha/${fechaParaAPI(fechaActual)}`;
    } else if (user?.rol === "PROFESIONAL") {
      url = `http://localhost:8080/api/citas/profesional/usuario/${user.id}`;
    }

    if (!url) return;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const todas = Array.isArray(data) ? data : [];

        const filtradas =
          user?.rol === "PROFESIONAL"
            ? todas.filter(c => c.fecha === fechaParaAPI(fechaActual))
            : todas;

        setCitasDelDia(filtradas);
      })
      .catch(err => console.error("Error cargando citas:", err));
  }, [fechaActual, estadoFiltro]);

  // Filtra los profesionales según el rol y la especialidad seleccionada
  const profesionalesFiltrados =
    user?.rol === "ADMIN"
      ? especialidadFiltro
        ? profesionales.filter(
            p => String(p.especialidad?.id) === String(especialidadFiltro)
          )
        : profesionales
      : profesionales.filter(
          p => Number(p.usuario?.id) === Number(user?.id)
        );

  // Genera todos los bloques horarios del día combinando los horarios de todos los profesionales visibles
  const todosLosBloques = [
    ...new Set(
      profesionalesFiltrados.flatMap(p =>
        generarBloques(p.horaInicio || "08:00", p.horaFin || "18:00")
      )
    )
  ].sort();

  const citasFiltradas = citasDelDia.filter(c => {
    if (estadoFiltro === "ACTIVAS") return c.estadoCita !== "CANCELADA";
    if (estadoFiltro === "CANCELADA") return c.estadoCita === "CANCELADA";
    return true;
  });

  // Usa Number() para evitar el bug de comparación entre Java long y JS
  const estaOcupado = (profesionalId, hora) => {
    return citasFiltradas.some(
      c =>
        Number(c.profesional?.id) === Number(profesionalId) &&
        c.hora?.startsWith(hora)
    );
  };

  const getCita = (profesionalId, hora) => {
    return citasFiltradas.find(
      c =>
        Number(c.profesional?.id) === Number(profesionalId) &&
        c.hora?.startsWith(hora)
    );
  };

  // Cierra el modal y limpia todos los estados relacionados
  const cerrarModal = () => {
    setModalAbierto(false);
    setBusqueda("");
    setMostrarLista(false);
    setBloqueSeleccionado(null);
    setForm({
      pacienteId: "",
      motivo: "",
      crearPaciente: false,
      run: "",
      nombreNuevo: "",
      apellidoNuevo: "",
      correoNuevo: "",
      telefonoNuevo: "",
      regionId: "",
      comunaId: "",
      direccion: ""
    });
  };

  // Se ejecuta al hacer clic en un bloque libre del calendario
  const handleBloqueClick = (profesional, hora) => {
    //PROFESIONAL no puede agendar
    if (user?.rol !== "ADMIN") return;

    if (estaOcupado(profesional.id, hora)) return;

    setBloqueSeleccionado({ profesional, hora });
    setBusqueda("");
    setMostrarLista(false);
    setForm({
      pacienteId: "",
      motivo: "",
      crearPaciente: false,
      run: "",
      nombreNuevo: "",
      apellidoNuevo: "",
      correoNuevo: "",
      telefonoNuevo: "",
      regionId: "",
      comunaId: "",
      direccion: ""
    });
    setModalAbierto(true);
  };

  // Guarda la cita al enviar el formulario del modal
  const handleGuardar = async (e) => {
    e.preventDefault();

    try {
      let pacienteId = form.pacienteId;

      // Si o "crear paciente nuevo", primero lo registra
      if (form.crearPaciente) {
        const res = await fetch("http://localhost:8080/api/usuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            run: form.run || null,
            nombres: form.nombreNuevo,
            apellidos: form.apellidoNuevo,
            correo: form.correoNuevo,
            telefono: form.telefonoNuevo || null,
            regionId: form.regionId || null,
            comunaId: form.comunaId || null,
            direccion: form.direccion || null,
            password: "1234pac",
            rol: "PACIENTE"
          })
        });

        const nuevo = await res.json();
        if (!res.ok) throw new Error(nuevo.error || "Error al crear paciente");

        pacienteId = nuevo.id;
        setPacientes(prev => [...prev, nuevo]);
      }

      if (!pacienteId) {
        throw new Error("Debes seleccionar o crear un paciente");
      }

      // Crea la cita con los datos del bloque seleccionado
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

      // Actualiza el calendario en pantalla sin recargar la página
      setCitasDelDia(prev => [...prev, data]);
      cerrarModal();

    } catch (err) {
      alert(err.message);
    }
  };

  const handleClickBloque = (profesional, hora) => {
    const cita = getCita(profesional.id, hora);

    if (cita) {
      setBloqueSeleccionado({ profesional, hora, cita });
      setModalAbierto(true);
      return;
    }

    handleBloqueClick(profesional, hora);
  };

  const cambiarEstado = async (estado) => {
    await fetch(`http://localhost:8080/api/citas/${bloqueSeleccionado.cita.id}/estado`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado })
    });

    setCitasDelDia(prev =>
      prev.map(c =>
        c.id === bloqueSeleccionado.cita.id
          ? { ...c, estadoCita: estado }
          : c
      )
    );

    cerrarModal();
  };

  return (
    <>
      <div className="page-container">

        {/* Barra superior: navegación de fecha y filtro por especialidad */}
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

          <div className="calendar-filtros">
            {user?.rol === "ADMIN" && (
              <select
                className="input"
                value={especialidadFiltro}
                onChange={e => setEspecialidadFiltro(e.target.value)}
              >
                <option value="">Todas las especialidades</option>
                {especialidades.map(e => (
                  <option key={e.id} value={e.id}>{e.nombre}</option>
                ))}
              </select>
            )}

            <select
              className="input"
              value={estadoFiltro}
              onChange={e => setEstadoFiltro(e.target.value)}
            >
              <option value="ACTIVAS">Citas activas</option>
              <option value="CANCELADA">Citas inactivas</option>
            </select>
          </div>
        </div>

        {/* Tabla del calendario */}
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
                      return (
                        <td
                          key={`fuera-${p.id}-${hora}`}
                          className="calendar-bloque-fuera"
                        />
                      );
                    }

                    return (
                      <td
                        key={`bloque-${p.id}-${hora}`}
                        className={`calendar-bloque ${
                          ocupado
                            ? `ocupado ${cita?.estadoCita?.toLowerCase()}`
                            : user?.rol === "ADMIN"
                              ? "libre"
                              : "bloque-disabled"
                        }`}
                        onClick={() => {
                          if (user?.rol !== "ADMIN" && !ocupado) return;
                          handleClickBloque(p, hora);
                        }}
                        style={{
                          cursor:
                            user?.rol === "ADMIN"
                              ? ocupado
                                ? "not-allowed"
                                : "pointer"
                              : "default"
                        }}
                        title={
                          ocupado
                            ? `${cita?.usuario?.nombres} ${cita?.usuario?.apellidos} — ${cita?.estadoCita}`
                            : "Disponible — clic para agendar"
                        }
                      >
                        {ocupado && (
                          <div className="calendar-cita-info">
                            <span className="calendar-cita-nombre">
                              {cita?.usuario?.nombres}
                            </span>
                            <span
                              className={`calendar-badge ${cita?.estadoCita?.toLowerCase()}`}
                            >
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

      {/* Modal para agendar — solo se renderiza cuando modalAbierto es true */}
      {modalAbierto && bloqueSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>

            <h3 className="modal-title">
              {bloqueSeleccionado?.cita ? "Detalle de cita" : "Nueva cita"}
            </h3>

            <p className="modal-info">
              <strong>
                {bloqueSeleccionado.profesional.usuario?.nombres}{" "}
                {bloqueSeleccionado.profesional.usuario?.apellidos}
              </strong>
              {" — "}
              {bloqueSeleccionado.hora}
              {" — "}
              {formatearFecha(fechaActual)}
            </p>

            {bloqueSeleccionado?.cita && (
              <div className="cita-detalle">
                <p><strong>Paciente:</strong> {bloqueSeleccionado.cita.usuario?.nombres} {bloqueSeleccionado.cita.usuario?.apellidos}</p>
                <p><strong>Estado:</strong> {bloqueSeleccionado.cita.estadoCita}</p>
                <p><strong>Motivo:</strong> {bloqueSeleccionado.cita.motivo || "Sin motivo"}</p>
              </div>
            )}

            <form
              className="form"
              onSubmit={bloqueSeleccionado?.cita ? e => e.preventDefault() : handleGuardar}
            >

              {/* Toggle: buscar paciente existente o crear uno nuevo */}
              {!bloqueSeleccionado?.cita && (
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  cursor: "pointer",
                  color: "var(--color-text-muted)"
                }}>
                  <input
                    type="checkbox"
                    checked={form.crearPaciente}
                    onChange={e => {
                      setForm({ ...form, crearPaciente: e.target.checked, pacienteId: "" });
                      setBusqueda("");
                      setMostrarLista(false);
                    }}
                  />
                  Crear paciente nuevo
                </label>
              )}

              {!bloqueSeleccionado?.cita && user?.rol === "ADMIN" && (
                <>
                  {form.crearPaciente ? (
                    /* Formulario completo para registrar paciente nuevo */
                    <>
                      <input
                        className="input"
                        placeholder="RUN (sin puntos ni guión)"
                        value={form.run}
                        onChange={e => setForm({ ...form, run: e.target.value })}
                      />
                      <input
                        className="input"
                        placeholder="Nombres *"
                        value={form.nombreNuevo}
                        onChange={e => setForm({ ...form, nombreNuevo: e.target.value })}
                        required
                      />
                      <input
                        className="input"
                        placeholder="Apellidos *"
                        value={form.apellidoNuevo}
                        onChange={e => setForm({ ...form, apellidoNuevo: e.target.value })}
                        required
                      />
                      <input
                        className="input"
                        type="email"
                        placeholder="Correo electrónico *"
                        value={form.correoNuevo}
                        onChange={e => setForm({ ...form, correoNuevo: e.target.value })}
                        required
                      />
                      <input
                        className="input"
                        placeholder="Teléfono"
                        value={form.telefonoNuevo}
                        onChange={e => setForm({ ...form, telefonoNuevo: e.target.value })}
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
                      <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                        El paciente recibirá la contraseña temporal que podrá cambiar al ingresar.
                      </p>
                    </>
                  ) : (
                    /* Buscador de paciente existente con dropdown */
                    <div style={{ position: "relative" }}>
                      <input
                        className="input"
                        placeholder="Buscar paciente por nombre..."
                        style={{ width: "100%" }}
                        value={busqueda}
                        autoComplete="off"
                        onChange={e => {
                          setBusqueda(e.target.value);
                          setMostrarLista(true);
                          setForm({ ...form, pacienteId: "" });
                        }}
                        onFocus={() => setMostrarLista(true)}
                      />

                      {mostrarLista && busqueda.length > 0 && (
                        <div className="paciente-dropdown">
                          {pacientes
                            .filter(p =>
                              `${p.nombres} ${p.apellidos}`
                                .toLowerCase()
                                .includes(busqueda.toLowerCase())
                            )
                            .slice(0, 6)
                            .map(p => (
                              <div
                                key={p.id}
                                className="paciente-dropdown-item"
                                onClick={() => {
                                  setForm({ ...form, pacienteId: p.id });
                                  setBusqueda(`${p.nombres} ${p.apellidos}`);
                                  setMostrarLista(false);
                                }}
                              >
                                <span className="paciente-nombre">
                                  {p.nombres} {p.apellidos}
                                </span>
                                <span className="paciente-correo">{p.correo}</span>
                              </div>
                            ))}

                          {pacientes.filter(p =>
                            `${p.nombres} ${p.apellidos}`
                              .toLowerCase()
                              .includes(busqueda.toLowerCase())
                          ).length === 0 && (
                            <div className="paciente-dropdown-vacio">
                              No se encontraron pacientes
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Motivo de consulta */}
                  <input
                    className="input"
                    placeholder="Motivo (opcional)"
                    value={form.motivo}
                    onChange={e => setForm({ ...form, motivo: e.target.value })}
                  />

                  {/* Botones de acción */}
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button type="submit" className="btn btn-primary">
                      Guardar cita
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

                </>
              )}

            </form>

          {bloqueSeleccionado?.cita && user?.rol === "ADMIN" && (() => {
            const estado = bloqueSeleccionado.cita.estadoCita;

            if (
              estado === "CANCELADA" ||
              estado === "ASISTIDA" ||
              estado === "NO_ASISTIDA"
            ) {
              return null;
            }

            return (
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>

                {/* AGENDADA */}
                {estado === "AGENDADA" && (
                  <>
                    <button
                      className="btn btn-primary"
                      onClick={() => cambiarEstado("CONFIRMADA")}
                    >
                      Confirmar cita
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => cambiarEstado("CANCELADA")}
                    >
                      Cancelar cita
                    </button>
                  </>
                )}

                {/* CONFIRMADA */}
                {estado === "CONFIRMADA" && (
                  <>
                    <button
                      className="btn btn-primary"
                      onClick={() => cambiarEstado("ASISTIDA")}
                    >
                      Asistió a cita
                    </button>

                    <button
                      className="btn btn-warning"
                      onClick={() => cambiarEstado("NO_ASISTIDA")}
                    >
                      No asistió
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => cambiarEstado("CANCELADA")}
                    >
                      Cancelar cita
                    </button>
                  </>
                )}

              </div>
            );
          })()}
          </div>
        </div>
      )}
    </>
  );
}