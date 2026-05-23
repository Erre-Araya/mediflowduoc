package com.example.MediFlow.dto;

import java.time.LocalDateTime;

import com.example.MediFlow.model.Usuario;
import com.example.MediFlow.model.enums.Rol;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class UsuarioDTO {
    private Long id;
    private String run;
    private String nombres;
    private String apellidos;
    private String correo;
    private Rol rol;
    private String direccion;

    private Long regionId;
    private String regionNombre;

    private Long comunaId;
    private String comunaNombre;

    private String telefono;
    private LocalDateTime fechaRegistro;
    private Boolean activo;
    private Boolean debeCambiarPassword;

    public static UsuarioDTO fromEntity(Usuario usuario){
        if(usuario == null) return null;
        return UsuarioDTO.builder()
            .id(usuario.getId())
            .run(usuario.getRun())
            .nombres(usuario.getNombres())
            .apellidos(usuario.getApellidos())
            .correo(usuario.getCorreo())
            .rol(usuario.getRol())
            .direccion(usuario.getDireccion())
            .regionId(usuario.getRegion() != null ? usuario.getRegion().getId() : null)
            .regionNombre(usuario.getRegion() != null ? usuario.getRegion().getNombre() : null)
            .comunaId(usuario.getComuna() != null ? usuario.getComuna().getId() : null)
            .comunaNombre(usuario.getComuna() != null ? usuario.getComuna().getNombre() : null)
            .telefono(usuario.getTelefono())
            .fechaRegistro(usuario.getFechaRegistro())
            .activo(usuario.getActivo())
            .debeCambiarPassword(usuario.getDebeCambiarPassword())
            .build();
    }
}
