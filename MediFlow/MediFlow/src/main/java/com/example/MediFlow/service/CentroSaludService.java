package com.example.MediFlow.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.MediFlow.model.CentroSalud;
import com.example.MediFlow.repository.CentroSaludRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CentroSaludService {
    
    private final CentroSaludRepository centroSaludRepository;

    public List<CentroSalud> obtenerTodos() {
        return centroSaludRepository.findAll();
    }

    public CentroSalud obtenerPorId(Long id) {
        return centroSaludRepository.findById(id).orElseThrow(() -> new RuntimeException("Centro de salud no encontrado"));
    }

    public CentroSalud crear(CentroSalud centroSalud) {
        return centroSaludRepository.save(centroSalud);
    }

    public CentroSalud actualizar(Long id, CentroSalud datos) {
        CentroSalud existente = obtenerPorId(id);

        if (datos.getNombre() != null) existente.setNombre(datos.getNombre());
        if (datos.getDireccion() != null) existente.setDireccion(datos.getDireccion());
        if (datos.getTelefono() != null) existente.setTelefono(datos.getTelefono());

        return centroSaludRepository.save(existente);
    }

    public void eliminar(Long id) {
        if (!centroSaludRepository.existsById(id)) {
            throw new RuntimeException("Centro de salud no encontrado");
        }
        centroSaludRepository.deleteById(id);
    }
}
