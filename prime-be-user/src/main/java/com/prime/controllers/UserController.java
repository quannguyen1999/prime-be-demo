package com.prime.controllers;

import com.prime.constants.PathApi;
import com.prime.models.request.UserRequest;
import com.prime.models.response.UserResponse;
import com.prime.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static com.prime.constants.PathApi.FIND_USER_NAME;
import static com.prime.constants.PathApi.LIST_USER_NAME;

@RestController
@RequestMapping(value = PathApi.USER)
@AllArgsConstructor
public class UserController {
    
    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody UserRequest userRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(userRequest));
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getListUser(@RequestParam Integer page, @RequestParam Integer size) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.listUser(page, size));
    }

    @PutMapping
    public ResponseEntity<UserResponse> updateUser(@RequestBody UserRequest userRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.updateUser(userRequest));
    }

    /**
     * Response: UUID of Id User, username of User
     */
    @PostMapping(value = LIST_USER_NAME)
    public ResponseEntity<Map<UUID, String>> getListUserNames(@RequestBody List<UUID> uuids) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.getListUserNames(uuids));
    }


    @GetMapping(value = FIND_USER_NAME)
    public ResponseEntity<UserResponse> findUserByUsername(@RequestParam String username) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.findUserByUsername(username));
    }

}
