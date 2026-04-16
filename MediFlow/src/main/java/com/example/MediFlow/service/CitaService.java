package com.example.MediFlow.service;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.stereotype.Service;

import com.example.MediFlow.model.Cita;
import com.example.MediFlow.model.Paciente;
import com.example.MediFlow.model.ProfesionalSalud;
import com.example.MediFlow.model.Servicio;
import com.example.MediFlow.model.enums.EstadoCita;
import com.example.MediFlow.repository.CitaRepository;
import com.example.MediFlow.repository.PacienteRepository;
import com.example.MediFlow.repository.ProfesionalSaludRepository;
import com.example.MediFlow.repository.ServicioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CitaService {

    private final CitaRepository citaRepository;
    private final PacienteRepository pacienteRepository;
    private final ProfesionalSaludRepository profesionalSaludRepository;
    private final ServicioRepository servicioRepository;

    public Cita crear(Long pacienteId, Long profesionalId, Long servicioId, LocalDate fecha, LocalTime hora, String motivo){

        Paciente paciente = pacienteRepository.findById(pacienteId).orElseThrow(()-> new RuntimeException("Paciente no se enceutrea"));
        ProfesionalSalud profesionalSalud = profesionalSaludRepository.findById(profesionalId).orElseThrow(()-> new RuntimeException("Profesional no ecintrado"));
        Servicio servicio = servicioRepository.findById(servicioId).orElseThrow(()-> new RuntimeException("Servicio no eocntrado"));

        if(citaRepository.existsByProfesionalIdAndFechaAndHora(profesionalId, fecha, hora)){
            throw new RuntimeException("El profesional ya tiene esa hora ocuapda");
        }

        Cita cita = Cita.builder()
        .paciente(paciente)
        .profesionalSalud(profesionalSalud)
        .servicio(servicio)
        .fecha(fecha)
        .hora(hora)
        .estadoCita(EstadoCita.PENDIENTE)
        .motivo(motivo)
        .build();

        return citaRepository.save(cita);

    }
}
