package com.example.MediFlow.service;

import com.example.MediFlow.dto.ChatRequest;
import com.example.MediFlow.dto.ChatResponse;
import com.example.MediFlow.model.Cita;
import com.example.MediFlow.model.Especialidad;
import com.example.MediFlow.model.ProfesionalSalud;
import com.example.MediFlow.model.Usuario;
import com.example.MediFlow.model.enums.Rol;
import com.example.MediFlow.repository.EspecialidadRepository;
import com.example.MediFlow.repository.ProfesionalSaludRepository;
import com.example.MediFlow.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String OLLAMA_URL = "http://localhost:11434/api/generate";

    private final EspecialidadRepository especialidadRepository;
    private final ProfesionalSaludRepository profesionalSaludRepository;
    private final CitaService citaService;
    private final UsuarioRepository usuarioRepository;

    public String consultarOllama(String mensajeUsuario, List<ChatRequest.MensajeHistorial> historial) {
    try {
        String contextoNegocio = obtenerContextoNegocio();

        StringBuilder historialTexto = new StringBuilder();
        if (historial != null && !historial.isEmpty()) {
            int desde = Math.max(0, historial.size() - 15);
            historial.subList(desde, historial.size()).forEach(msg -> {
                String etiqueta = "usuario".equals(msg.getRol()) ? "Usuario" : "Asistente";
                historialTexto.append(etiqueta).append(": ").append(msg.getTexto()).append("\n");
            });
        }

            String promptCompleto =
                """
                Eres el asistente virtual de MediFlow, una plataforma de gestión médica.

                Tu función es ayudar a los usuarios con información sobre:
                - médicos y especialidades
                - horarios de atención
                - disponibilidad
                - reservas de horas
                - funcionamiento del centro médico
                - servicios disponibles

                REGLAS IMPORTANTES:
                - Responde siempre en español.
                - Sé amable, natural y cercana.
                - Responde de forma clara y breve.
                - Mantén el contexto de la conversación.
                - Si el usuario hace una pregunta corta o ambigua, intenta inferir el contexto usando los mensajes anteriores.
                - Ejemplo:
                Usuario: "quiero saber los médicos que atienden"
                Usuario: "horario"
                Debes entender que pregunta por el horario de esos médicos.

                - Si aun así la intención no es clara, realiza una pregunta breve para aclarar antes de responder.
                - Nunca inventes información que no esté disponible.
                - Si la consulta es médica o requiere diagnóstico, recomienda consultar con un profesional.
                - Si existe una especialidad relacionada, invita amablemente a agendar una atención en el centro médico.

                IMPORTANTE:
                Si el usuario pregunta información relacionada con el centro médico,
                responde SOLO utilizando la información entregada más abajo.

                === INFORMACIÓN ACTUAL DEL CENTRO MÉDICO ===
                """ +
                contextoNegocio +
                "=== FIN DE LA INFORMACIÓN ===\n\n" +
                (historialTexto.length() > 0
                    ? "=== CONVERSACIÓN ANTERIOR ===\n" + historialTexto + "=== FIN CONVERSACIÓN ===\n\n"
                    : "") +
                "Usuario: " + mensajeUsuario + "\nAsistente:";

            Map<String, Object> body = new HashMap<>();
            body.put("model", "llama3.2");
            body.put("stream", false);
            body.put("prompt", promptCompleto);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                OLLAMA_URL, request, Map.class
            );

            if (response.getBody() != null && response.getBody().containsKey("response")) {
                return response.getBody().get("response").toString().trim();
            }

            return "No pude obtener una respuesta. Intenta de nuevo.";

        } catch (Exception e) {
            System.out.println("Error conectando con Ollama: " + e.getMessage());
            return "El servicio no está disponible en este momento.";
        }
    }

    private String obtenerContextoNegocio() {
        StringBuilder ctx = new StringBuilder();

        //Especialidades
        List<Especialidad> especialidades = especialidadRepository.findAll();
        ctx.append("ESPECIALIDADES DISPONIBLES:\n");
        if (especialidades.isEmpty()) {
            ctx.append("No tenemos especialidades registradas, ¿qué buscas?\n");
        } else {
            especialidades.forEach(e ->
                ctx.append("- ").append(e.getNombre())
                    .append(e.getDescripcion() != null ? ": " + e.getDescripcion() : "")
                    .append("\n")
            );
        }

        //Profesionales
        List<ProfesionalSalud> profesionales = profesionalSaludRepository.findAll();
        ctx.append("\nPROFESIONALES DISPONIBLES:\n");
        if (profesionales.isEmpty()) {
            ctx.append("No hay profesionales registrados.\n");
        } else {
            profesionales.forEach(p -> {
                String nombre = p.getUsuario().getNombres() + " " + p.getUsuario().getApellidos();
                String especialidad = p.getEspecialidad() != null ? p.getEspecialidad().getNombre() : "Sin especialidad";
                String horario = (p.getHoraInicio() != null && p.getHoraFin() != null)
                    ? p.getHoraInicio() + " a " + p.getHoraFin()
                    : "Horario no definido";

                ctx.append("- ").append(nombre)
                    .append(" | Especialidad: ").append(especialidad)
                    .append(" | Horario: ").append(horario)
                    .append("\n");
            });
        }

        return ctx.toString();
    }

    public ChatResponse agendarCitaDesdeChat(ChatRequest request) {
        try {
            String mensaje = normalizarMensajeAgenda(request.getMensaje());

            String[] partes = mensaje.split("\\s+");

            if (partes.length < 4) {
                return new ChatResponse(
                    "Para agendar usa un formato como: agendar cardiología 10/06/2026 10:00"
                );
            }

            String nombreEspecialidad = partes[1];

            LocalDate fecha = convertirFecha(partes[2]);
            LocalTime hora = convertirHora(partes[3]);

            Long usuarioId = request.getUsuarioId();
            Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            if (usuario.getRol() != Rol.PACIENTE) {
                return new ChatResponse(
                    "Solo los pacientes pueden agendar citas desde el chatbot. Como profesional, usa el módulo de gestión de citas."
                );
            }

            Especialidad especialidad = especialidadRepository
                .findAll()
                .stream()
                .filter(e ->
                    e.getNombre()
                        .toLowerCase()
                        .contains(nombreEspecialidad.toLowerCase())
                )
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Especialidad no encontrada"));

            ProfesionalSalud profesional = profesionalSaludRepository
                .findAll()
                .stream()
                .filter(p -> p.getEspecialidad().getId().equals(especialidad.getId()))
                .filter(p -> Boolean.TRUE.equals(p.getDisponible()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No hay profesional disponible para esa especialidad"));

            Cita cita = citaService.crear(
                usuarioId,
                especialidad.getId(),
                profesional.getId(),
                fecha,
                hora,
                "Agendada desde chatbot",
                "Cita creada automáticamente por el asistente"
            );

            return new ChatResponse(
                "Tu cita fue agendada correctamente para " +
                especialidad.getNombre() +
                " el " + fecha +
                " a las " + hora +
                "."
            );

        } catch (Exception e) {
            return new ChatResponse("No pude agendar la cita: " + e.getMessage());
        }
    }

    private String normalizarMensajeAgenda(String mensaje) {
        return mensaje
                .toLowerCase()
                .replace("quiero una cita con", "agendar")
                .replace("quiero agendar con", "agendar")
                .replace("quiero agendar", "agendar")
                .replace("necesito una cita con", "agendar")
                .replace("necesito agendar con", "agendar")
                .replace("necesito agendar", "agendar")
                .replace("con", "")
                .replace("para el", "")
                .replace("para", "")
                .replace("a las", "")
                .replace("a la", "")
                .replaceAll("\\s+", " ")
                .trim();
    }
    private LocalDate convertirFecha(String fechaTexto) {
        fechaTexto = fechaTexto.toLowerCase();

        if (fechaTexto.equals("hoy")) {
            return LocalDate.now();
        }

        if (fechaTexto.equals("mañana") || fechaTexto.equals("manana")) {
            return LocalDate.now().plusDays(1);
        }

        if (fechaTexto.matches("\\d{2}/\\d{2}/\\d{4}")) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            return LocalDate.parse(fechaTexto, formatter);
        }

        if (fechaTexto.matches("\\d{2}-\\d{2}-\\d{4}")) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            return LocalDate.parse(fechaTexto, formatter);
        }

        return LocalDate.parse(fechaTexto);
    }

    private LocalTime convertirHora(String horaTexto) {
        if (horaTexto.matches("\\d{1,2}")) {
            return LocalTime.parse(horaTexto + ":00");
        }

        return LocalTime.parse(horaTexto);
    }
}