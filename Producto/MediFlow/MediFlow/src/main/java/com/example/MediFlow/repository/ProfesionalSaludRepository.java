package com.example.MediFlow.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.MediFlow.model.ProfesionalSalud;

public interface ProfesionalSaludRepository extends JpaRepository<ProfesionalSalud, Long>{

    Optional<ProfesionalSalud> findByUsuarioId(Long usuarioId);
    List<ProfesionalSalud> findByEspecialidadId(Long especialidadId);
    List<ProfesionalSalud> findByEspecialidad_Id(Long especialidadId);
    
}
