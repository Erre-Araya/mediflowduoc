package com.example.MediFlow.model;

import java.time.LocalDateTime;

import com.example.MediFlow.model.enums.Rol;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(unique = true, length = 12)
    @Pattern(regexp = "^[0-9]{7,8}[0-9Kk]$", message = "RUN inválido")
    private String run;

    @NotBlank(message = "El nombre es requerido")
    @Size(max = 50, message = "El nombre no puede superar 50 caracteres")
    @Column(nullable = false, length = 50)
    private String nombres;

    @NotBlank(message = "El apellido es requerido")
    @Size(max = 50, message = "El apellido no puede superar 50 caracteres")
    @Column(nullable = false, length = 50)
    private String apellidos;

    @NotBlank(message = "El correo es requerido")
    @Email(message = "Correo electrónico inválido")
    @Size(max = 100, message = "El correo no puede superar 100 caracteres")
    @Column(nullable = false, unique = true, length = 100)
    private String correo;

    @NotBlank(message = "La contraseña es requerida")
    @Size(min = 4, message = "La contraseña debe tener al menos 4 caracteres")
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private Rol rol = Rol.PACIENTE;

    @Size(max = 200, message = "La dirección no puede superar 200 caracteres")
    @Column(length = 200)
    private String direccion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id")
    private Region region;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comuna_id")
    private Comuna comuna;

    @Column(length = 20)
    private String telefono;

    @Column(name = "fecha_registro", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime fechaRegistro = LocalDateTime.now();

    @Column(name = "activo")
    @Builder.Default
    private Boolean activo = true;

    private Boolean debeCambiarPassword;
}
