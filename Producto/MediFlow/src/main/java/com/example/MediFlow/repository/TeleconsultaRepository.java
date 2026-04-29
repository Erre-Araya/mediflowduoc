package com.example.MediFlow.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.MediFlow.model.Teleconsulta;

public interface TeleconsultaRepository extends JpaRepository<Teleconsulta, Long>{
    Optional<Teleconsulta> findByCita_Id(Long citaId);
    boolean existsByCita_Id(Long citaId);

}
