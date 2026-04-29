package com.example.MediFlow.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.MediFlow.model.Comuna;
import com.example.MediFlow.repository.ComunaRepository;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/comunas")
@RequiredArgsConstructor
public class ComunaController {

    private final ComunaRepository comunaRepository;

    @GetMapping("/region/{regionId}")
    public List<Comuna> porRegion(@PathVariable Long regionId) {
        return comunaRepository.findByRegionId(regionId);
    }
}

