package com.example.MediFlow.dto;

import com.example.MediFlow.model.Comuna;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ComunaDTO {
    private Long id;
    private String nombre;
    private Long regionId;
    private String regionNombre;

    public static ComunaDTO fromEntity(Comuna comuna){
        return ComunaDTO.builder()
        .id(comuna.getId())
        .nombre(comuna.getNombre())
        .regionId(comuna.getRegion() != null ? comuna.getRegion().getId() : null)
        .regionNombre(comuna.getRegion() != null ? comuna.getRegion().getNombre() : null)
        .build();
        
    }
}
