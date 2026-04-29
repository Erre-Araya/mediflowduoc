package com.example.MediFlow.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.MediFlow.model.Cita;
import com.example.MediFlow.model.Especialidad;
import com.example.MediFlow.model.ProfesionalSalud;
import com.example.MediFlow.model.Usuario;
import com.example.MediFlow.model.enums.EstadoCita;
import com.example.MediFlow.repository.CitaRepository;
import com.example.MediFlow.repository.EspecialidadRepository;
import com.example.MediFlow.repository.ProfesionalSaludRepository;
import com.example.MediFlow.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CitaService {

    private final CitaRepository citaRepository;
    private final UsuarioRepository usuarioRepository;
    private final EspecialidadRepository especialidadRepository;
    private final ProfesionalSaludRepository profesionalRepository;

    public Cita crear(Long usuarioId, Long especialidadId, LocalDate fecha, LocalTime hora, String motivo, String observaciones){

        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Especialidad especialidad = especialidadRepository.findById(especialidadId)
            .orElseThrow(() -> new RuntimeException("Especialidad no encontrada"));

        if (citaRepository.existsByUsuario_IdAndFechaAndHora(usuarioId, fecha, hora)) {
            throw new RuntimeException("El usuario ya tiene una cita en esa fecha y hora");
        }

        ProfesionalSalud profesional = profesionalRepository
            .findByEspecialidadId(especialidadId)
            .stream()
            .findFirst()
            .orElseThrow(() -> new RuntimeException("No hay profesionales disponibles"));

        boolean ocupado = citaRepository.existsByProfesionalAndFechaAndHora(
            profesional, fecha, hora
        );

        if (ocupado) {
            throw new RuntimeException("El profesional ya tiene una cita en ese horario");
        }

        Cita cita = Cita.builder()
            .usuario(usuario)
            .especialidad(especialidad)
            .profesional(profesional)
            .fecha(fecha)
            .hora(hora)
            .estadoCita(EstadoCita.PENDIENTE)
            .motivo(motivo)
            .observaciones(observaciones)
            .build();

        return citaRepository.save(cita);
    }

    public List<Cita> obtenerPorUsuario(Long usuarioId) {
    return citaRepository.findByUsuario_Id(usuarioId);
    }
}
