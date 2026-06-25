package com.example.MediFlow.model;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "pacientes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Paciente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "usuario_id", unique = true, nullable = false)
    private Usuario usuario;

    private String prevision;
    private String observacion;
}
