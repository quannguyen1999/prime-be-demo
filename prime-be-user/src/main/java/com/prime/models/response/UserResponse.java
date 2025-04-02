package com.prime.models.response;

import com.prime.constants.UserRole;
import lombok.Data;

import java.util.UUID;

@Data
public class UserResponse extends CommonBaseResponse {

    private UUID id;

    private String username;

    private String email;

    private UserRole role;

}
