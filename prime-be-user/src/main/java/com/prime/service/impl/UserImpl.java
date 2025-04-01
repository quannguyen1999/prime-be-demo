package com.prime.service.impl;

import com.prime.constants.UserRole;
import com.prime.entities.User;
import com.prime.models.request.UserRequest;
import com.prime.models.response.UserResponse;
import com.prime.repositories.UserRepository;
import com.prime.service.UserService;
import com.prime.utils.SecurityUtil;
import com.prime.validators.UserValidator;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Map;
import java.util.UUID;
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
        userRequest.setRole(UserRole.USER);
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

    @Override
    public UserResponse updateUser(UserRequest userRequest) {
        //Validate list user
        userValidator.validateUpdate(userRequest);

        User user = userRepository.findById(SecurityUtil.getIDUser()).get();
        if (StringUtils.hasLength(userRequest.getEmail())) {
            user.setEmail(userRequest.getEmail());
        }
        if (!ObjectUtils.isEmpty(userRequest.getRole())) {
            user.setRole(userRequest.getRole());
        }

        user = userRepository.save(user);
        return MAPPER.userToUserResponse(user);
    }

    @Override
    public Map<UUID, String> getListUserNames(List<UUID> uuids) {
        List<Object[]> results = userRepository.findUserIdAndUsernameByIds(uuids);
        return results.stream()
                .collect(Collectors.toMap(
                        row -> (UUID) row[0],  // Convert first column to UUID
                        row -> (String) row[1] // Convert second column to String
                ));
    }

    @Override
    public UserResponse findUserByUsername(String username) {
        User user = userRepository.findUserByUsername(username);
        return ObjectUtils.isEmpty(user) ? null : MAPPER.userToUserResponse(user);
    }
}
