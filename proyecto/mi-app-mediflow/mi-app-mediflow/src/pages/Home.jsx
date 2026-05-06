import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import Calendar from "./Calendar";
import Appointments from "./Appointments";


export default function Home() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <Header />

      <div className="page-container">
        <h2>Bienvenid@: {user?.nombres}</h2>
        <h1>Panel Principal</h1>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px"
        }}>

          {user?.rol === "PACIENTE" && (
            <>
            <Appointments embedded={true} />
            </>
          )}

          {user?.rol === "PROFESIONAL" && (
            <>
            <Calendar embedded />
            </>
          )}

          {user?.rol === "ADMIN" && (
            <>
            <Calendar embedded />
            </>
          )}
        </div>

      </div>

      <Footer />
    </>
  );
}