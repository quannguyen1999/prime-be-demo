package com.prime.controllers;

import com.prime.constants.PathApi;
import com.prime.models.request.UserRequest;
import com.prime.models.response.UserResponse;
import com.prime.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = PathApi.USER)
@AllArgsConstructor
public class UserController {
    private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();

    private final AuthenticationSuccessHandler authenticationSuccessHandler;

    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody UserRequest userRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(userRequest));
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getListUser(@RequestParam Integer page, @RequestParam Integer size) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.listUser(page, size));
    }

}
