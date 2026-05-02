import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;

    //PROFESIONAL: sus pacientes; ADMIN: todos
    const url = user.rol === "PROFESIONAL"
      ? `http://localhost:8080/api/citas/pacientes/profesional/${user.id}`
      : `http://localhost:8080/api/usuarios/rol/PACIENTE`;

    fetch(url, {
      headers: { 
        rol: user.rol 
      }
    })
      .then(res => res.json())
      .then(data => setPatients(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  if (!user || (user.rol !== "PROFESIONAL" && user.rol !== "ADMIN")) {
    return <p>No tienes acceso a esta página.</p>;
  }

  return (
    <>
          <Header />

      <div style={{ padding: "20px" }}>
        <h2>
          {user.rol === "PROFESIONAL" ? "Mis pacientes" : "Pacientes del sistema"}
        </h2>

        {patients.length === 0 ? (
          <p>No hay pacientes para mostrar.</p>
        ) : (
          <table border="1" cellPadding="10">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(p => (
                <tr key={p.id}>
                  <td>{p.nombres}</td>
                  <td>{p.apellidos}</td>
                  <td>{p.correo}</td>
                  <td>{p.telefono || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Footer />
    </>
  );
}