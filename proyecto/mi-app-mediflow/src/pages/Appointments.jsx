import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { getAppointmentsByUser } from "../services/appointmentService";

export default function Appointments({ embedded = false }) {
  const [citas, setCitas] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const data = await getAppointmentsByUser(user.id);
        setCitas(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCitas();
  }, [user.id]);

  const now = new Date();

  // 🔥 FILTRO SOLO EN HOME
  const citasRender = embedded
    ? citas
        .filter(
          c =>
            (c.estadoCita === "AGENDADA" ||
              c.estadoCita === "CONFIRMADA") &&
            new Date(`${c.fecha}T${c.hora}`) >= now
        )
        .sort(
          (a, b) =>
            new Date(`${a.fecha}T${a.hora}`) -
            new Date(`${b.fecha}T${b.hora}`)
        )
    : citas;

  const cambiarEstado = async (id, estado) => {
    try {
      await fetch(`http://localhost:8080/api/citas/${id}/estado`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado })
      });

      setCitas(prev =>
        prev.map(c =>
          c.id === id ? { ...c, estadoCita: estado } : c
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {!embedded && <Header />}

      {/* 🔥 SIEMPRE MISMO CONTAINER */}
      <div className="page-container">

        {!embedded && <h2 className="page-title">Mis citas</h2>}

        <div className="card">
          <div className="table-container">

            <table>
              <thead>
                <tr>
                  <th>Especialidad</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Estado</th>
                  <th>Motivo</th>
                  <th>Profesional</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {citasRender.length === 0 ? (
                  <tr>
                    <td colSpan="7">No tienes citas</td>
                  </tr>
                ) : (
                  citasRender.map(cita => (
                    <tr key={cita.id}>
                      <td>{cita.especialidad?.nombre}</td>
                      <td>{cita.fecha}</td>
                      <td>{cita.hora}</td>
                      <td>{cita.estadoCita}</td>
                      <td>{cita.motivo}</td>
                      <td>
                        {cita.profesional?.usuario?.nombres}{" "}
                        {cita.profesional?.usuario?.apellidos}
                      </td>

                      <td style={{ display: "flex", gap: "8px" }}>

                        {cita.estadoCita === "AGENDADA" && (
                          <>
                            <button
                              className="btn btn-primary"
                              onClick={() =>
                                cambiarEstado(cita.id, "CONFIRMADA")
                              }
                            >
                              Confirmar
                            </button>

                            <button
                              className="btn btn-danger"
                              onClick={() =>
                                cambiarEstado(cita.id, "CANCELADA")
                              }
                            >
                              Cancelar
                            </button>
                          </>
                        )}

                        {cita.estadoCita === "CONFIRMADA" && (
                          <button
                            className="btn btn-danger"
                            onClick={() =>
                              cambiarEstado(cita.id, "CANCELADA")
                            }
                          >
                            Cancelar
                          </button>
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

      {!embedded && <Footer />}
    </>
  );
}