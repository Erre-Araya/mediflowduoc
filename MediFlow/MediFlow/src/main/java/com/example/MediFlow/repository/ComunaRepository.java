package com.example.MediFlow.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.MediFlow.model.Comuna;
import com.example.MediFlow.model.Region;

@Repository
public interface ComunaRepository extends JpaRepository<Comuna, Long>{

    List<Comuna> findByRegion(Region region);

    List<Comuna> findByRegionId(Long regionId);

    List<Comuna> findByRegionIdAndActivoTrue(Long regionId);

    Optional<Comuna> findByNombreAndRegion(String nombre, Region region);

    List<Comuna> findByActivoTrue();
}
