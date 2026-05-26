package com.example.MediFlow.service;

import com.example.MediFlow.model.Cita;
import com.example.MediFlow.model.HistorialClinico;
import com.example.MediFlow.repository.CitaRepository;
import com.example.MediFlow.repository.HistorialClinicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HistorialClinicoService {

    private final HistorialClinicoRepository historialClinicoRepository;
    private final CitaRepository citaRepository;

    public HistorialClinico crear(
            Long citaId,
            String diagnostico,
            String tratamiento,
            String observaciones
    ) {
        Cita cita = citaRepository.findById(citaId)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));

        HistorialClinico historial = new HistorialClinico();

        historial.setCita(cita);
        historial.setPaciente(cita.getUsuario());
        historial.setProfesional(cita.getProfesional().getUsuario());
        historial.setDiagnostico(diagnostico);
        historial.setTratamiento(tratamiento);
        historial.setObservaciones(observaciones);
        historial.setFecha(LocalDateTime.now());
        historial.setFechaRegistro(LocalDateTime.now());

        return historialClinicoRepository.save(historial);
    }
    public List<HistorialClinico> listarTodos() {
        return historialClinicoRepository.findAll();
    }
    public List<HistorialClinico> listarPorPaciente(Long pacienteId) {
        return historialClinicoRepository.findByPaciente_Id(pacienteId);
    }
}