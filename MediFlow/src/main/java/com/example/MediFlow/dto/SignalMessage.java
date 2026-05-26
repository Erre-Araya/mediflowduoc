package com.example.MediFlow.dto;

public class SignalMessage {

    private String type;
    private Long from;
    private Long to;
    private Long citaId;
    private Object data;

    public SignalMessage() {
    }

    public SignalMessage(String type, Long from, Long to, Long citaId, Object data) {
        this.type = type;
        this.from = from;
        this.to = to;
        this.citaId = citaId;
        this.data = data;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getFrom() {
        return from;
    }

    public void setFrom(Long from) {
        this.from = from;
    }

    public Long getTo() {
        return to;
    }

    public void setTo(Long to) {
        this.to = to;
    }

    public Long getCitaId() {
        return citaId;
    }

    public void setCitaId(Long citaId) {
        this.citaId = citaId;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}