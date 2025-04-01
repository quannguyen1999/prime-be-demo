package com.prime.models.response;

import lombok.Data;

import java.util.UUID;

@Data
public class UserProfileResponse {
    private UUID id;

    private String username;
}
