package com.example.MediFlow.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import com.example.MediFlow.model.Especialidad;
import com.example.MediFlow.service.EspecialidadService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/especialidades")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EspecialidadController {

    private final EspecialidadService especialidadService;

    @GetMapping
    public List<Especialidad> listar() {
        return especialidadService.listar();
    }

    @PostMapping
    public ResponseEntity<?> crear(
            @RequestBody Especialidad especialidad,
            @RequestHeader("rol") String rolUsuario
    ) {
        try {
            if (!"ADMIN".equalsIgnoreCase(rolUsuario)) {
                return ResponseEntity.status(403)
                        .body(Map.of("error", "Solo el admin puede crear especialidades"));
            }

            especialidad.setId(null);
            Especialidad creada = especialidadService.crear(especialidad);
            return ResponseEntity.status(HttpStatus.CREATED).body(creada);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}