import { useState, useEffect, useRef } from "react";
import "../styles/Chat.css";

export default function Chat() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [abierto, setAbierto] = useState(false);

  const [mensajes, setMensajes] = useState([
    {
      rol: "bot",
      texto: "¡Hola! Soy el asistente de MediFlow. ¿En qué puedo ayudarte hoy?",
    },
  ]);

  const [input, setInput] = useState("");
  const [cargando, setCargando] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [mensajes, cargando]);

  if (!user) return null;

  const enviarMensaje = async () => {
    const texto = input.trim();

    if (!texto || cargando) return;

    const mensajeUsuario = {
      rol: "usuario",
      texto,
    };

    const nuevosMensajes = [
      ...mensajes,
      mensajeUsuario,
    ];

    setMensajes(nuevosMensajes);
    setInput("");
    setCargando(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usuarioId: user.id,
            message: texto,
            mensaje: texto,
            historial: mensajes.map((m) => ({
              rol: m.rol,
              texto: m.texto,
            })),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Error al comunicarse con el asistente"
        );
      }

      setMensajes((prev) => [
        ...prev,
        {
          rol: "bot",
          texto: data.respuesta || data.message || "No recibí respuesta.",
        },
      ]);
    } catch (error) {
      console.error("Error chatbot:", error);

      setMensajes((prev) => [
        ...prev,
        {
          rol: "bot",
          texto:
            "No pude conectarme. Verifica que el backend y Ollama estén activos.",
        },
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
      {abierto && (
        <div className="chat-widget-panel">
          <div className="chat-widget-header">
            <div className="chat-widget-header-info">
              <span>🤖</span>

              <div>
                <p className="chat-widget-nombre">
                  Asistente MediFlow
                </p>

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

          <div className="chat-widget-mensajes">
            {mensajes.map((msg, i) => (
              <div
                key={i}
                className={`widget-burbuja ${
                  msg.rol === "usuario"
                    ? "widget-burbuja-usuario"
                    : "widget-burbuja-bot"
                }`}
              >
                <p className="widget-burbuja-texto">
                  {msg.texto}
                </p>
              </div>
            ))}

            {cargando && (
              <div className="widget-burbuja widget-burbuja-bot">
                <div className="widget-typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

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

      <button
        className={`chat-widget-boton ${
          abierto ? "chat-widget-boton-activo" : ""
        }`}
        onClick={() => setAbierto(!abierto)}
        title="Asistente MediFlow"
      >
        {abierto ? "✕" : "🤖"}
      </button>
    </div>
  );
}