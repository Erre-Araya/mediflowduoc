package com.example.MediFlow.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "centros_salud")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CentroSalud {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_centro_salud")
    private long id;

    @Column(nullable = false)
    private String nombre;

    private String direccion;
    private String telefono;

    @OneToMany(mappedBy = "centroSalud")
    @Builder.Default
    private List<Servicio> servicios = new ArrayList<>();
}
