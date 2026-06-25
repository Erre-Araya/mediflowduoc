package com.example.MediFlow.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.example.MediFlow.dto.SignalMessage;

@Controller
public class VideoCallController {

    @MessageMapping("/video/send")
    @SendTo("/topic/video")
    public SignalMessage sendSignal(@Payload SignalMessage message) {

        System.out.println("MENSAJE RECIBIDO: " + message.getType());

        return message;
    }
}