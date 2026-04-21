package com.example.MediFlow.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.MediFlow.model.Servicio;

public interface ServicioRepository extends JpaRepository<Servicio, Long>{
    List<Servicio> findByEspecialidadId(Long especialidadId);

}
