package com.example.MediFlow.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "profesional_servicio")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfesionalServicio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String precio;

    @Column(nullable = false)
    private String duracion;
    
    @ManyToOne(optional = false)
    @JoinColumn(name = "profesional_salud_id", nullable = false)
    private ProfesionalSalud profesionalSalud;

    @ManyToOne(optional = false)
    @JoinColumn(name = "servicio_id", nullable = false)
    private Servicio servicio;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    @Builder.Default
    private LocalDate fecha_creacion = LocalDate.now();

    @Column(name = "activo")
    @Builder.Default
    private Boolean activo = true;


}
