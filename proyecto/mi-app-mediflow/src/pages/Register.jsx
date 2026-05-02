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

      <div className="register">
        <form onSubmit={handleSubmit} className="form">
          <h2 className="h2">Registro</h2>

        <input name="run" placeholder="Run" onChange={handleChange}/>
        <input name="nombres" placeholder="Nombres" onChange={handleChange} />
        <input name="apellidos" placeholder="Apellidos" onChange={handleChange} />
        <input name="correo" placeholder="Correo" onChange={handleChange} />
        <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} />
        <div>
          <div >
            <label >Region</label>
            <select
              name="regionId"
              value={form.regionId}
              onChange={handleChange}
              disabled={loadingRegiones}
            >
              <option value="">
                {loadingRegiones ? 'Cargando...' : 'Selecciona region'}
              </option>
              {Array.isArray(regiones) && regiones.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Comuna</label>
            <select
              name="comunaId"
              value={form.comunaId}
              onChange={handleChange}
              disabled={!form.regionId || comunas.length === 0}
            >
              <option value="">Selecciona comuna</option>
              {comunas.map((comuna) => (
                <option key={comuna.id} value={comuna.id}>
                  {comuna.nombre}
                </option>
              ))}
              </select>
            </div>
          </div>

        <input name="direccion" placeholder="direccion" onChange={handleChange}/>
        <input name="telefono" placeholder="Telefono" onChange={handleChange}/>


          <button type="submit" className="button">Registrarse</button>
        </form>
      </div>

      <Footer />
    </>
  );
}