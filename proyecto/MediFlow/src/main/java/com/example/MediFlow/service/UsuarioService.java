package com.example.MediFlow.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.MediFlow.dto.UsuarioDTO;
import com.example.MediFlow.model.Comuna;
import com.example.MediFlow.model.Especialidad;
import com.example.MediFlow.model.ProfesionalSalud;
import com.example.MediFlow.model.Region;
import com.example.MediFlow.model.Usuario;
import com.example.MediFlow.model.enums.Rol;
import com.example.MediFlow.repository.ComunaRepository;
import com.example.MediFlow.repository.EspecialidadRepository;
import com.example.MediFlow.repository.ProfesionalSaludRepository;
import com.example.MediFlow.repository.RegionRepository;
import com.example.MediFlow.repository.UsuarioRepository;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final ProfesionalSaludRepository profesionalSaludRepository;
    private final EspecialidadRepository especialidadRepository;
    private final RegionRepository regionRepository;
    private final ComunaRepository comunaRepository;

    @Transactional(readOnly = true)
    public List<UsuarioDTO> obtenerTodos(){
        return usuarioRepository.findAll().stream().map(UsuarioDTO::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<UsuarioDTO> obtenerPorId(Long id){
        return usuarioRepository.findById(id).map(UsuarioDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public Optional<UsuarioDTO> obtenerPorCorreo(String correo){
        return usuarioRepository.findByCorreo(correo).map(UsuarioDTO::fromEntity);
    }

    public UsuarioDTO crear(Usuario usuario){
        if (usuarioRepository.existsByCorreo(usuario.getCorreo())) {
            throw new RuntimeException("Ya existe un usuario con ese correo");
        }

        if(usuario.getRun() != null && !usuario.getRun().isEmpty()){
            if (usuarioRepository.existsByRun(usuario.getRun())) {
                throw new RuntimeException("Usuario con ese run ya existe");
            }
        }

        usuario.setRol(Rol.PACIENTE);
        usuario.setDebeCambiarPassword(false);

        Usuario guardado = usuarioRepository.save(usuario);
        return UsuarioDTO.fromEntity(guardado);
    }

    public UsuarioDTO actualizar(Long id, Usuario usuarioActualizado){
        Usuario existe = usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuarioActualizado.getNombres() != null) {
            existe.setNombres(usuarioActualizado.getNombres());
        }
        if (usuarioActualizado.getApellidos() != null) {
            existe.setApellidos(usuarioActualizado.getApellidos());
        }
        if (usuarioActualizado.getDireccion() != null) {
            existe.setDireccion(usuarioActualizado.getDireccion());
        }
        if (usuarioActualizado.getRegion() != null) {
            existe.setRegion(usuarioActualizado.getRegion());
        }
        if (usuarioActualizado.getComuna() != null) {
            existe.setComuna(usuarioActualizado.getComuna());
        }
        if (usuarioActualizado.getTelefono() != null) {
            existe.setTelefono(usuarioActualizado.getTelefono());
        }
        if (usuarioActualizado.getRol() != null) {
            existe.setRol(usuarioActualizado.getRol());
        }
        if (usuarioActualizado.getActivo() != null) {
            existe.setActivo(usuarioActualizado.getActivo());
        }
        if (usuarioActualizado.getPassword() != null && !usuarioActualizado.getPassword().isEmpty()) {
            existe.setPassword(usuarioActualizado.getPassword());
        }

        Usuario guardado = usuarioRepository.save(existe);
        return UsuarioDTO.fromEntity(guardado);
        }

        public void eliminar(Long id){
            if(!usuarioRepository.existsById(id)){
                throw new RuntimeException("Usuario  no encotnrado");
            }
            usuarioRepository.deleteById(id);
        }

        public UsuarioDTO desactivar(Long id){
            Usuario usuario = usuarioRepository.findById(id).orElseThrow(()-> new RuntimeException("Usuario no encontrado"));
            usuario.setActivo(false);
            return UsuarioDTO.fromEntity(usuarioRepository.save(usuario));
        }

        @Transactional(readOnly = true)
        public List<UsuarioDTO> buscar(String texto){
            return usuarioRepository.findByNombresContainingIgnoreCaseOrApellidosContainingIgnoreCase(texto, texto).stream().map(UsuarioDTO::fromEntity).collect(Collectors.toList());
        }

        @Transactional(readOnly = true)
        public List<UsuarioDTO> obtenerPorRol(Rol rol){
            return usuarioRepository.findByRol(rol).stream().map(UsuarioDTO::fromEntity).collect(Collectors.toList());
        }



    public UsuarioDTO crearPacienteAdmin(Map<String, Object> request) {

        if (usuarioRepository.existsByCorreo(request.get("correo").toString())) {
            throw new RuntimeException("Ya existe un usuario con ese correo");
        }

        String run = request.get("run") != null
                ? request.get("run").toString()
                : null;

        if (run != null && !run.isEmpty()) {
            if (usuarioRepository.existsByRun(run)) {
                throw new RuntimeException("Usuario con ese RUN ya existe");
            }
        }

        Region region = null;

        if (request.get("regionId") != null && !request.get("regionId").toString().isEmpty()) {
            Long regionId = Long.valueOf(request.get("regionId").toString());

            region = regionRepository.findById(regionId)
                    .orElseThrow(() -> new RuntimeException("Región no encontrada"));
        }

        Comuna comuna = null;

        if (request.get("comunaId") != null && !request.get("comunaId").toString().isEmpty()) {
            Long comunaId = Long.valueOf(request.get("comunaId").toString());

            comuna = comunaRepository.findById(comunaId)
                    .orElseThrow(() -> new RuntimeException("Comuna no encontrada"));

            if (region == null) {
                region = comuna.getRegion();
            }
        }

        Usuario usuario = Usuario.builder()
                .run(run)
                .nombres((String) request.get("nombres"))
                .apellidos((String) request.get("apellidos"))
                .correo((String) request.get("correo"))
                .telefono(request.get("telefono") != null ? request.get("telefono").toString() : null)
                .direccion(request.get("direccion") != null ? request.get("direccion").toString() : null)
                .region(region)
                .comuna(comuna)
                .password("1234pac")
                .rol(Rol.PACIENTE)
                .debeCambiarPassword(true)
                .activo(true)
                .build();

        Usuario guardado = usuarioRepository.save(usuario);

        return UsuarioDTO.fromEntity(guardado);
    }

    public UsuarioDTO cambiarPasswordObligatorio(Long id, String password) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setPassword(password);
        usuario.setDebeCambiarPassword(false);

        Usuario guardado = usuarioRepository.save(usuario);

        return UsuarioDTO.fromEntity(guardado);
    }

    public UsuarioDTO cambiarPasswordPerfil(
            Long id,
            String passwordActual,
            String nuevaPassword
    ) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!usuario.getPassword().equals(passwordActual)) {
            throw new RuntimeException("La contraseña actual no es correcta");
        }

        usuario.setPassword(nuevaPassword);
        usuario.setDebeCambiarPassword(false);

        Usuario guardado = usuarioRepository.save(usuario);

        return UsuarioDTO.fromEntity(guardado);
    }
        
}
