package com.prime.models.request;

import com.prime.constants.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserRequest {

    private String username;

    private String email;

    private String password;

    private UserRole role;

}
