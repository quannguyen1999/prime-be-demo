package com.prime.feignClient.fallBack;

import com.prime.exceptions.BadRequestException;
import com.prime.feignClient.UserServiceClient;
import com.prime.models.response.UserResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static com.prime.constants.MessageErrors.USER_SERVER_ERROR;

@Component
@Slf4j
public class UserFallback implements UserServiceClient {
    @Override
    public Map<UUID, String> getUsernameUsers(List<UUID> listUserId) {
        throw new BadRequestException(USER_SERVER_ERROR);
    }

    @Override
    public UserResponse findUserByUsername(String username) {
        throw new BadRequestException(USER_SERVER_ERROR);
    }
}
