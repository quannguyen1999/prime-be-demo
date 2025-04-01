package com.prime.models.request;

import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.UUID;

public record CustomPasswordUser(String username, UUID id, Collection<GrantedAuthority> authorities) {

}
