import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";

let stompClient = null;
let isConnected = false;
let subscription = null;

export const connectVideoSocket = (onMessage, onConnected) => {
  if (stompClient && isConnected) {
    if (onConnected) onConnected();
    return;
  }

  stompClient = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/ws/video"),
    reconnectDelay: 5000,

    onConnect: () => {
      console.log("STOMP conectado");
      isConnected = true;

      if (subscription) {
        subscription.unsubscribe();
      }

      subscription = stompClient.subscribe("/topic/video", (message) => {
        const body = JSON.parse(message.body);
        console.log("Mensaje recibido por WebSocket:", body);
        onMessage(body);
      });

      if (onConnected) onConnected();
    },

    onWebSocketClose: () => {
      console.log("STOMP desconectado");
      isConnected = false;
    },

    onStompError: (frame) => {
      console.error("Error STOMP:", frame);
    },
  });

  stompClient.activate();
};

export const sendSignal = (signal) => {
  if (!stompClient || !isConnected) {
    console.warn("No se pudo enviar señal. STOMP aún no está conectado:", signal);
    return;
  }

  console.log("Enviando señal:", signal);

  stompClient.publish({
    destination: "/app/video/send",
    body: JSON.stringify(signal),
  });
};

export const isVideoSocketConnected = () => {
  return isConnected;
};