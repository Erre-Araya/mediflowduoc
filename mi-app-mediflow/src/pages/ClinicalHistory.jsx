import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/ClinicalHistory.css";
import Footer from "../components/Footer";

export default function ClinicalHistory() {
const { citaId } = useParams();
const navigate = useNavigate();

const [diagnostico, setDiagnostico] = useState("");
const [tratamiento, setTratamiento] = useState("");
const [observaciones, setObservaciones] = useState("");

const guardarHistorial = async () => {
try {
    const response = await fetch(
    "http://localhost:8080/api/historial-clinico",
    {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        citaId: Number(citaId),
        diagnostico,
        tratamiento,
        observaciones,
        }),
    }
    );

    const data = await response.json();

    if (!response.ok) {
    throw new Error(data.error);
    }

    await fetch(
    `http://localhost:8080/api/citas/${citaId}/estado`,
    {
        method: "PATCH",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        estado: "FINALIZADA",
        }),
    }
    );

    alert("Consulta finalizada");

    navigate("/profesional/citas");

} catch (error) {
    alert(error.message);
}
};

return (
    <>
    <div className="clinical-page">
        <div className="clinical-card">
        <h1 className="clinical-title">Ficha clinica</h1>

        <div className="clinical-form">
            <div className="clinical-group">
            <label>Diagnóstico</label>
            <textarea
                placeholder="Diagnóstico del paciente"
                value={diagnostico}
                onChange={(e) => setDiagnostico(e.target.value)}
            />
            </div>

            <div className="clinical-group">
            <label>Tratamiento</label>
            <textarea
                placeholder="Indica el tratamiento"
                value={tratamiento}
                onChange={(e) => setTratamiento(e.target.value)}
            />
            </div>

            <div className="clinical-group">
            <label>Observaciones</label>
            <textarea
                placeholder="Comentarios u observaciones"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
            />
            </div>

            <div className="clinical-actions">
            <button
                className="btn-save-history"
                onClick={guardarHistorial}
            >
                Guardar historial y finalizar
            </button>

            <button
                className="btn-cancel-history"
                onClick={() => navigate("/profesional/citas")}
            >
                Volver
            </button>
            </div>
        </div>
        </div>
    </div>
    <Footer />
    </>
);
}