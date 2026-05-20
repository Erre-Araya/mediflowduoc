package com.example.MediFlow.service;

import com.example.MediFlow.dto.ChatRequest;
import com.example.MediFlow.model.Especialidad;
import com.example.MediFlow.model.ProfesionalSalud;
import com.example.MediFlow.repository.EspecialidadRepository;
import com.example.MediFlow.repository.ProfesionalSaludRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

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
}