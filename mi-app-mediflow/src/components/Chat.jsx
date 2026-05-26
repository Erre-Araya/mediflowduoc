import { useState, useEffect, useRef } from "react";
import "../styles/Chat.css";

export default function ChatWidget() {
const user = JSON.parse(localStorage.getItem("user"));

const [abierto, setAbierto] = useState(false);

const [mensajes, setMensajes] = useState([
{ rol: "bot", texto: "¡Hola! ¿En qué puedo ayudarte hoy?" }
]);

const [input, setInput] = useState("");
const [cargando, setCargando] = useState(false);
const bottomRef = useRef(null);

//Scroll automático al último mensaje
useEffect(() => {
bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [mensajes, cargando]);

if (!user) return null;

const enviarMensaje = async () => {
const texto = input.trim();
if (!texto || cargando) return;

const mensajeUsuario = { rol: "usuario", texto };
const nuevosMensajes = [...mensajes, mensajeUsuario];

setMensajes(nuevosMensajes);
setInput("");
setCargando(true);

try {
    const response = await fetch("http://localhost:8080/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        mensaje: texto,
        historial: mensajes.map(m => ({  // Todos los mensajes previos
            rol: m.rol,
            texto: m.texto
        }))
    })
});

    const data = await response.json();
    setMensajes(prev => [...prev, { rol: "bot", texto: data.respuesta }]);

} catch {
    setMensajes(prev => [
    ...prev,
    { rol: "bot", texto: "No pude conectarme. Verifica que el servidor esté activo." }
    ]);
} finally {
    setCargando(false);
}
};

const handleKeyDown = (e) => {
if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    enviarMensaje();
}
};

return (
<div className="chat-widget-container">

    {/* Panel del chat */}
    {abierto && (
    <div className="chat-widget-panel">

        <div className="chat-widget-header">
        <div className="chat-widget-header-info">
            <span>🤖</span>
            <div>
            <p className="chat-widget-nombre">Asistente MediFlow</p>
            <p className="chat-widget-estado">
                {cargando ? "Escribiendo..." : "En línea"}
            </p>
            </div>
        </div>
        <button
            className="chat-widget-cerrar"
            onClick={() => setAbierto(false)}
        >
            ✕
        </button>
        </div>

        {/* Mensajes */}
        <div className="chat-widget-mensajes">
        {mensajes.map((msg, i) => (
            <div
            key={i}
            className={`widget-burbuja ${msg.rol === "usuario" ? "widget-burbuja-usuario" : "widget-burbuja-bot"}`}
            >
            <p className="widget-burbuja-texto">{msg.texto}</p>
            </div>
        ))}

        {/* "escribiendo..." */}
        {cargando && (
            <div className="widget-burbuja widget-burbuja-bot">
            <div className="widget-typing">
                <span></span><span></span><span></span>
            </div>
            </div>
        )}

        <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="chat-widget-input-area">
        <textarea
            className="chat-widget-input"
            placeholder="Escribe tu mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={cargando}
        />
        <button
            className="chat-widget-send"
            onClick={enviarMensaje}
            disabled={cargando || !input.trim()}
        >
            ➤
        </button>
        </div>

    </div>
    )}

    {/* Botón flotante */}
    <button
    className={`chat-widget-boton ${abierto ? "chat-widget-boton-activo" : ""}`}
    onClick={() => setAbierto(!abierto)}
    title="Asistente MediFlow"
    >
    {abierto ? "✕" : "🤖"}
    </button>

</div>
);
}