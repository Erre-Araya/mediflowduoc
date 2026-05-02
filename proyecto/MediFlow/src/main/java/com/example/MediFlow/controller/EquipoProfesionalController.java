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

import com.example.MediFlow.model.EquipoProfesional;
import com.example.MediFlow.service.EquipoProfesionalService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/equipos-profesionales")
@RequiredArgsConstructor
@Tag(name = "Equipos Profesionales", description = "CRUD de equipos profesionales")
public class EquipoProfesionalController {

    private final EquipoProfesionalService equipoProfesionalService;

    @GetMapping
    public ResponseEntity<List<EquipoProfesional>> obtenerTodos() {
        return ResponseEntity.ok(equipoProfesionalService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(equipoProfesionalService.obtenerPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/servicio/{servicioId}")
    public ResponseEntity<List<EquipoProfesional>> obtenerPorServicio(@PathVariable Long servicioId) {
        return ResponseEntity.ok(equipoProfesionalService.obtenerPorServicio(servicioId));
    }

    @GetMapping("/equipo-medico/{equipoMedicoId}")
    public ResponseEntity<List<EquipoProfesional>> obtenerPorEquipoMedico(@PathVariable Long equipoMedicoId) {
        return ResponseEntity.ok(equipoProfesionalService.obtenerPorEquipoMedico(equipoMedicoId));
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Map<String, Object> request) {
        try {
            Long servicioId = Long.valueOf(request.get("servicioId").toString());
            Long equipoMedicoId = request.get("equipoMedicoId") != null? Long.valueOf(request.get("equipoMedicoId").toString()): null;
            String nombre = request.get("nombre").toString();
            String descripcion = request.get("descripcion") != null ? request.get("descripcion").toString() : null;

            EquipoProfesional creado = equipoProfesionalService.crear(servicioId, equipoMedicoId, nombre, descripcion);
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
            Long equipoMedicoId = request.get("equipoMedicoId") != null? Long.valueOf(request.get("equipoMedicoId").toString()): null;

            return ResponseEntity.ok(
                    equipoProfesionalService.actualizar(id, nombre, descripcion, equipoMedicoId)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            equipoProfesionalService.eliminar(id);
            return ResponseEntity.ok(Map.of("mensaje", "Equipo profesional eliminado"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}