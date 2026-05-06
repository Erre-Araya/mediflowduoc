package com.example.MediFlow.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.MediFlow.model.Region;
import com.example.MediFlow.repository.RegionRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/regiones")
@RequiredArgsConstructor
public class RegionController {

    private final RegionRepository regionRepository;

    @GetMapping
    public List<Region> listar() {
        return regionRepository.findAll();
    }
}
