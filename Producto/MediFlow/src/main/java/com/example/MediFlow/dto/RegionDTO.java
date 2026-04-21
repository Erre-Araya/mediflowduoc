package com.example.MediFlow.dto;

import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import com.example.MediFlow.model.Region;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class RegionDTO {
    private Long id;
    private String nombre;
    private String codigo;
    private List<ComunaDTO> comunas;
    
    public static RegionDTO fromEntity(Region region){
        return RegionDTO.builder()
        .id(region.getId())
        .nombre(region.getNombre())
        .codigo(region.getCodigo())
        .build();
    }

    public static RegionDTO fromEntityWithComunas(Region region){
        return RegionDTO.builder()
        .id(region.getId())
        .nombre(region.getNombre())
        .codigo(region.getCodigo())
        .comunas(region.getComunas().stream().map(ComunaDTO::fromEntity).collect(Collectors.toList()))
        .build();
    }
}
