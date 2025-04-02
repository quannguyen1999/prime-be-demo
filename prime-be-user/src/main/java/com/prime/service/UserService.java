package com.prime.service;

import com.prime.models.request.CommonPageInfo;
import com.prime.models.request.UserRequest;
import com.prime.models.response.UserResponse;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface UserService {

    UserResponse createUser(UserRequest userRequest);

    CommonPageInfo<UserResponse> listUser(Integer page, Integer size, String username);

    UserResponse updateUser(UserRequest userRequest);

    Map<UUID, String> getListUserNames(List<UUID> uuids);

    UserResponse findUserByUsername(String username);

}
