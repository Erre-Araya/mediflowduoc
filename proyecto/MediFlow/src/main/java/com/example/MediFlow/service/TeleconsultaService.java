package com.example.MediFlow.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.MediFlow.model.Cita;
import com.example.MediFlow.model.Teleconsulta;
import com.example.MediFlow.repository.CitaRepository;
import com.example.MediFlow.repository.TeleconsultaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeleconsultaService {

    private final TeleconsultaRepository teleconsultaRepository;
    private final CitaRepository citaRepository;

    public List<Teleconsulta> obtenerTodas(){
        return teleconsultaRepository.findAll();
    }

    public Teleconsulta obtenerPorId(long id){
        return teleconsultaRepository.findById(id).orElseThrow(()-> new RuntimeException("Teleconsulta no econtrada"));
    }

    public Teleconsulta crear(Long citaId, LocalDateTime fechaIni, LocalDateTime fechaTermino){
        Cita cita = citaRepository.findById(citaId).orElseThrow(()-> new RuntimeException("Cita no eocntradoa"));

        if (teleconsultaRepository.existsByCita_Id(citaId)) {
            throw new RuntimeException("La cita ya tiene una consulta");
            
        }

        Teleconsulta teleconsulta = Teleconsulta.builder()
            .cita(cita)
            .fechaIni(fechaIni)
            .fechaTermino(fechaTermino)
            .build();
        
        return teleconsultaRepository.save(teleconsulta);
    }

    public Teleconsulta actualizar(Long id, LocalDateTime fechaIni, LocalDateTime fechaTermino){
        Teleconsulta teleconsulta = obtenerPorId(id);
        if (fechaIni != null) teleconsulta.setFechaIni(fechaIni);
        if(fechaTermino != null) teleconsulta.setFechaTermino(fechaTermino);
        return teleconsultaRepository.save(teleconsulta);
    }

    public void eliminar(Long id){
        if(!teleconsultaRepository.existsById(id)){ 
            throw new RuntimeException("No encontrada");
        }
        teleconsultaRepository.deleteById(id);
    }
}
