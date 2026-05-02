package com.example.MediFlow.service;

import lombok.RequiredArgsConstructor;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.MediFlow.model.*;
import com.example.MediFlow.model.enums.Rol;
import com.example.MediFlow.repository.*;

@Service
@RequiredArgsConstructor
public class ProfesionalSaludService {

    private final ProfesionalSaludRepository profesionalRepository;
    private final UsuarioRepository usuarioRepository;
    private final EspecialidadRepository especialidadRepository;


        public ProfesionalSalud crear(Map<String, Object> request) {

        String nombres = request.get("nombres").toString();
        String apellidos = request.get("apellidos").toString();
        String correo = request.get("correo").toString();
        String password = request.get("password").toString();

        Long especialidadId = Long.valueOf(request.get("especialidadId").toString());

        String numeroRegistro = request.get("numeroRegistro").toString();
        String horarioAtencion = request.get("horarioAtencion").toString();

        if (usuarioRepository.existsByCorreo(correo)) {
                throw new RuntimeException("Ya existe un usuario con ese correo");
        }

        Especialidad especialidad = especialidadRepository.findById(especialidadId)
                .orElseThrow(() -> new RuntimeException("Especialidad no encontrada"));

        Usuario usuario = Usuario.builder()
                .nombres(nombres)
                .apellidos(apellidos)
                .correo(correo)
                .password(password)
                .rol(Rol.PROFESIONAL) // 🔥 clave
                .activo(true)
                .build();

        usuarioRepository.save(usuario);

        ProfesionalSalud profesional = ProfesionalSalud.builder()
                .usuario(usuario)
                .especialidad(especialidad)
                .numeroRegistro(numeroRegistro)
                .horarioAtencion(horarioAtencion)
                .disponible(true)
                .build();

        return profesionalRepository.save(profesional);
        }
}