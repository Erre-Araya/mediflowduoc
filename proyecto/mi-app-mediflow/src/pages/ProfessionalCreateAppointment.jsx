import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { createAppointment } from "../services/appointmentService";

export default function ProfessionalCreateAppointment() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [pacientes, setPacientes] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [profesionales, setProfesionales] = useState([]);

  const [form, setForm] = useState({
    pacienteId: "",
    especialidadId: "",
    profesionalId: "",
    fecha: "",
    hora: "",
    motivo: "",
    observaciones: ""
  });

  if (!user || user.rol !== "PROFESIONAL") {
    return <p>No tienes acceso</p>;
  }

  const generarHoras = (inicio, fin) => {
    const horas = [];

    if (!inicio || !fin) return horas;

    const [hInicio, mInicio] = inicio.split(":").map(Number);
    const [hFin, mFin] = fin.split(":").map(Number);

    let actual = hInicio * 60 + mInicio;
    const limite = hFin * 60 + mFin;

    while (actual < limite) {
      const h = String(Math.floor(actual / 60)).padStart(2, "0");
      const m = String(actual % 60).padStart(2, "0");

      horas.push(`${h}:${m}`);
      actual += 30;
    }

    return horas;
  };

  const profesionalSeleccionado = profesionales.find(
    (p) => String(p.id) === String(form.profesionalId)
  );

  const horasDisponibles = profesionalSeleccionado
    ? generarHoras(profesionalSeleccionado.horaInicio, profesionalSeleccionado.horaFin)
    : [];

  useEffect(() => {
    fetch("http://localhost:8080/api/usuarios/rol/PACIENTE", {
      headers: { rol: user.rol }
    })
      .then(res => res.json())
      .then(data => setPacientes(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));

    fetch("http://localhost:8080/api/especialidades")
      .then(res => res.json())
      .then(data => setEspecialidades(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (form.especialidadId) {
      fetch(`http://localhost:8080/api/profesionales/especialidad/${form.especialidadId}`)
        .then(res => res.json())
        .then(data => setProfesionales(Array.isArray(data) ? data : []))
        .catch(err => console.error(err));
    } else {
      setProfesionales([]);
    }
  }, [form.especialidadId]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createAppointment({
        usuarioId: form.pacienteId,
        especialidadId: form.especialidadId,
        profesionalId: form.profesionalId,
        fecha: form.fecha,
        hora: form.hora,
        motivo: form.motivo,
        observaciones: form.observaciones
      });

      alert("Cita agendada correctamente");

      setForm({
        pacienteId: "",
        especialidadId: "",
        profesionalId: "",
        fecha: "",
        hora: "",
        motivo: "",
        observaciones: ""
      });

    } catch (error) {
      console.error(error);
      alert(error.message || "Error al agendar cita");
    }
  };

  return (
    <>
      <Header />

      <div style={{ padding: "20px" }}>
        <h2>Agendar cita para paciente</h2>

        <form onSubmit={handleSubmit}>

          <select name="pacienteId" value={form.pacienteId} onChange={handleChange} required>
            <option value="">Seleccione paciente</option>
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombres} {p.apellidos} - {p.correo}
              </option>
            ))}
          </select>

          <br /><br />

          <select
            name="especialidadId"
            value={form.especialidadId}
            onChange={(e) =>
              setForm({
                ...form,
                especialidadId: e.target.value,
                profesionalId: "",
                hora: ""
              })
            }
            required
          >
            <option value="">Seleccione especialidad</option>
            {especialidades.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>

          <br /><br />

          <select
            name="profesionalId"
            value={form.profesionalId}
            onChange={(e) =>
              setForm({
                ...form,
                profesionalId: e.target.value,
                hora: ""
              })
            }
            disabled={!form.especialidadId}
            required
          >
            <option value="">Seleccione profesional</option>
            {profesionales.map((p) => (
              <option key={p.id} value={p.id}>
                {p.usuario?.nombres} {p.usuario?.apellidos} - {p.especialidad?.nombre} - {p.horaInicio} a {p.horaFin}
              </option>
            ))}
          </select>

          <br /><br />

          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            required
          />

          <br /><br />

          <select
            name="hora"
            value={form.hora}
            onChange={handleChange}
            disabled={!form.profesionalId}
            required
          >
            <option value="">Seleccione hora</option>
            {horasDisponibles.map((hora) => (
              <option key={hora} value={hora}>
                {hora}
              </option>
            ))}
          </select>

          <br /><br />

          <textarea
            name="motivo"
            placeholder="Motivo"
            value={form.motivo}
            onChange={handleChange}
          />

          <br /><br />

          <textarea
            name="observaciones"
            placeholder="Observaciones / derivación"
            value={form.observaciones}
            onChange={handleChange}
          />

          <br /><br />

          <button type="submit">Agendar cita</button>
        </form>
      </div>

      <Footer />
    </>
  );
}