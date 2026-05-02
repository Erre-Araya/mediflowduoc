package com.example.MediFlow.config;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.MediFlow.model.Comuna;
import com.example.MediFlow.model.Region;
import com.example.MediFlow.model.Usuario;
import com.example.MediFlow.model.enums.Rol;
import com.example.MediFlow.repository.ComunaRepository;
import com.example.MediFlow.repository.RegionRepository;
import com.example.MediFlow.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner{
    private final RegionRepository regionRepository;
    private final ComunaRepository comunaRepository;
    private final UsuarioRepository usuarioRepository;



    @Override
    public void run(String... args) {
        log.info("Verificando datos iniciales...");
        seedRegionesYComunas();
        seedAdmin();
        log.info("Datos iniciales verificados correctamente");
    }

    /**
     * Crea regiones y comunas de Chile si no existen.
     */
    private void seedRegionesYComunas() {
        if (regionRepository.count() == 0) {
            log.info("Creando regiones y comunas de Chile...");

            // Mapa de regiones con sus comunas
            Map<String, List<String>> regionesComunas = new LinkedHashMap<>();

            regionesComunas.put("Arica y Parinacota", Arrays.asList(
                "Arica", "Camarones", "General Lagos", "Putre"
            ));

            regionesComunas.put("Tarapaca", Arrays.asList(
                "Alto Hospicio", "Camina", "Colchane", "Huara", "Iquique", "Pica", "Pozo Almonte"
            ));

            regionesComunas.put("Antofagasta", Arrays.asList(
                "Antofagasta", "Calama", "Maria Elena", "Mejillones", "Olague", 
                "San Pedro de Atacama", "Sierra Gorda", "Taltal", "Tocopilla"
            ));

            regionesComunas.put("Atacama", Arrays.asList(
                "Alto del Carmen", "Caldera", "Chanaral", "Copiapo", "Diego de Almagro", 
                "Freirina", "Huasco", "Tierra Amarilla", "Vallenar"
            ));

            regionesComunas.put("Coquimbo", Arrays.asList(
                "Andacollo", "Canela", "Combarbala", "Coquimbo", "Illapel", "La Higuera", 
                "La Serena", "Los Vilos", "Monte Patria", "Ovalle", "Paihuano", 
                "Punitaqui", "Rio Hurtado", "Salamanca", "Vicuna"
            ));

            regionesComunas.put("Valparaiso", Arrays.asList(
                "Algarrobo", "Cabildo", "Calera", "Calle Larga", "Cartagena", "Casablanca", 
                "Catemu", "Concon", "El Quisco", "El Tabo", "Hijuelas", "Isla de Pascua", 
                "Juan Fernandez", "La Cruz", "La Ligua", "Limache", "Llaillay", "Los Andes", 
                "Nogales", "Olmue", "Panquehue", "Papudo", "Petorca", "Puchuncavi", "Putaendo", 
                "Quillota", "Quilpue", "Quintero", "Rinconada", "San Antonio", "San Esteban", 
                "San Felipe", "Santa Maria", "Santo Domingo", "Valparaiso", "Villa Alemana", 
                "Vina del Mar", "Zapallar"
            ));

            regionesComunas.put("Metropolitana", Arrays.asList(
                "Alhue", "Buin", "Calera de Tango", "Cerrillos", "Cerro Navia", "Colina", 
                "Conchali", "Curacavi", "El Bosque", "El Monte", "Estacion Central", 
                "Huechuraba", "Independencia", "Isla de Maipo", "La Cisterna", "La Florida", 
                "La Granja", "La Pintana", "La Reina", "Lampa", "Las Condes", "Lo Barnechea", 
                "Lo Espejo", "Lo Prado", "Macul", "Maipu", "Maria Pinto", "Melipilla", "Nunoa", 
                "Padre Hurtado", "Paine", "Pedro Aguirre Cerda", "Penalolen", "Penaflor", 
                "Pirque", "Providencia", "Pudahuel", "Puente Alto", "Quilicura", "Quinta Normal", 
                "Recoleta", "Renca", "San Bernardo", "San Joaquin", "San Jose de Maipo", 
                "San Miguel", "San Pedro", "San Ramon", "Santiago", "Talagante", "Tiltil", "Vitacura"
            ));

            regionesComunas.put("O'Higgins", Arrays.asList(
                "Chimbarongo", "Chepica", "Codegua", "Coinco", "Coltauco", "Donihue", "Graneros", 
                "La Estrella", "Las Cabras", "Litueche", "Lolol", "Machali", "Malloa", "Marchigue", 
                "Mostazal", "Nancagua", "Navidad", "Olivar", "Palmilla", "Paredones", "Peralillo", 
                "Peumo", "Pichidegua", "Pichilemu", "Placilla", "Pumanque", "Quinta de Tilcoco", 
                "Rancagua", "Rengo", "Requinoa", "San Fernando", "San Vicente", "Santa Cruz"
            ));

            regionesComunas.put("Maule", Arrays.asList(
                "Cauquenes", "Chanco", "Colbun", "Constitucion", "Curepto", "Curico", "Empedrado", 
                "Hualane", "Licanten", "Linares", "Longavi", "Maule", "Molina", "Parral", "Pelarco", 
                "Pelluhue", "Pencahue", "Rauco", "Retiro", "Rio Claro", "Romeral", "Sagrada Familia", 
                "San Clemente", "San Javier", "San Rafael", "Talca", "Teno", "Vichuquen", 
                "Villa Alegre", "Yerbas Buenas"
            ));

            regionesComunas.put("Nuble", Arrays.asList(
                "Bulnes", "Chillan", "Chillan Viejo", "Cobquecura", "Coelemu", "Coihueco", 
                "El Carmen", "Ninhue", "Niquen", "Pemuco", "Pinto", "Portezuelo", "Quillon", 
                "Quirihue", "Ranquil", "San Carlos", "San Fabian", "San Ignacio", "San Nicolas", 
                "Treguaco", "Yungay"
            ));

            regionesComunas.put("Biobio", Arrays.asList(
                "Alto Biobio", "Antuco", "Arauco", "Cabrero", "Canete", "Chiguayante", "Concepcion", 
                "Contulmo", "Coronel", "Curanilahue", "Florida", "Hualpen", "Hualqui", "Laja", 
                "Lebu", "Los Alamos", "Los Angeles", "Lota", "Mulchen", "Nacimiento", "Negrete", 
                "Penco", "Quilaco", "Quilleco", "San Pedro de la Paz", "San Rosendo", 
                "Santa Barbara", "Santa Juana", "Talcahuano", "Tirua", "Tome", "Tucapel", "Yumbel"
            ));

            regionesComunas.put("Araucania", Arrays.asList(
                "Angol", "Carahue", "Cholchol", "Collipulli", "Cunco", "Curacautin", "Curarrehue", 
                "Ercilla", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Lonquimay", 
                "Los Sauces", "Lumaco", "Melipeuco", "Nueva Imperial", "Padre Las Casas", 
                "Perquenco", "Pitrufquen", "Pucon", "Puren", "Renaico", "Saavedra", "Temuco", 
                "Teodoro Schmidt", "Tolten", "Traiguen", "Victoria", "Vilcun", "Villarrica"
            ));

            regionesComunas.put("Los Rios", Arrays.asList(
                "Corral", "Futrono", "La Union", "Lago Ranco", "Lanco", "Los Lagos", "Mafil", 
                "Mariquina", "Paillaco", "Panguipulli", "Rio Bueno", "Valdivia"
            ));

            regionesComunas.put("Los Lagos", Arrays.asList(
                "Ancud", "Calbuco", "Castro", "Chaiten", "Chonchi", "Cochamo", "Curaco de Velez", 
                "Dalcahue", "Fresia", "Frutillar", "Futaleufu", "Hualaihue", "Llanquihue", 
                "Los Muermos", "Maullin", "Osorno", "Palena", "Puerto Montt", "Puerto Octay", 
                "Puerto Varas", "Puqueldon", "Purranque", "Puyehue", "Queilen", "Quellon", 
                "Quemchi", "Quinchao", "Rio Negro", "San Juan de la Costa", "San Pablo"
            ));

            regionesComunas.put("Aysen", Arrays.asList(
                "Aysen", "Chile Chico", "Cisnes", "Cochrane", "Coyhaique", "Guaitecas", 
                "Lago Verde", "O'Higgins", "Rio Ibanez", "Tortel"
            ));

            regionesComunas.put("Magallanes", Arrays.asList(
                "Antartica", "Cabo de Hornos", "Laguna Blanca", "Natales", "Porvenir", 
                "Primavera", "Punta Arenas", "Rio Verde", "San Gregorio", "Timaukel", 
                "Torres del Paine"
            ));

            int totalComunas = 0;
            int regionCount = 0;

            for (Map.Entry<String, List<String>> entry : regionesComunas.entrySet()) {
                regionCount++;
                String codigoRegion = String.format("%02d", regionCount);
                
                Region region = Region.builder()
                        .nombre(entry.getKey())
                        .codigo(codigoRegion)
                        .build();
                
                Region regionGuardada = regionRepository.save(region);

                for (String nombreComuna : entry.getValue()) {
                    Comuna comuna = Comuna.builder()
                            .nombre(nombreComuna)
                            .region(regionGuardada)
                            .build();
                    comunaRepository.save(comuna);
                    totalComunas++;
                }
            }

            log.info("- {} regiones creadas", regionCount);
            log.info("- {} comunas creadas", totalComunas);
        }
    }

    private void seedAdmin() {
    if (!usuarioRepository.existsByCorreo("admin@mediflow.cl")) {
        Usuario admin = Usuario.builder()
                .nombres("Admin")
                .apellidos("MediFlow")
                .correo("admin@mediflow.cl")
                .password("admin123")
                .rol(Rol.ADMIN)
                .activo(true)
                .build();

        usuarioRepository.save(admin);
        log.info("Usuario ADMIN creado");
    }
}
}
