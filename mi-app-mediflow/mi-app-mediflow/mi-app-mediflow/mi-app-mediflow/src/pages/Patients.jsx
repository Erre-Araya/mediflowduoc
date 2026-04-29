import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";

export default function Patients() {
  const [patients, setPatients] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || (user.rol !== "PROFESIONAL" && user.rol !== "ADMIN")) {
    return <p>No tienes acceso a esta página</p>;
  }

  useEffect(() => {
    fetch("http://localhost:8080/api/usuarios/rol/PACIENTE", {
      headers: {
        rol: user.rol
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Pacientes:", data);
        setPatients(data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <Header />

      <div style={{ padding: "20px" }}>
        <h2>Pacientes</h2>

        <ul>
          {patients.map(p => (
            <li key={p.id}>
              {p.nombres} {p.apellidos}
            </li>
          ))}
        </ul>
      </div>

      <Footer />
    </>
  );
}