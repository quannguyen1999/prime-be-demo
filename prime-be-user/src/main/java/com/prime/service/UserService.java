package com.prime.service;

import com.prime.models.request.UserRequest;
import com.prime.models.response.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse createUser(UserRequest userRequest);

    List<UserResponse> listUser(Integer page, Integer size);

}
