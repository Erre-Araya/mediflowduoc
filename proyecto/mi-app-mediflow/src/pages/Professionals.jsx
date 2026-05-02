import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";

export default function Professionals() {
    const [professionals, setProfessionals] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));

        useEffect(() => {
            fetch("http://localhost:8080/api/usuarios/rol/PROFESIONAL", {
                headers: {
                rol: user?.rol
                }
            })
                .then(res => {
                if (!res.ok) throw new Error("No autorizado");
                return res.json();
                })
                .then(data => setProfessionals(data))
                .catch(err => {
                console.error(err);
                setProfessionals([]); // evita crash
                });
            }, []);

  return (
    <>
        <Header />

        <div style={{ padding: "20px" }}>
        <h2>Profesionales</h2>

        <ul>
            {professionals.map(p => (
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
