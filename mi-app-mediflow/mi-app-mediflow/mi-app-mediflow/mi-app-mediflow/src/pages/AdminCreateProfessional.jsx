import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AdminCreateProfessional() {
    const user = JSON.parse(localStorage.getItem("user"));

    const [especialidades, setEspecialidades] = useState([]);

    const [form, setForm] = useState({
        nombres: "",
        apellidos: "",
        correo: "",
        password: "",
        especialidadId: "",
        numeroRegistro: "",
        horarioAtencion: ""
    });

    if (!user || user.rol !== "ADMIN") {
        return <p>No tienes acceso</p>;
    }

    useEffect(() => {
        fetch("http://localhost:8080/api/especialidades")
        .then(res => res.json())
        .then(data => setEspecialidades(Array.isArray(data) ? data : []))
        .catch(err => console.error(err));
    }, []);

    const handleChange = (e) => {
        setForm({
        ...form,
        [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
        const res = await fetch("http://localhost:8080/api/profesionales", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            rol: user.rol
            },
            body: JSON.stringify(form)
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Error al crear profesional");
        }

        alert("Profesional creado correctamente");

        setForm({
            nombres: "",
            apellidos: "",
            correo: "",
            password: "",
            especialidadId: "",
            numeroRegistro: "",
            horarioAtencion: ""
        });

        } catch (error) {
        console.error(error);
        alert(error.message);
        }
    };

    return (
    <>
        <Header />

        <div style={{ padding: "20px" }}>
            <h2>Crear Profesional</h2>

            <form onSubmit={handleSubmit}>
            <input name="nombres" placeholder="Nombres" value={form.nombres} onChange={handleChange} />
            <input name="apellidos" placeholder="Apellidos" value={form.apellidos} onChange={handleChange} />
            <input name="correo" placeholder="Correo" value={form.correo} onChange={handleChange} />
            <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} />

            <select name="especialidadId" value={form.especialidadId} onChange={handleChange} required>
                <option value="">Seleccione especialidad</option>
                {especialidades.map((e) => (
                <option key={e.id} value={e.id}>
                    {e.nombre}
                </option>
                ))}
            </select>

            <input name="numeroRegistro" placeholder="Número de registro" value={form.numeroRegistro} onChange={handleChange} />
            <input name="horarioAtencion" placeholder="Horario atención, ej: 08:00-18:00" value={form.horarioAtencion} onChange={handleChange} />

            <button type="submit">Crear profesional</button>
            </form>
        </div>

        <Footer />
        </>
    );
}