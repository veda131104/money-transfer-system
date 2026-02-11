package com.company.mts.dto;

public class AuthResponse {
    private String name;

    public AuthResponse(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
