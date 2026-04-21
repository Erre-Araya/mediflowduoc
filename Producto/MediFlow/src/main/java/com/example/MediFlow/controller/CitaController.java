package com.example.MediFlow.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.MediFlow.model.Cita;
import com.example.MediFlow.service.CitaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


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

            Long pacienteId = Long.valueOf(request.get("pacienteId").toString());
            Long profesionalId = Long.valueOf(request.get("profesionalId").toString());
            Long servicioId = Long.valueOf(request.get("servicioId").toString());

            LocalDate fecha = LocalDate.parse(request.get("fecha").toString());
            LocalTime hora = LocalTime.parse(request.get("hora").toString());

            String motivo = request.get("motivo") != null ? request.get("motivo").toString() : null;

            Cita cita = citaService.crear(
                pacienteId,
                profesionalId,
                servicioId,
                fecha,
                hora,
                motivo
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(cita);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error al crear la cita"));
        }
    }
    
}
