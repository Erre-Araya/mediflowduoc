import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {connectVideoSocket,sendSignal,isVideoSocketConnected,} from "../services/videoSocket";
import "../styles/Video.css";

export default function VideoCall() {
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const peerConnection = useRef(null);

  const [micActivo, setMicActivo] = useState(true);
  const [camaraActiva, setCamaraActiva] = useState(true);
  const [tieneCamara, setTieneCamara] = useState(true);
  const [conectado, setConectado] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const [socketListo, setSocketListo] = useState(false);

  const [mensajeChat, setMensajeChat] = useState("");
  const [mensajes, setMensajes] = useState([]);

  const { citaId } = useParams();
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const start = async () => {
      try {
        let stream = null;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
        } catch {
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: false,
            });
            alert("Micrófono no disponible. Continuando solo con cámara.");
          } catch {
            try {
              stream = await navigator.mediaDevices.getUserMedia({
                video: false,
                audio: true,
              });
              alert("Cámara no disponible. Continuando solo con audio.");
            } catch {
              alert("No se detectó cámara ni micrófono.");
              return;
            }
          }
        }

        localVideo.current.srcObject = stream;

        const videoTracks = stream.getVideoTracks();

        if (videoTracks.length === 0) {
          setTieneCamara(false);
        }

        peerConnection.current = new RTCPeerConnection({
          iceServers: [
            {
              urls: "stun:stun.l.google.com:19302"
            }
          ]
        });

        stream.getTracks().forEach(track => {peerConnection.current.addTrack(track, stream);});

        peerConnection.current.ontrack = (event) => {remoteVideo.current.srcObject = event.streams[0];setConectado(true);};

        peerConnection.current.onicecandidate = (event) => {
          if(event.candidate){
            sendSignal({
              type:"ice-candidate",
              from:usuario.id,
              citaId:Number(citaId),
              data:event.candidate
            });
          }
        };

        connectVideoSocket(handleSignal, () => {setSocketListo(true);});
      } catch (error) {

        console.error(error);

      }
    };
    start();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSegundos(prev=>prev+1);
    },1000);
    return ()=>clearInterval(interval);
  },[]);

  const formatearTiempo=(total)=>{
    const min=Math.floor(total/60);
    const sec=total%60;
    return `${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  };

  const toggleMicrofono=()=>{
    const stream=localVideo.current?.srcObject;
    if(!stream) return;
    const audioTracks=stream.getAudioTracks();
    if(audioTracks.length===0){
      alert("No hay micrófono");
      return;
    }

    audioTracks.forEach(track=>{
      track.enabled=!track.enabled;
      setMicActivo(track.enabled);
    });
  };

  const toggleCamara=()=>{
    const stream=localVideo.current?.srcObject;
    if(!stream) return;
    const videoTracks=stream.getVideoTracks();
    if(videoTracks.length===0){
      alert("No hay cámara");
      return;
    }

    videoTracks.forEach(track=>{
      track.enabled=!track.enabled;
      setCamaraActiva(track.enabled);
    });
  };

  const handleSignal=async(message)=>{
    if(Number(message.citaId)!==Number(citaId)) return;
    if(message.from===usuario.id) return;
    if(message.type==="leave"){
      remoteVideo.current.srcObject=null;
      setConectado(false);
      alert("La otra persona terminó la llamada");
      return;
    }

    if(message.type==="chat"){
      setMensajes(prev=>[
        ...prev,
        {
          from:message.from,
          texto:message.data
        }
      ]);
      return;
    }

    if(!peerConnection.current) return;

    if(message.type==="offer"){
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(message.data)
      );

      const answer=await peerConnection.current.createAnswer();

      await peerConnection.current.setLocalDescription(answer);

      sendSignal({
        type:"answer",
        from:usuario.id,
        citaId:Number(citaId),
        data:answer
      });
    }

    if(message.type==="answer"){
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(message.data)
      );
    }

    if(message.type==="ice-candidate"){
      await peerConnection.current.addIceCandidate(
        new RTCIceCandidate(message.data)
      );
    }
  };

  const iniciarLlamada = async () => {
    if (usuario.rol !== "PROFESIONAL") {
      alert("Debes esperar a que el profesional inicie la llamada.");
      return;
    } 

    if (!isVideoSocketConnected()) {
      alert("Aún no se conecta el WebSocket. Espera unos segundos.");
      return;
    }

    if (!peerConnection.current) {
      alert("La videollamada aún se está preparando.");
      return;
    }

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    sendSignal({
      type: "offer",
      from: usuario.id,
      citaId: Number(citaId),
      data: offer,
    });
  };

  const terminarLlamada = () => {
    sendSignal({
      type: "leave",
      from: usuario.id,
      citaId: Number(citaId),
    });

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    if (localVideo.current?.srcObject) {
      localVideo.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());

      localVideo.current.srcObject = null;
    }

    if (remoteVideo.current) {
      remoteVideo.current.srcObject = null;
    }

    if (usuario.rol === "PROFESIONAL") {
      navigate("/profesional/citas");
    } else {
      navigate("/appointments");
    }
  };

  const enviarMensajeChat=()=>{
    if(!mensajeChat.trim()) return;

    setMensajes(prev=>[
      ...prev,
      {
        from:usuario.id,
        texto:mensajeChat
      }
    ]);

    sendSignal({
      type:"chat",
      from:usuario.id,
      citaId:Number(citaId),
      data:mensajeChat
    });
    setMensajeChat("");
  };

  const etiquetaOtro =
  usuario?.rol === "PROFESIONAL"
    ? "Paciente"
    : "Profesional";

  return (
  <div className="video-page">
    <div className="video-layout">
      <h2 className="video-title">Videollamada MediFlow</h2>

      <div className="video-grid">
        <div className="video-box">
          {tieneCamara ? (
            <video ref={localVideo} autoPlay muted playsInline />
          ) : (
            <div className="video-placeholder">
              Cámara no disponible
            </div>
          )}
          <span className="video-label">Tú</span>
        </div>

        <div className="video-box">
          <video ref={remoteVideo} autoPlay playsInline />
          <span className="video-label">{etiquetaOtro}</span>
        </div>
      </div>

      <div className="video-status-card">
        <p className="video-status">
          Estado: {conectado ? "🟢 Conectado" : "🔴 Desconectado"} | Tiempo:{" "}
          {formatearTiempo(segundos)}
        </p>

        <div className="video-actions">
          <button className="btn-control" onClick={toggleMicrofono}>
            {micActivo ? "🎤 Silenciar" : "🔇 Activar"}
          </button>

          <button className="btn-control" onClick={toggleCamara}>
            {camaraActiva ? "📷 Apagar cámara" : "📷 Encender cámara"}
          </button>

          <button className="btn-call" onClick={iniciarLlamada}>
            Iniciar llamada
          </button>

          <button className="btn-end" onClick={terminarLlamada}>
            Terminar llamada
          </button>
        </div>
      </div>

      <div className="generalChat">
        <h3>Chat</h3>

        <div className="chat">
          {mensajes.map((msg, index) => (
            <p key={index}>
              <strong>{msg.from === usuario.id ? "Yo" : "Otro"}:</strong>{" "}
              {msg.texto}
            </p>
          ))}
        </div>

        <div className="chat-form">
          <input
            value={mensajeChat}
            onChange={(e) => setMensajeChat(e.target.value)}
            placeholder="Escribe mensaje..."
          />

          <button className="chat-send-btn" onClick={enviarMensajeChat}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  </div>
);
}