import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { createAppointment } from "../services/appointmentService";

export default function CreateAppointment() {

  const [especialidades, setEspecialidades] = useState([]);

  const [form, setForm] = useState({
    fecha: "",
    motivo: "",
    especialidadId: ""
  });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch("http://localhost:8080/api/especialidades")
      .then(res => res.json())
      .then(data => {
        console.log("Especialidades:", data);
        setEspecialidades(data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createAppointment({
        usuarioId: user.id,
        especialidadId: form.especialidadId,
        fecha: form.fecha.split("T")[0],
        hora: form.fecha.split("T")[1],
        motivo: form.motivo
      });

      alert("Cita creada correctamente");

    } catch (err) {
      console.error(err);
      alert("Error al crear la cita");
    }
  };

  return (
    <>
      <Header />

      <div style={{ padding: "20px" }}>
        <h2>Agendar Cita</h2>

        <form onSubmit={handleSubmit}>

          {}
          <select
            onChange={(e) =>
              setForm({ ...form, especialidadId: e.target.value })
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

          <br /><br />

          {}
          <input
            type="datetime-local"
            onChange={(e) =>
              setForm({ ...form, fecha: e.target.value })
            }
            required
          />

          <br /><br />

          {}
          <textarea
            placeholder="Motivo"
            onChange={(e) =>
              setForm({ ...form, motivo: e.target.value })
            }
          />

          <br /><br />

          <button>Guardar</button>
        </form>
      </div>

      <Footer />
    </>
  );
}