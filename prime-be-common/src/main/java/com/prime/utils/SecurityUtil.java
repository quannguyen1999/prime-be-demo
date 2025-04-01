package com.prime.utils;

import com.prime.constants.MessageErrors;
import com.prime.constants.UserRole;
import com.prime.exceptions.UnauthorizedRequestException;
import lombok.experimental.UtilityClass;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.util.ObjectUtils;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@UtilityClass
public class SecurityUtil {

    public Object getPrincipal() {
        return SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public Object getDetails() {
        return SecurityContextHolder.getContext().getAuthentication().getDetails();
    }

    public Object getCredentials() {
        return SecurityContextHolder.getContext().getAuthentication().getCredentials();
    }

    public UUID getIDUser() {
        return UUID.fromString(Objects.requireNonNull(getValueByKey("id")));
    }

    public String getUserName() {
        return getValueByKey("user");
    }

    public Boolean isAdmin() {
        return getAuthorities().parallelStream().anyMatch(t -> UserRole.ADMIN.toString().equalsIgnoreCase(t));
    }

    public List<String> getAuthorities() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof JwtAuthenticationToken jwtAuthToken) {
            Object value = jwtAuthToken.getTokenAttributes().get("authorities");

            // Ensure value is not null and is an instance of List
            if (value instanceof List<?> list) {
                return list.stream().map(Object::toString).toList();
            }
        }

        throw new UnauthorizedRequestException(MessageErrors.UNAUTHORIZED);
    }

    private String getValueByKey(String key) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof JwtAuthenticationToken jwtAuthToken) {
            Object value = jwtAuthToken.getTokenAttributes().get(key);
            return !ObjectUtils.isEmpty(value) ? value.toString() : null;
        }

        throw new UnauthorizedRequestException(MessageErrors.UNAUTHORIZED);
    }


}
