package com.prime.feignClient.fallBack;

import com.prime.feignClient.UserServiceClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class UserFallback implements UserServiceClient {
    @Override
    public void sendMail() {
        log.info("error working email");
//        throw new InternerServerException(MessageErrors.SERVER_ACCOUNT_UNAVAILABLE.toString());
    }

}
