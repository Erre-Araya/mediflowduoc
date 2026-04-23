package com.example.MediFlow.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.MediFlow.model.EquipoMedico;
import com.example.MediFlow.model.Servicio;
import com.example.MediFlow.repository.EquipoMedicoRepository;
import com.example.MediFlow.repository.ServicioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EquipoMedicoService {

    private final EquipoMedicoRepository equipoMedicoRepository;
    private final ServicioRepository servicioRepository;

    public List<EquipoMedico> obtenerTodos() {
        return equipoMedicoRepository.findAll();
    }

    public EquipoMedico obtenerPorId(Long id) {
        return equipoMedicoRepository.findById(id).orElseThrow(() -> new RuntimeException("Equipo médico no encontrado"));
    }

    public List<EquipoMedico> obtenerPorServicio(Long servicioId) {
        return equipoMedicoRepository.finByServicio_Id(servicioId);
    }

    public EquipoMedico crear(Long servicioId, String nombre, String descripcion) {
        Servicio servicio = servicioRepository.findById(servicioId).orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        EquipoMedico equipo = EquipoMedico.builder()
                .servicio(servicio)
                .nombre(nombre)
                .descripcion(descripcion)
                .build();

        return equipoMedicoRepository.save(equipo);
    }

    public EquipoMedico actualizar(Long id, String nombre, String descripcion) {
        EquipoMedico equipo = obtenerPorId(id);
        if (nombre != null) equipo.setNombre(nombre);
        if (descripcion != null) equipo.setDescripcion(descripcion);
        return equipoMedicoRepository.save(equipo);
    }

    public void eliminar(Long id) {
        if (!equipoMedicoRepository.existsById(id)) {
            throw new RuntimeException("Equipo médico no encontrado");
        }
        equipoMedicoRepository.deleteById(id);
    }
}
