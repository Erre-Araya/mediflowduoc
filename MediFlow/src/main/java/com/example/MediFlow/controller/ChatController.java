package com.example.MediFlow.controller;

import com.example.MediFlow.dto.ChatRequest;
import com.example.MediFlow.dto.ChatResponse;
import com.example.MediFlow.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<?> chat(@RequestBody ChatRequest request) {
        if (request.getMensaje() == null || request.getMensaje().trim().isEmpty()) {
            return ResponseEntity.badRequest()
                .body(new ChatResponse("Por favor escribe un mensaje."));
        }

        if (request.getMensaje().length() > 1000) {
            return ResponseEntity.badRequest()
                .body(new ChatResponse("El mensaje es demasiado largo. Máximo 1000 caracteres."));
        }
        String mensaje = request.getMensaje().toLowerCase();

        if (
            mensaje.startsWith("agendar") ||
            mensaje.contains("quiero una cita") ||
            mensaje.contains("quiero agendar") ||
            mensaje.contains("necesito una cita") ||
            mensaje.contains("necesito agendar")
        ) {
            return ResponseEntity.ok(chatService.agendarCitaDesdeChat(request));
        }

        String respuesta = chatService.consultarOllama(
            request.getMensaje(),
            request.getHistorial()
        );

        return ResponseEntity.ok(new ChatResponse(respuesta));
    }
}