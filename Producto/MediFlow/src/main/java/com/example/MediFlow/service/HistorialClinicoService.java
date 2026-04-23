package com.example.MediFlow.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.MediFlow.model.HistorialClinico;
import com.example.MediFlow.model.Paciente;
import com.example.MediFlow.repository.HistorialClinicoRepository;
import com.example.MediFlow.repository.PacienteRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HistorialClinicoService {
    private final HistorialClinicoRepository historialClinicoRepository;
    private final PacienteRepository pacienteRepository;

    public List<HistorialClinico> obtenerTodos(){
        return historialClinicoRepository.findAll();
    }

    public HistorialClinico obtenerPorId(Long id){
        return historialClinicoRepository.findById(id).orElseThrow(()-> new RuntimeException("Historial no encotnrado"));

    }

    public List<HistorialClinico> obtenerPorPaciente(Long pacienteId){
        return historialClinicoRepository.findByPaciente_Id(pacienteId);
    }

    public HistorialClinico crear(Long pacienteId, LocalDate fecha, String diagnostico, String tratamiento, String comentarios){
        Paciente paciente = pacienteRepository.findById(pacienteId).orElseThrow(()-> new RuntimeException("Paciente no encontrado"));

        HistorialClinico historial = HistorialClinico.builder()
            .paciente(paciente)
            .fecha(fecha)
            .diagnostico(diagnostico)
            .tratamiento(tratamiento)
            .comentarios(comentarios)
            .build();

        return historialClinicoRepository.save(historial);
    }

    public HistorialClinico actualizar(Long id, LocalDate fecha, String diagnostico, String tratamiento, String comentarios) {

        HistorialClinico historial = obtenerPorId(id);

        if (fecha != null) historial.setFecha(fecha);
        if (diagnostico != null) historial.setDiagnostico(diagnostico);
        if (tratamiento != null) historial.setTratamiento(tratamiento);
        if (comentarios != null) historial.setComentarios(comentarios);

        return historialClinicoRepository.save(historial);
    }

    public void eliminar(Long id) {
        if (!historialClinicoRepository.existsById(id)) {
            throw new RuntimeException("Historial clínico no encontrado");
        }
        historialClinicoRepository.deleteById(id);
    }
}
