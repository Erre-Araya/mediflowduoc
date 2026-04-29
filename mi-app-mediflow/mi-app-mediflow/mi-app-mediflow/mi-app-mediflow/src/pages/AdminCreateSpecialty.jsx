import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AdminCreateSpecialty() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [form, setForm] = useState({
        nombre: "",
        descripcion: ""
    });

    if (!user || user.rol !== "ADMIN") {
        return <p>No tienes acceso</p>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
        const res = await fetch("http://localhost:8080/api/especialidades", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            rol: user.rol
            },
            body: JSON.stringify(form)
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Error al crear especialidad");
        }

        alert("Especialidad creada correctamente");
        setForm({ nombre: "", descripcion: "" });

        } catch (error) {
        console.error(error);
        alert(error.message);
        }
    };

    return (
        <>
        <Header />

        <div style={{ padding: "20px" }}>
            <h2>Crear Especialidad</h2>

            <form onSubmit={handleSubmit}>
            <input
                name="nombre"
                placeholder="Nombre especialidad"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
            />

            <input
                name="descripcion"
                placeholder="Descripción"
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />

            <button type="submit">Crear especialidad</button>
            </form>
        </div>

        <Footer />
        </>
    );
}