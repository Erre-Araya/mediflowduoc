package com.example.MediFlow.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.MediFlow.dto.ComunaDTO;
import com.example.MediFlow.dto.RegionDTO;
import com.example.MediFlow.model.Region;
import com.example.MediFlow.repository.ComunaRepository;
import com.example.MediFlow.repository.RegionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UbicacionService {
    private final RegionRepository regionRepository;
    private final ComunaRepository comunaRepository;

    public List<RegionDTO> obtenerRegiones(){
        return regionRepository.findByActivoTrue().stream().map(RegionDTO::fromEntity).collect(Collectors.toList());
    }

    public List<RegionDTO> obtenerRegionesConComunas() {
        return regionRepository.findByActivoTrue().stream().map(RegionDTO::fromEntityWithComunas).collect(Collectors.toList());
    }

    public RegionDTO obtenerRegionPorId(Long id) {
        Region region = regionRepository.findById(id).orElseThrow(() -> new RuntimeException("Region no encontrada"));
        return RegionDTO.fromEntityWithComunas(region);
    }

    public List<ComunaDTO> obtenerComunasPorRegion(Long regionId) {
        return comunaRepository.findByRegionIdAndActivoTrue(regionId).stream().map(ComunaDTO::fromEntity).collect(Collectors.toList());
    }

    public List<ComunaDTO> obtenerTodasLasComunas() {
        return comunaRepository.findByActivoTrue().stream().map(ComunaDTO::fromEntity).collect(Collectors.toList());
    }
}
