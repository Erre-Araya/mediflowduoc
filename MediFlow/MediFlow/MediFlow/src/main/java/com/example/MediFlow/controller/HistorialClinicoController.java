package com.example.MediFlow.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.MediFlow.model.HistorialClinico;
import com.example.MediFlow.service.HistorialClinicoService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/historiales")
@RequiredArgsConstructor
@Tag(name = "Historial Clínico", description = "CRUD de historial clínico")
public class HistorialClinicoController {

    private final HistorialClinicoService historialClinicoService;

    @GetMapping
    public ResponseEntity<List<HistorialClinico>> obtenerTodos() {
        return ResponseEntity.ok(historialClinicoService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(historialClinicoService.obtenerPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<HistorialClinico>> obtenerPorPaciente(@PathVariable Long pacienteId) {
        return ResponseEntity.ok(historialClinicoService.obtenerPorPaciente(pacienteId));
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Map<String, Object> request) {
        try {
            Long pacienteId = Long.valueOf(request.get("pacienteId").toString());
            LocalDate fecha = LocalDate.parse(request.get("fecha").toString());
            String diagnostico = request.get("diagnostico").toString();
            String tratamiento = request.get("tratamiento") != null ? request.get("tratamiento").toString() : null;
            String comentarios = request.get("comentarios") != null ? request.get("comentarios").toString() : null;

            HistorialClinico creado = historialClinicoService.crear(pacienteId, fecha, diagnostico, tratamiento, comentarios);

            return ResponseEntity.status(HttpStatus.CREATED).body(creado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            LocalDate fecha = request.get("fecha") != null ? LocalDate.parse(request.get("fecha").toString()) : null;
            String diagnostico = request.get("diagnostico") != null ? request.get("diagnostico").toString() : null;
            String tratamiento = request.get("tratamiento") != null ? request.get("tratamiento").toString() : null;
            String comentarios = request.get("comentarios") != null ? request.get("comentarios").toString() : null;

            return ResponseEntity.ok(historialClinicoService.actualizar(
                    id, fecha, diagnostico, tratamiento, comentarios
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            historialClinicoService.eliminar(id);
            return ResponseEntity.ok(Map.of("mensaje", "Historial eliminado correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
