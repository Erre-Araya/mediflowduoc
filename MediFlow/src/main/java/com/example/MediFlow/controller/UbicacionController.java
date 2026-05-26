package com.example.MediFlow.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.MediFlow.dto.ComunaDTO;
import com.example.MediFlow.dto.RegionDTO;
import com.example.MediFlow.service.UbicacionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/ubicacion")
@RequiredArgsConstructor
@Tag(name = "ubicacion", description = "EndPonts para regiones y comunas")
public class UbicacionController {

    private final UbicacionService ubicacionService;

    @GetMapping("/regiones")
    @Operation(summary = "Listar regiones", description = "Obtiene todas las regiones")
    public ResponseEntity<List<RegionDTO>> obtenerRegiones() {
        return ResponseEntity.ok(ubicacionService.obtenerRegiones());
    }

    @GetMapping("/regiones/completas")
    @Operation(summary = "Listar regiones con comunas", description = "Obtiene todas las regiones con sus respectivas comunas")
    public ResponseEntity<List<RegionDTO>> obtenerRegionesConComunas() {
        return ResponseEntity.ok(ubicacionService.obtenerRegionesConComunas());
    }

    @GetMapping("/regiones/{id}")
    @Operation(summary = "Obtener region", description = "Obtiene una region por ID con sus comunas")
    public ResponseEntity<RegionDTO> obtenerRegion(@PathVariable Long id) {
        return ResponseEntity.ok(ubicacionService.obtenerRegionPorId(id));
    }

    @GetMapping("/regiones/{regionId}/comunas")
    @Operation(summary = "Listar comunas por region", description = "Obtiene las comunas de una region especifica")
    public ResponseEntity<List<ComunaDTO>> obtenerComunasPorRegion(@PathVariable Long regionId) {
        return ResponseEntity.ok(ubicacionService.obtenerComunasPorRegion(regionId));
    }

    @GetMapping("/comunas")
    @Operation(summary = "Listar todas las comunas", description = "Obtiene todas las comunas")
    public ResponseEntity<List<ComunaDTO>> obtenerComunas() {
        return ResponseEntity.ok(ubicacionService.obtenerTodasLasComunas());
    }
}
