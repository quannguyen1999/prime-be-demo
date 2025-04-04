package com.prime.mappers;

import com.prime.entities.User;
import com.prime.models.request.UserRequest;
import com.prime.models.response.UserResponse;
import org.mapstruct.*;
import org.springframework.stereotype.Component;

@Component
@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface UserMapper extends CommonMapper {
    @Mapping(target = "id", source = "id")
    @Mapping(target = "username", source = "username")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "role", source = "role")
    UserResponse userToUserResponse(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "username", source = "username")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "password", source = "password")
    @Mapping(target = "role", source = "role")
    User userRequestToUser(UserRequest userRequest);
}
