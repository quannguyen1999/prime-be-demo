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

import static com.prime.constants.PathApi.USER_LIST_USER_NAME;

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

    /**
     * Response: UUID of Id User, username of User
     */
    @PostMapping(value = USER_LIST_USER_NAME)
    public ResponseEntity<Map<UUID, String>> getListUserNames(@RequestBody List<UUID> uuids) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.getListUserNames(uuids));
    }

}
