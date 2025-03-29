package com.prime.mappers;

import com.prime.entities.User;
import com.prime.models.request.UserRequest;
import com.prime.models.response.UserResponse;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface UserMapper extends CommonMapper {
    UserMapper MAPPER = Mappers.getMapper(UserMapper.class);

    UserResponse userToUserResponse(User user);

    User userRequestToUser(UserRequest userRequest);

}
