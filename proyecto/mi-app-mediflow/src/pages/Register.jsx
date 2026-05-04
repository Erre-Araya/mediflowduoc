import Header from "../components/Header";
import Footer from "../components/Footer";
import { registerUser } from "../services/userService";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css"
import { useState, useEffect } from "react";

export default function Register() {
    const [form, setForm] = useState({
    run: "",
    nombres: "",
    apellidos: "",
    correo: "",
    password: "",
    regionId: "",
    comunaId: "",
    direccion: "",
    telefono: ""
    });
    const [regiones, setRegiones] = useState([]);
    const [comunas, setComunas] = useState([]);
    const [loadingRegiones, setLoadingRegiones] = useState(true);

    useEffect(() => {
      fetch("http://localhost:8080/api/regiones")
        .then(res => res.json())
        .then(data => {
          setRegiones(data);
          setLoadingRegiones(false);
        })
        .catch(err => {
          console.error(err);
          setLoadingRegiones(false);
        });
    }, []);

    useEffect(() => {
      if (form.regionId) {
        fetch(`http://localhost:8080/api/comunas/region/${form.regionId}`)
          .then(res => res.json())
          .then(data => setComunas(data))
          .catch(err => console.error(err));
      }
    }, [form.regionId]);

    const handleChange = (e) => {
      setForm({
        ...form,
        [e.target.name]: e.target.value
      });
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        await registerUser(form);
        alert("Usuario creado correctamente");

        navigate("/");
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    };

  return (
    <>
      <Header />

      <div className="page-container" style={{ display: "flex", justifyContent: "center" }}>
      
      <div className="card" style={{ width: "420px" }}>
        
        <h2 className="page-title">Registro</h2>

        <form onSubmit={handleSubmit} className="form">

          <input className="input" name="run" placeholder="Run" onChange={handleChange}/>
          <input className="input" name="nombres" placeholder="Nombres" onChange={handleChange}/>
          <input className="input" name="apellidos" placeholder="Apellidos" onChange={handleChange}/>
          <input className="input" name="correo" placeholder="Correo" onChange={handleChange}/>
          <input className="input" name="telefono" placeholder="Teléfono" onChange={handleChange}/>
          <input className="input" name="direccion" placeholder="Dirección" onChange={handleChange}/>

          <select
                className="input"
                value={form.regionId}
                onChange={e =>
                  setForm({ ...form, regionId: e.target.value, comunaId: "" })
                }
              >
                <option value="">Selecciona región</option>
                {regiones.map(r => (
                  <option key={r.id} value={r.id}>{r.nombre}</option>
                ))}
              </select>

              <select
                className="input"
                value={form.comunaId}
                onChange={e => setForm({ ...form, comunaId: e.target.value })}
                disabled={!form.regionId}
              >
                <option value="">Selecciona comuna</option>
                {comunas.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>

          <input className="input" name="password" type="password" placeholder="Contraseña" onChange={handleChange}/>
          <p style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
            Luego podrás ingresar con tu correo y contraseña.
          </p>

          <button className="btn btn-primary" type="submit">
            Registrarse
          </button>

        </form>

      </div>
    </div>

      <Footer />
    </>
  );
}