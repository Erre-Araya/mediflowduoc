package com.example.MediFlow.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.MediFlow.model.Paciente;


public interface PacienteRepository extends JpaRepository<Paciente, Long>{
    Optional<Paciente> findByUsuarioId(Long usuarioId);

}
