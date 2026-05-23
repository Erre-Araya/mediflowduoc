import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { createAppointment } from "../services/appointmentService";

export default function CreateAppointment() {
  const [especialidades, setEspecialidades] = useState([]);
  const [profesionales, setProfesionales] = useState([]);

  const [form, setForm] = useState({
    fecha: "",
    hora: "",
    motivo: "",
    especialidadId: "",
    profesionalId: ""
  });

  const user = JSON.parse(localStorage.getItem("user"));

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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createAppointment({
        usuarioId: user.id,
        especialidadId: form.especialidadId,
        profesionalId: form.profesionalId,
        fecha: form.fecha,
        hora: form.hora,
        motivo: form.motivo,
        observaciones: ""
      });

      alert("Cita creada correctamente");

      setForm({
        fecha: "",
        hora: "",
        motivo: "",
        especialidadId: "",
        profesionalId: ""
      });

    } catch (err) {
      console.error(err);
      alert(err.message || "Error al crear la cita");
    }
  };

  return (
    <>
    <Header />

    <div className="page-container" style={{ display: "flex", justifyContent: "center" }}>

      <div className="card" style={{ width: "520px" }}>

        <h2 className="page-title">Agendar cita</h2>

        <form className="form" onSubmit={handleSubmit}>

          <select
            className="input"
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

            {especialidades.map((esp) => (
              <option key={esp.id} value={esp.id}>
                {esp.nombre}
              </option>
            ))}
          </select>

          <select
            className="input"
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
                {p.usuario?.nombres} {p.usuario?.apellidos} - {p.horaInicio} a {p.horaFin}
              </option>
            ))}
          </select>

          <input
            className="input"
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            required
          />

          <select
            className="input"
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

          <textarea
            className="input"
            name="motivo"
            placeholder="Motivo"
            value={form.motivo}
            onChange={handleChange}
          />

          <button className="btn btn-primary" type="submit">
            Guardar cita
          </button>

        </form>

      </div>

    </div>

    <Footer />
  </>
  );
}