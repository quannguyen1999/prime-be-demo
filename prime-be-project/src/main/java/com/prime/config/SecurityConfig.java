package com.prime.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

import java.util.Arrays;
import java.util.List;

import static com.prime.constants.AuthorityConstant.JWT_ROLE_NAME;
import static com.prime.constants.AuthorityConstant.ROLE_PREFIX;
import static com.prime.constants.PathApi.*;
import static com.prime.constants.UserRole.ADMIN;
import static com.prime.constants.UserRole.USER;

@Configuration
public class SecurityConfig {

    private static final List<String> ALLOW_REQUEST = Arrays.asList(
            "/v3/api-docs/**",  // OpenAPI docs
            "/swagger-ui/**",   // Swagger UI
            "/swagger-ui.html", // Swagger UI main page
            "/webjars/**"      // WebJars for Swagger
    );

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    String issuerUri;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(ALLOW_REQUEST.toArray(new String[0])).permitAll()
                        .requestMatchers(PROJECT.concat(FULL_PATH)).hasAuthority(ADMIN.toString())
                        .requestMatchers(TASK.concat(FULL_PATH)).hasAnyAuthority(ADMIN.toString(), USER.toString())
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(
                        oauth2 -> oauth2
                                .jwt(jwt -> jwt
                                        .decoder(JwtDecoders.fromIssuerLocation(issuerUri))
                                        .jwtAuthenticationConverter(jwtAuthenticationConverter())
                                )
                )
                .csrf(AbstractHttpConfigurer::disable)
                .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable));

        return http.build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    private JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthoritiesClaimName(JWT_ROLE_NAME);
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix(ROLE_PREFIX);

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }

}
