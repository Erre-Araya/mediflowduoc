package com.example.MediFlow.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.MediFlow.model.Region;

@Repository
public interface RegionRepository extends JpaRepository<Region, Long>{

    Optional<Region> findByNombre(String nombre);

    List<Region> findByActivoTrue();

    boolean existsByNombre(String nombre);
}
