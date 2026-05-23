package com.example.MediFlow.repository;

import com.example.MediFlow.model.HistorialClinico;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface HistorialClinicoRepository extends JpaRepository<HistorialClinico, Long> {
    List<HistorialClinico> findByPaciente_Id(Long pacienteId);
}