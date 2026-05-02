import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";

export default function Professionals() {
    const [professionals, setProfessionals] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));

        useEffect(() => {
            fetch("http://localhost:8080/api/profesionales")
                .then(res => res.json())
                .then(data => setProfessionals(Array.isArray(data) ? data : []))
                .catch(err => console.error(err));
            }, []);

  return (
    <>
        <Header />

        <div style={{ padding: "20px" }}>
        <h2>Profesionales</h2>

        <ul>
            {professionals.map((p) => (
            <li key={p.id}>
                {p.usuario?.nombres} {p.usuario?.apellidos} - {p.especialidad?.nombre} - {p.horaInicio} a {p.horaFin}
            </li>
            ))}
            
        </ul>
        </div>

        <Footer />
    </>
  );
}
