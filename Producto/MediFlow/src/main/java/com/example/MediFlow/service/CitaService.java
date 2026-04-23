package com.example.MediFlow.service;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.stereotype.Service;

import com.example.MediFlow.model.Cita;
import com.example.MediFlow.model.Especialidad;
import com.example.MediFlow.model.Usuario;
import com.example.MediFlow.model.enums.EstadoCita;
import com.example.MediFlow.repository.CitaRepository;
import com.example.MediFlow.repository.EspecialidadRepository;
import com.example.MediFlow.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CitaService {

    private final CitaRepository citaRepository;
    private final UsuarioRepository usuarioRepository;
    private final EspecialidadRepository especialidadRepository;

    public Cita crear(Long usuarioId, Long especialidadId, LocalDate fecha, LocalTime hora, String motivo, String observaciones){

        Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Especialidad especialidad = especialidadRepository.findById(especialidadId).orElseThrow(() -> new RuntimeException("Especialidad no encontrada"));

        if (citaRepository.existsByUsuario_IdAndFechaAndHora(usuarioId, fecha, hora)) {
            throw new RuntimeException("El usuario ya tiene una cita en esa fecha y hora");
        }

        Cita cita = Cita.builder()
                .usuario(usuario)
                .especialidad(especialidad)
                .fecha(fecha)
                .hora(hora)
                .estadoCita(EstadoCita.PENDIENTE)
                .motivo(motivo)
                .observaciones(observaciones)
                .build();

        return citaRepository.save(cita);

    }
}
