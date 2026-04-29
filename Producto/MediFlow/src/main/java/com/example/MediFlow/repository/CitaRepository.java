package com.example.MediFlow.repository;

import java.time.LocalDate;
import java.time.LocalTime;


import org.springframework.data.jpa.repository.JpaRepository;

import com.example.MediFlow.model.Cita;

public interface CitaRepository extends JpaRepository <Cita, Long>{
    boolean existsByUsuario_IdAndFechaAndHora(Long usuarioId, LocalDate fecha, LocalTime hora);

}
