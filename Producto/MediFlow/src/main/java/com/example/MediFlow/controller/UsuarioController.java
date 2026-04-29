package com.example.MediFlow.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.MediFlow.dto.UsuarioDTO;
import com.example.MediFlow.model.Comuna;
import com.example.MediFlow.model.Region;
import com.example.MediFlow.model.Usuario;
import com.example.MediFlow.model.enums.Rol;
import com.example.MediFlow.repository.ComunaRepository;
import com.example.MediFlow.repository.RegionRepository;
import com.example.MediFlow.repository.UsuarioRepository;
import com.example.MediFlow.service.UsuarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@Tag(name = "Usuarios", description = "CRUD de usuarios")

public class UsuarioController {
    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;
    private final RegionRepository regionRepository;
    private final ComunaRepository comunaRepository;

    @GetMapping
    @Operation(summary = "Listar usuarios", description = "Obtiene todos los usuarios")
    public ResponseEntity<List<UsuarioDTO>> obtenerTodos(){
        return ResponseEntity.ok(usuarioService.obtenerTodos());
    }

    @GetMapping("{id}")
    @Operation(summary = "Obtener usuario", description = "Obtiene un usuario por su ID")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id){
        return usuarioService.obtenerPorId(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Crear usuario", description = "Crear un nuevo usuario")
    public ResponseEntity<?> crear(@RequestBody Map<String, Object> request){
        try{
            Region region = null;
            if (request.get("regionId") != null) {
                Long regionId = Long.valueOf(request.get("regionId").toString());
                region = regionRepository.findById(regionId).orElse(null);
            }
            
            Comuna comuna = null;
            if (request.get("comunaId") != null) {
                Long comunaId =Long.valueOf(request.get("comunaId").toString());
                comuna = comunaRepository.findById(comunaId).orElse(null);
                if(comuna != null && region ==null){
                    region = comuna.getRegion();
                }
            }

            Usuario nuevoUsuario = Usuario.builder()
                .run((String) request.get("run"))
                .nombres((String) request.get("nombres"))
                .apellidos((String) request.get("apellidos"))
                .correo((String) request.get("correo"))
                .password(request.get("password") != null ? (String) request.get("password") : "1234")
                .direccion((String) request.get("direccion"))
                .region(region)
                .comuna(comuna)
                .telefono(request.get("telefono") != null ? (String) request.get("telefono") : null)
                .rol(request.get("rol") != null ? Rol.valueOf(request.get("rol").toString()) : Rol.PACIENTE)
                .build();

            UsuarioDTO creado = usuarioService.crear(nuevoUsuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(creado);
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("erroe", e.getMessage()));
        }catch(Exception e){
            return ResponseEntity.badRequest().body(Map.of("error", "error al realizar la peticion: "  + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario", description = "Actualiza un usuario")
    public ResponseEntity<?> actulizar(@PathVariable Long id, @RequestBody Map<String, Object> request){
        try{
            Usuario existe = usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("usuario no encontrado"));

            if(request.get("regionId") != null){
                Long regionId = Long.valueOf(request.get("regionId").toString());
                Region region = regionRepository.findById(regionId).orElse(null);
                existe.setRegion(region);
            }

            if (request.get("comunaId") != null) {
                Long comunaId = Long.valueOf(request.get("comunaId").toString());
                Comuna comuna = comunaRepository.findById(comunaId).orElse(null);
                existe.setComuna(comuna);
            }

            if(request.get("run") != null) existe.setRun((String) request.get("run"));
            if(request.get("nombres") != null) existe.setNombres((String) request.get("nombres"));
            if(request.get("apellidos") != null) existe.setApellidos((String) request.get("apellidos"));
            if(request.get("correo") != null) existe.setCorreo((String) request.get("correo"));
            if(request.get("direccion") != null) existe.setDireccion((String) request.get("direccion"));
            if(request.get("telefono") != null) existe.setTelefono((String) request.get("telefono"));
            if(request.get("rol") != null) existe.setRol(Rol.valueOf(request.get("rol").toString()));

            UsuarioDTO actualizado = usuarioService.actualizar(id, existe);
            return ResponseEntity.ok(actualizado);
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }catch(Exception e){
            return ResponseEntity.badRequest().body(Map.of("error", "error al realizar la solicitud" + e.getMessage()));
        }
    }

    @DeleteMapping("{id}")
    @Operation(summary = "Eliminar un usuario", description = "Eliminar un usaurio deforma permanente")
    public ResponseEntity<?> eliminar(@PathVariable Long id){
        try{
            usuarioService.eliminar(id);
            return ResponseEntity.ok(Map.of("...","Usuario eliminado correctamente"));
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("Error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/desactivar")
    @Operation(summary = "Desactivar usuario", description = "Desactiva un usuario sin eliminarlo")
    public ResponseEntity<?> desactivar(@PathVariable Long id) {
        try {
            UsuarioDTO desactivado = usuarioService.desactivar(id);
            return ResponseEntity.ok(desactivado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/rol/{rol}")
    @Operation(summary = "Usuarios por rol", description = "Obtiene usuarios por su rol")
    public ResponseEntity<List<UsuarioDTO>> obtenerPorRol(@PathVariable String rol) {
        try {
            Rol rolEnum = Rol.valueOf(rol.toUpperCase());
            return ResponseEntity.ok(usuarioService.obtenerPorRol(rolEnum));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/buscar")
    @Operation(summary = "Buscar usuarios", description = "Busca usuarios por nombre o apellido")
    public ResponseEntity<List<UsuarioDTO>> buscar(@RequestParam String texto) {
        return ResponseEntity.ok(usuarioService.buscar(texto));
    }
}

