package com.example.MediFlow.controller;

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

import com.example.MediFlow.model.EquipoMedico;
import com.example.MediFlow.service.EquipoMedicoService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/equipos-medicos")
@RequiredArgsConstructor
@Tag(name = "Equipos Médicos", description = "CRUD de equipos médicos")
public class EquipoMedicoController {

    private final EquipoMedicoService equipoMedicoService;

    @GetMapping
    public ResponseEntity<List<EquipoMedico>> obtenerTodos() {
        return ResponseEntity.ok(equipoMedicoService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(equipoMedicoService.obtenerPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/servicio/{servicioId}")
    public ResponseEntity<List<EquipoMedico>> obtenerPorServicio(@PathVariable Long servicioId) {
        return ResponseEntity.ok(equipoMedicoService.obtenerPorServicio(servicioId));
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Map<String, Object> request) {
        try {
            Long servicioId = Long.valueOf(request.get("servicioId").toString());
            String nombre = request.get("nombre").toString();
            String descripcion = request.get("descripcion") != null ? request.get("descripcion").toString() : null;

            EquipoMedico creado = equipoMedicoService.crear(servicioId, nombre, descripcion);
            return ResponseEntity.status(HttpStatus.CREATED).body(creado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            String nombre = request.get("nombre") != null ? request.get("nombre").toString() : null;
            String descripcion = request.get("descripcion") != null ? request.get("descripcion").toString() : null;

            return ResponseEntity.ok(equipoMedicoService.actualizar(id, nombre, descripcion));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            equipoMedicoService.eliminar(id);
            return ResponseEntity.ok(Map.of("mensaje", "Equipo médico eliminado"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
