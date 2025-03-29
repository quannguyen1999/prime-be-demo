package com.prime.feignClient;

import com.prime.feignClient.fallBack.UserFallback;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "user", url = "${custom.user.url}", fallback = UserFallback.class)
public interface UserServiceClient {

    @GetMapping(value = "/email")
    void sendMail();

}
