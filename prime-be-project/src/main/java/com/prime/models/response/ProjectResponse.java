package com.prime.models.response;

import lombok.Data;

import java.util.UUID;

@Data
public class ProjectResponse extends CommonBaseResponse {
    private UUID id;

    private String name;

    private String description;

    private UUID ownerId;

    private String ownerUsername;
}
