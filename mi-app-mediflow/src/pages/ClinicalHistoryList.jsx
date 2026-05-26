import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ClinicalHistoryList() {
const [historiales, setHistoriales] = useState([]);

const user = JSON.parse(localStorage.getItem("user"));

useEffect(() => {
if (!user) return;

const url =
    user.rol === "PROFESIONAL"
    ? "http://localhost:8080/api/historial-clinico"
    : `http://localhost:8080/api/historial-clinico/paciente/${user.id}`;

fetch(url)
    .then((res) => res.json())
    .then((data) => {
    setHistoriales(Array.isArray(data) ? data : []);
    })
    .catch((err) => console.error(err));
}, []);

return (
<>
    <Header />

    <div className="page-container">
    <h2 className="page-title">
        {user?.rol === "PROFESIONAL"
        ? "Historial clínico"
        : "Mi historial clínico"}
    </h2>

    <div className="card">
        <div className="table-container">
        <table>
            <thead>
            <tr>
                <th>Paciente</th>
                <th>Profesional</th>
                <th>Especialidad</th>
                <th>Fecha</th>
                <th>Diagnóstico</th>
                <th>Tratamiento</th>
                <th>Observaciones</th>
            </tr>
            </thead>

            <tbody>
            {historiales.length === 0 ? (
                <tr>
                <td colSpan="6">
                    No hay historiales clínicos registrados
                </td>
                </tr>
            ) : (
                historiales.map((h) => (
                <tr key={h.id}>
                    <td>
                    {h.paciente?.nombres} {h.paciente?.apellidos}
                    </td>
                    <td>
                    {h.profesional?.nombres} {h.profesional?.apellidos}
                    </td>
                    <td>{h.cita?.especialidad?.nombre}</td>
                    <td>{h.fecha || h.fechaRegistro}</td>
                    <td>{h.diagnostico}</td>
                    <td>{h.tratamiento}</td>
                    <td>{h.observaciones}</td>
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