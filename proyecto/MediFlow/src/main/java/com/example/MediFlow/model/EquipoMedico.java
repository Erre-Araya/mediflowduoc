package com.example.MediFlow.model;

import jakarta.annotation.Generated;
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
@Table(name = "equipos_medicos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipoMedico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_equipos")
    private long id;

    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    @ManyToOne(optional = false)
    @JoinColumn(name = "servicio_id", nullable = false)
    private Servicio servicio;

    @ManyToOne(optional = false)
    @JoinColumn(name = "equipo_profesional_id", nullable = false)
    private EquipoProfesional equipoProfesional;
}
