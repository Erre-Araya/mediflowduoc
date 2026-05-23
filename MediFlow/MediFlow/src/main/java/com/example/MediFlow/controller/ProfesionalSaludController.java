package com.example.MediFlow.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.MediFlow.model.ProfesionalSalud;
import com.example.MediFlow.service.ProfesionalSaludService;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/profesionales")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProfesionalSaludController {

    private final ProfesionalSaludService profesionalSaludService;

    @PostMapping
    public ResponseEntity<?> crear(
            @RequestBody Map<String, Object> request,
            @RequestHeader("rol") String rolUsuario
    ) {
        try {
            if (!"ADMIN".equalsIgnoreCase(rolUsuario)) {
                return ResponseEntity.status(403)
                    .body(Map.of("error", "Solo el admin puede crear profesionales"));
            }

            ProfesionalSalud profesional = profesionalSaludService.crear(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(profesional);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public List<ProfesionalSalud> listar() {
        return profesionalSaludService.listar();
    }

    @GetMapping("/especialidad/{especialidadId}")
    public ResponseEntity<?> listarPorEspecialidad(@PathVariable Long especialidadId) {
        return ResponseEntity.ok(profesionalSaludService.listarPorEspecialidad(especialidadId));
    }

    
}