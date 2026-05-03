import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { getAppointmentsByUser } from "../services/appointmentService";

export default function Appointments() {
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
  }, []);

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
                <th>Especialidad</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Estado</th>
                <th>Motivo</th>
                <th>Profesional</th>
              </tr>
            </thead>

            <tbody>
              {citas.length === 0 ? (
                <tr>
                  <td colSpan="6">No tienes citas registradas</td>
                </tr>
              ) : (
                citas.map((cita) => (
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