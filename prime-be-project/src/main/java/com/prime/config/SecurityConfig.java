package com.prime.config;

import com.prime.constants.PathApi;
import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

import java.util.Arrays;
import java.util.List;

import static com.prime.constants.UserRole.ADMIN;
import static com.prime.constants.UserRole.USER;

/**
 * Security configuration class for configuring Spring Security.
 * - Enables OAuth2 JWT-based authentication.
 * - Defines access control for different API endpoints.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    public static final String JWT_ROLE_NAME = "authorities";

    // List of public endpoints that don't require authentication
    private static final List<String> ALLOW_REQUEST = Arrays.asList(
            "/v3/api-docs/**",  // OpenAPI docs
            "/swagger-ui/**",   // Swagger UI
            "/swagger-ui.html", // Swagger UI main page
            "/webjars/**",       // WebJars for Swagger dependencies
            "/ws/**"            // WebSocket endpoints
    );

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    String issuerUri;

    /**
     * Configures security settings for the application.
     * - Defines endpoint access permissions.
     * - Enables OAuth2 JWT authentication.
     * - Disables CSRF protection and frame options (useful for H2 Console or iframes).
     *
     * @param http HttpSecurity object to configure security.
     * @return Configured SecurityFilterChain.
     * @throws Exception in case of security configuration failure.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorize -> authorize
                        // Allow all requests to the specified public endpoints
                        .requestMatchers(ALLOW_REQUEST.toArray(new String[0])).permitAll()

                        // Project endpoints
                        .requestMatchers(PathApi.PROJECT).hasAnyAuthority(ADMIN.toString(), USER.toString()) // GET list projects
                        .requestMatchers(PathApi.PROJECT + PathApi.GET_PROJECT_BY_ID).hasAnyAuthority(ADMIN.toString(), USER.toString()) // GET project by ID
                        .requestMatchers(PathApi.PROJECT + PathApi.GET_PROJECT_STATISTICS).hasAuthority(ADMIN.toString()) // GET project statistics
                        .requestMatchers(PathApi.PROJECT + PathApi.GET_PROJECT_OVERALL).hasAuthority(ADMIN.toString()) // GET project overall
                        .requestMatchers(PathApi.PROJECT + "/**").hasAuthority(ADMIN.toString()) // All other project operations (create, update, delete)

                        // Task endpoints
                        .requestMatchers(PathApi.TASK + PathApi.FULL_PATH).hasAnyAuthority(ADMIN.toString(), USER.toString())

                        // All other requests require authentication
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .decoder(JwtDecoders.fromIssuerLocation(issuerUri))
                                .jwtAuthenticationConverter(jwtAuthenticationConverter())
                        )
                )
                .build();
    }

    /**
     * Provides a password encoder bean using BCrypt.
     *
     * @return BCryptPasswordEncoder instance.
     */
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Converts JWT claims to Spring Security authorities.
     *
     * @return Configured JwtAuthenticationConverter.
     */
    private JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthoritiesClaimName(JWT_ROLE_NAME); // Extracts roles from "authorities" claim
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix(Strings.EMPTY); // Removes default "ROLE_" prefix

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }
}
