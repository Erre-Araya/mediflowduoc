package com.example.MediFlow.controller;

import com.example.MediFlow.model.HistorialClinico;
import com.example.MediFlow.service.HistorialClinicoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/historial-clinico")
@RequiredArgsConstructor
public class HistorialClinicoController {

    private final HistorialClinicoService historialClinicoService;

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Map<String, Object> request) {
        try {
            Long citaId = Long.valueOf(request.get("citaId").toString());
            String diagnostico = request.get("diagnostico").toString();
            String tratamiento = request.get("tratamiento").toString();
            String observaciones = request.get("observaciones").toString();

            HistorialClinico historial = historialClinicoService.crear(
                    citaId,
                    diagnostico,
                    tratamiento,
                    observaciones
            );

            return ResponseEntity.ok(historial);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    @GetMapping
    public ResponseEntity<?> listarTodos() {
        return ResponseEntity.ok(historialClinicoService.listarTodos());
    }
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<?> listarPorPaciente(@PathVariable Long pacienteId) {
        return ResponseEntity.ok(historialClinicoService.listarPorPaciente(pacienteId));
    }
}