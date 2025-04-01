package com.prime.feignClient;

import com.prime.config.FeignClientConfig;
import com.prime.feignClient.fallBack.UserFallback;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@FeignClient(name = "prime-user-service", configuration = FeignClientConfig.class, fallback = UserFallback.class)
public interface UserServiceClient {

    @PostMapping(value = "/users/getListUserNames")
    Map<UUID, String> getUsernameUsers(List<UUID> listUserId);

}
