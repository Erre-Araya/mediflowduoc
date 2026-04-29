package com.example.MediFlow.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.MediFlow.model.HistorialClinico;

public interface HistorialClinicoRepository extends JpaRepository<HistorialClinico, Long> {
    List<HistorialClinico> findByPaciente_Id(Long pacienteId);
}
