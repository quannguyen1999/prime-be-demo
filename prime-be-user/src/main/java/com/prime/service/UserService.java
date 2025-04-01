package com.prime.service;

import com.prime.models.request.UserRequest;
import com.prime.models.response.UserResponse;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface UserService {

    UserResponse createUser(UserRequest userRequest);

    List<UserResponse> listUser(Integer page, Integer size);

    UserResponse updateUser(UserRequest userRequest);

    Map<UUID, String> getListUserNames(List<UUID> uuids);

}
