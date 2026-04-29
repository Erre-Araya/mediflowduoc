package com.example.MediFlow.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.MediFlow.model.EquipoMedico;

public interface EquipoMedicoRepository extends JpaRepository<EquipoMedico, Long>{
    List<EquipoMedico> findByServicio_Id(Long servicioId);

}
