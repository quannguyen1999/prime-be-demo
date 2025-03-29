package com.prime.models.response;

import com.prime.constants.UserRole;
import lombok.Data;

@Data
public class UserResponse {

    private String username;

    private String email;

    private UserRole role;

}
