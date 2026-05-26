package com.example.MediFlow.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.MediFlow.model.Especialidad;
import com.example.MediFlow.repository.EspecialidadRepository;


import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EspecialidadService {

    private final EspecialidadRepository especialidadRepository;

    public List<Especialidad> listar() {
        return especialidadRepository.findAll();
    }

    public Especialidad crear(Especialidad especialidad) {
        return especialidadRepository.save(especialidad);
    }
}