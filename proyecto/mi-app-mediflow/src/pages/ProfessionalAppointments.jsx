import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { updateAppointmentStatus } from "../services/appointmentService";

export default function ProfessionalAppointments() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [citas, setCitas] = useState([]);

  if (!user || user.rol !== "PROFESIONAL") {
    return <p>No tienes acceso</p>;
  }

  useEffect(() => {
    fetch(`http://localhost:8080/api/citas/profesional/usuario/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("CITAS PROFESIONAL:", data);
        setCitas(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error(err));
  }, []);

  const cambiarEstado = async (citaId, estado) => {
    try {
      const actualizada = await updateAppointmentStatus(citaId, estado);

      setCitas(
        citas.map((cita) =>
          cita.id === citaId ? actualizada : cita
        )
      );

      alert("Estado actualizado");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <>
    <Header />

    <div style={{ padding: "20px" }}>
        <h2>Mis citas</h2>

        <table border="1" cellPadding="10">
        <thead>
            <tr>
              <th>Paciente</th>
              <th>Especialidad</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Motivo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
        </thead>

        <tbody>
            {citas.length === 0 ? (
              <tr>
                <td colSpan="7">No tienes citas agendadas</td>
              </tr>
            ) : (
              citas.map((cita) => (
                <tr key={cita.id}>
                  <td>
                    {cita.usuario?.nombres} {cita.usuario?.apellidos}
                  </td>
                  <td>{cita.especialidad?.nombre}</td>
                  <td>{cita.fecha}</td>
                  <td>{cita.hora}</td>
                  <td>{cita.motivo}</td>
                  <td>{cita.estadoCita}</td>
                  <td>
                    {cita.estadoCita === "PENDIENTE" && (
                        <>
                        <button onClick={() => cambiarEstado(cita.id, "CONFIRMADA")}>Confirmar</button>

                        <button onClick={() => cambiarEstado(cita.id, "CANCELADA")}>Cancelar</button>
                        </>
                    )}

                    {cita.estadoCita === "CONFIRMADA" && (
                        <>
                        <button onClick={() => cambiarEstado(cita.id, "FINALIZADA")}>Finalizar</button>

                        <button onClick={() => cambiarEstado(cita.id, "CANCELADA")}>Cancelar</button>
                        </>
                    )}

                    {(cita.estadoCita === "FINALIZADA" || cita.estadoCita === "CANCELADA") && (
                        <span>Sin acciones</span>
                    )}
                </td>
                </tr>
              ))
            )}
        </tbody>
        </table>
    </div>

    <Footer />
    </>
  );
}