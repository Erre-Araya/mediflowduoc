package com.example.MediFlow.dto;

import java.util.List;
import lombok.Data;

@Data
public class ChatRequest {
    private String mensaje;
    private List<MensajeHistorial> historial;

    @Data
    public static class MensajeHistorial {
        private String rol;
        private String texto;
    }
}