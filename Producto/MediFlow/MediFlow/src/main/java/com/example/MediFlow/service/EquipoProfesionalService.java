package com.example.MediFlow.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.MediFlow.model.EquipoMedico;
import com.example.MediFlow.model.EquipoProfesional;
import com.example.MediFlow.model.Servicio;
import com.example.MediFlow.repository.EquipoMedicoRepository;
import com.example.MediFlow.repository.EquipoProfesionalRepository;
import com.example.MediFlow.repository.ServicioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EquipoProfesionalService {
    private final EquipoProfesionalRepository equipoProfesionalRepository;
    private final ServicioRepository servicioRepository;
    private final EquipoMedicoRepository equipoMedicoRepository;

    public List<EquipoProfesional> obtenerTodos() {
        return equipoProfesionalRepository.findAll();
    }

    public EquipoProfesional obtenerPorId(Long id) {
        return equipoProfesionalRepository.findById(id).orElseThrow(() -> new RuntimeException("Equipo profesional no se encuentra"));
    }

    public List<EquipoProfesional> obtenerPorServicio(Long servicioId) {
        return equipoProfesionalRepository.findByServicio_Id(servicioId);
    }

    public List<EquipoProfesional> obtenerPorEquipoMedico(Long equipoMedicoId) {
        return equipoProfesionalRepository.findByEquipoMedico_Id(equipoMedicoId);
    }

    public EquipoProfesional crear(Long servicioId, Long equipoMedicoId, String nombre, String descripcion) {
        Servicio servicio = servicioRepository.findById(servicioId).orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        EquipoMedico equipoMedico = null;
        if (equipoMedicoId != null) {
            equipoMedico = equipoMedicoRepository.findById(equipoMedicoId).orElseThrow(() -> new RuntimeException("Equipo médico no encontrado"));
        }

        EquipoProfesional equipo = EquipoProfesional.builder()
                .servicio(servicio)
                .equipoMedico(equipoMedico)
                .nombre(nombre)
                .descripcion(descripcion)
                .build();

        return equipoProfesionalRepository.save(equipo);
    }

    public EquipoProfesional actualizar(Long id, String nombre, String descripcion, Long equipoMedicoId) {
        EquipoProfesional equipo = obtenerPorId(id);

        if (nombre != null) equipo.setNombre(nombre);
        if (descripcion != null) equipo.setDescripcion(descripcion);
        if (equipoMedicoId != null) {
            EquipoMedico equipoMedico = equipoMedicoRepository.findById(equipoMedicoId).orElseThrow(() -> new RuntimeException("Equipo médico no encontrado"));
            equipo.setEquipoMedico(equipoMedico);
        }

        return equipoProfesionalRepository.save(equipo);
    }

    public void eliminar(Long id) {
        if (!equipoProfesionalRepository.existsById(id)) {
            throw new RuntimeException("Equipo profesional no encontrado");
        }
        equipoProfesionalRepository.deleteById(id);
    }

}
