package com.prime.validators;

import com.prime.models.request.UserRequest;
import com.prime.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;

import static com.prime.constants.MessageErrors.*;

@AllArgsConstructor
@Component
public class UserValidator extends  CommonValidator{

    private static final Integer NAME_SIZE = 5;

    private final UserRepository userRepository;

    public void validateCreate(UserRequest userRequest) {
        checkEmpty().accept(userRequest, USER_INVALID);
        validateCheckUserName(userRequest.getUsername());
        validateCheckPassword(userRequest.getPassword());
        validateCheckEmail(userRequest.getEmail());
    }

    private void validateCheckUserName(String name) {
        checkEmpty().accept(name, USER_NAME_INVALID);
        checkCondition().accept(name.length() < NAME_SIZE, USER_NAME_INVALID);
        checkCondition().accept(!ObjectUtils.isEmpty(userRepository.findByUsername(name)), USER_NAME_EXISTS);
    }

    private void validateCheckEmail(String email) {
        checkEmpty().accept(email, USER_EMAIL_INVALID);
        checkCondition().accept(!ObjectUtils.isEmpty(userRepository.findByEmail(email)), USER_EMAIL_EXISTS);
    }

    private void validateCheckPassword(String password) {
        checkEmpty().accept(password, USER_PASSWORD_INVALID);
        checkCondition().accept(!password.matches(PASSWORD_REGEX), USER_PASSWORD_INVALID);
    }


}
