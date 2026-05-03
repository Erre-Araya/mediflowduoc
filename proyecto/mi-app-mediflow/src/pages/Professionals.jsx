import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";

export default function Professionals() {
  const [professionals, setProfessionals] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/profesionales")
      .then((res) => res.json())
      .then((data) => setProfessionals(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Header />

      <div className="page-container">
        <div className="card">
          <h2 className="page-title">Profesionales</h2>

          {professionals.length === 0 ? (
            <p>No hay profesionales para mostrar.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Especialidad</th>
                  <th>Horario</th>
                </tr>
              </thead>

              <tbody>
                {professionals.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {p.usuario?.nombres} {p.usuario?.apellidos}
                    </td>
                    <td>{p.especialidad?.nombre}</td>
                    <td>
                      {p.horaInicio} a {p.horaFin}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}