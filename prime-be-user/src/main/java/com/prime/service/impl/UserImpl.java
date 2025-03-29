package com.prime.service.impl;

import com.prime.entities.User;
import com.prime.models.request.UserRequest;
import com.prime.models.response.UserResponse;
import com.prime.repositories.UserRepository;
import com.prime.service.UserService;
import com.prime.validators.UserValidator;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static com.prime.mappers.UserMapper.MAPPER;

@AllArgsConstructor
@Service
public class UserImpl implements UserService {

    private final UserRepository userRepository;

    private final UserValidator userValidator;

    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse createUser(UserRequest userRequest) {
        //Validate create user
        userValidator.validateCreate(userRequest);
        userRequest.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        User user = userRepository.save(MAPPER.userRequestToUser(userRequest));
        return MAPPER.userToUserResponse(user);
    }

    @Override
    public List<UserResponse> listUser(Integer page, Integer size) {
        //Validate list user
        userValidator.validateGetList(page, size);

        return userRepository.findAll(PageRequest.of(page, size))
                .stream()
                .map(MAPPER::userToUserResponse)
                .collect(Collectors.toList());
    }
}
