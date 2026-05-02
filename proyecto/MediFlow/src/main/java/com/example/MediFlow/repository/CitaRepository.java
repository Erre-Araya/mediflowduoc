package com.example.MediFlow.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.MediFlow.model.Cita;
import com.example.MediFlow.model.ProfesionalSalud;
import com.example.MediFlow.model.Usuario;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CitaRepository extends JpaRepository <Cita, Long>{
    boolean existsByUsuario_IdAndFechaAndHora(Long usuarioId, LocalDate fecha, LocalTime hora);
    boolean existsByProfesionalAndFechaAndHora(ProfesionalSalud profesional,LocalDate fecha,LocalTime hora);
    List<Cita> findByUsuario_Id(Long usuarioId);
    boolean existsByProfesional_IdAndFechaAndHora(Long profesionalId, LocalDate fecha, LocalTime hora);
    List<Cita> findByProfesional_Usuario_Id(Long usuarioId);
    
    @Query("SELECT DISTINCT c.usuario FROM Cita c WHERE c.profesional.usuario.id = :usuarioId")
    List<Usuario> findPacientesByProfesionalUsuarioId(@Param("usuarioId") Long usuarioId);

}
