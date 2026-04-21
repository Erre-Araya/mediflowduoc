package com.example.MediFlow.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.MediFlow.model.Usuario;
import com.example.MediFlow.model.enums.Rol;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long>{

        Optional<Usuario> findByCorreo(String correo);

        Optional<Usuario> findByRun(String run);

        boolean existsByCorreo(String correo);
        
        boolean existsByRun(String run);

        List<Usuario> findByRol(Rol rol);

        List<Usuario> findByActivoTrue();

        
        List<Usuario> findByNombresContainingIgnoreCaseOrApellidosContainingIgnoreCase(String nombres, String apellidos);

}
