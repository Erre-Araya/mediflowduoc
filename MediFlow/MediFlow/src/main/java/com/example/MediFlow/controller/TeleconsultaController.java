package com.example.MediFlow.controller;

import java.time.LocalDateTime;
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

import com.example.MediFlow.model.Teleconsulta;
import com.example.MediFlow.service.TeleconsultaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/teleconsultas")
@RequiredArgsConstructor
@Tag(name = "Teleconsultas", description = "CRUD de teleconsultas")
public class TeleconsultaController {

    private final TeleconsultaService teleconsultaService;

    @GetMapping
    public ResponseEntity<List<Teleconsulta>> obtenerTodas() {
        return ResponseEntity.ok(teleconsultaService.obtenerTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(teleconsultaService.obtenerPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    @Operation(summary = "Crear teleconsulta")
    public ResponseEntity<?> crear(@RequestBody Map<String, Object> request) {
        try {
            Long citaId = Long.valueOf(request.get("citaId").toString());
            LocalDateTime fechaIni = LocalDateTime.parse(request.get("fechaIni").toString());
            LocalDateTime fechaTermino = request.get("fechaTermino") != null? LocalDateTime.parse(request.get("fechaTermino").toString()) : null;

            Teleconsulta creada = teleconsultaService.crear(citaId, fechaIni, fechaTermino);
            return ResponseEntity.status(HttpStatus.CREATED).body(creada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            LocalDateTime fechaIni = request.get("fechaIni") != null? LocalDateTime.parse(request.get("fechaIni").toString()) : null;

            LocalDateTime fechaTermino = request.get("fechaTermino") != null? LocalDateTime.parse(request.get("fechaTermino").toString()) : null;

            return ResponseEntity.ok(teleconsultaService.actualizar(id, fechaIni, fechaTermino));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            teleconsultaService.eliminar(id);
            return ResponseEntity.ok(Map.of("mensaje", "Teleconsulta eliminada correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}