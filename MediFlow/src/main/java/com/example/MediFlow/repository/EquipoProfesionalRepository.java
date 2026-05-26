package com.example.MediFlow.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.MediFlow.model.EquipoProfesional;

public interface EquipoProfesionalRepository extends JpaRepository<EquipoProfesional, Long>{
    List<EquipoProfesional> findByServicio_Id(Long servicioId);
    List<EquipoProfesional> findByEquipoMedico_Id(Long equipoMedicoId);
}
