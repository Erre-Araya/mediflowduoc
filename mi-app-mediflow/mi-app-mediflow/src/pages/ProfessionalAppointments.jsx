import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { updateAppointmentStatus } from "../services/appointmentService";
import { useNavigate } from "react-router-dom";

export default function ProfessionalAppointments() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [citas, setCitas] = useState([]);
  const navigate = useNavigate();

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

    <div className="page-container">
      <h2 className="page-title">Mis citas</h2>
      <div className="card">
        <div className="table-container">
          <table>
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

                    <td style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>

                      {cita.estadoCita === "PENDIENTE" && (
                        <>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => cambiarEstado(cita.id, "CONFIRMADA")}
                          >
                            Confirmar
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => cambiarEstado(cita.id, "CANCELADA")}
                          >
                            Cancelar
                          </button>
                        </>
                      )}

                      {cita.estadoCita === "CONFIRMADA" && (
                        <>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => navigate(`/profesional/historial/${cita.id}`)}
                          >
                            Finalizar consulta
                          </button>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => navigate(`/video-call/${cita.id}`)}
                          >
                            Videollamada
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => cambiarEstado(cita.id, "CANCELADA")}
                          >
                            Cancelar
                          </button>
                        </>
                      )}

                      {(cita.estadoCita === "FINALIZADA" || cita.estadoCita === "CANCELADA") && (
                        <span style={{ color: "var(--color-text-muted)", fontSize: "13px" }}>
                          Sin acciones
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <Footer />
  </>
  );
}