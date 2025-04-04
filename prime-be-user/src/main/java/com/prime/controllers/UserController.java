package com.prime.controllers;

import com.prime.constants.PathApi;
import com.prime.models.request.CommonPageInfo;
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

    /**
     * Creates a new user.
     * @param userRequest The user details to create.
     * @return A response entity containing the created user details.
     */
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody UserRequest userRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(userRequest));
    }

    /**
     * Retrieves a list of users with pagination.
     * @param page The page number.
     * @param size The number of items per page.
     * @param username The username to filter the list.
     * @return A response entity containing the list of users.
     */
    @GetMapping
    public ResponseEntity<CommonPageInfo<UserResponse>> getListUser(@RequestParam Integer page, @RequestParam Integer size, String username) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.listUser(page, size, username));
    }

    /**
     * Updates a user.
     * @param userRequest The user details to update.
     * @return A response entity containing the updated user details.
     */
    @PutMapping
    public ResponseEntity<UserResponse> updateUser(@RequestBody UserRequest userRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.updateUser(userRequest));
    }

    /**
     * Retrieves a list of user names by their UUIDs.
     * @param uuids The list of UUIDs of the users to retrieve.
     * @return A response entity containing a map of UUIDs and their corresponding usernames.
     */
    @PostMapping(value = LIST_USER_NAME)
    public ResponseEntity<Map<UUID, String>> getListUserNames(@RequestBody List<UUID> uuids) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.getListUserNames(uuids));
    }

    /**
     * Finds a user by their username.
     * @param username The username of the user to find.
     * @return A response entity containing the user details.
     */
    @GetMapping(value = FIND_USER_NAME)
    public ResponseEntity<UserResponse> findUserByUsername(@RequestParam String username) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.findUserByUsername(username));
    }

}
