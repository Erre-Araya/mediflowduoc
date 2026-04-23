package com.example.MediFlow.controller;

import com.example.MediFlow.model.Cita;
import com.example.MediFlow.service.CitaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;

@RestController
@RequestMapping("/api/citas")
@RequiredArgsConstructor
@Tag(name = "Citas", description = "Gestion de citas")
public class CitaController {

    private final CitaService citaService;

    @PostMapping
    @Operation(summary = "Crear cita", description = "Crea una nueva cita")
    public ResponseEntity<?> crear(@RequestBody Map<String, Object> request) {
        try {
            Long usuarioId = Long.valueOf(request.get("usuarioId").toString());
            Long especialidadId = Long.valueOf(request.get("especialidadId").toString());

            LocalDate fecha = LocalDate.parse(request.get("fecha").toString());
            LocalTime hora = LocalTime.parse(request.get("hora").toString());

            String motivo = request.get("motivo") != null
                    ? request.get("motivo").toString()
                    : null;

            String observaciones = request.get("observaciones") != null
                    ? request.get("observaciones").toString()
                    : null;

            Cita cita = citaService.crear(
                    usuarioId,
                    especialidadId,
                    fecha,
                    hora,
                    motivo,
                    observaciones
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(cita);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error al crear la cita"));
        }
    }
}