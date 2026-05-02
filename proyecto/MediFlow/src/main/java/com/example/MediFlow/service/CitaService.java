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

    public Cita crear(
            Long usuarioId,
            Long especialidadId,
            Long profesionalId,
            LocalDate fecha,
            LocalTime hora,
            String motivo,
            String observaciones
    ) {

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Especialidad especialidad = especialidadRepository.findById(especialidadId)
                .orElseThrow(() -> new RuntimeException("Especialidad no encontrada"));

        ProfesionalSalud profesional = profesionalRepository.findById(profesionalId)
                .orElseThrow(() -> new RuntimeException("Profesional no encontrado"));

        if (hora.getMinute() != 0 && hora.getMinute() != 30) {
            throw new RuntimeException("Las citas solo pueden agendarse cada 30 minutos");
        }

        if (hora.getSecond() != 0 || hora.getNano() != 0) {
            throw new RuntimeException("Hora inválida");
        }

        if (profesional.getHoraInicio() != null && profesional.getHoraFin() != null) {
            if (hora.isBefore(profesional.getHoraInicio()) || !hora.isBefore(profesional.getHoraFin())) {
                throw new RuntimeException("La hora está fuera del horario de atención del profesional");
            }
        }

        if (citaRepository.existsByUsuario_IdAndFechaAndHora(usuarioId, fecha, hora)) {
            throw new RuntimeException("El usuario ya tiene una cita en esa fecha y hora");
        }

        if (citaRepository.existsByProfesional_IdAndFechaAndHora(profesionalId, fecha, hora)) {
            throw new RuntimeException("El profesional ya tiene una cita en esa fecha y hora");
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

    public List<Cita> obtenerPorProfesionalUsuario(Long usuarioId) {
        return citaRepository.findByProfesional_Usuario_Id(usuarioId);
    }

    public Cita cambiarEstado(Long citaId, String estado) {
        Cita cita = citaRepository.findById(citaId)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));

        EstadoCita nuevoEstado = EstadoCita.valueOf(estado.toUpperCase());
        cita.setEstadoCita(nuevoEstado);

        return citaRepository.save(cita);
    }
}