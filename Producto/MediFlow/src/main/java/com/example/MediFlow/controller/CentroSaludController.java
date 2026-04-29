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

import com.example.MediFlow.model.CentroSalud;
import com.example.MediFlow.service.CentroSaludService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/centros-salud")
@RequiredArgsConstructor
@Tag(name = "Centros de Salud", description = "CRUD de centros de salud")
public class CentroSaludController {

    private final CentroSaludService centroSaludService;

    @GetMapping
    public ResponseEntity<List<CentroSalud>> obtenerTodos() {
        return ResponseEntity.ok(centroSaludService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(centroSaludService.obtenerPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<CentroSalud> crear(@RequestBody CentroSalud centroSalud) {
        return ResponseEntity.status(HttpStatus.CREATED).body(centroSaludService.crear(centroSalud));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody CentroSalud centroSalud) {
        try {
            return ResponseEntity.ok(centroSaludService.actualizar(id, centroSalud));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            centroSaludService.eliminar(id);
            return ResponseEntity.ok(Map.of("mensaje", "Centro de salud eliminado correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}