package com.prime.config;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import com.prime.config.grantpassword.CustomPassordAuthenticationConverter;
import com.prime.config.grantpassword.CustomPassordAuthenticationProvider;
import com.prime.models.request.CustomPasswordUser;
import com.prime.repositories.UserRepository;
import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.http.HttpSessionListener;
import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.encrypt.AesBytesEncryptor;
import org.springframework.security.crypto.encrypt.BytesEncryptor;
import org.springframework.security.crypto.keygen.BytesKeyGenerator;
import org.springframework.security.crypto.keygen.KeyGenerators;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.OAuth2Token;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.authorization.InMemoryOAuth2AuthorizationService;
import org.springframework.security.oauth2.server.authorization.OAuth2AuthorizationService;
import org.springframework.security.oauth2.server.authorization.OAuth2TokenType;
import org.springframework.security.oauth2.server.authorization.config.annotation.web.configuration.OAuth2AuthorizationServerConfiguration;
import org.springframework.security.oauth2.server.authorization.config.annotation.web.configurers.OAuth2AuthorizationServerConfigurer;
import org.springframework.security.oauth2.server.authorization.settings.AuthorizationServerSettings;
import org.springframework.security.oauth2.server.authorization.settings.ClientSettings;
import org.springframework.security.oauth2.server.authorization.settings.OAuth2TokenFormat;
import org.springframework.security.oauth2.server.authorization.settings.TokenSettings;
import org.springframework.security.oauth2.server.authorization.token.*;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.util.ObjectUtils;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

import static com.prime.constants.PathApi.*;
import static com.prime.constants.UserRole.ADMIN;
import static com.prime.constants.UserRole.USER;
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
public class SecurityConfig {

    //  Allowed endpoints for public access (Swagger, OAuth2, Registration, etc.)
    private static final List<String> ALLOW_REQUEST = Arrays.asList(
            "/v3/api-docs/**",  // OpenAPI docs
            "/swagger-ui/**",   // Swagger UI
            "/swagger-ui.html", // Swagger UI main page
            "/webjars/**",      // WebJars for Swagger
            "/oauth2/token",    // OAuth2 Token Generation
            "/registration",    // User Registration Endpoint
            "/authenticator",   // Custom Authentication
            "/actuator/**" // Actuator
    );

    @Value("${custom-security.issuer}")  // OAuth2 Issuer URL (Defined in application.yml)
    private String issuer;

    @Autowired
    private UserRepository userRepository;

    /**
     * Security Filter Chain for OAuth2 Authorization Server
     * - Handles token generation, authentication, and authorization
     */
    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    SecurityFilterChain asSecurityFilterChain(HttpSecurity http) throws Exception {
        //CLone from OAuth2AuthorizationServerConfigurer.applyDefaultSecurity(http)
        OAuth2AuthorizationServerConfigurer authorizationServerConfigurer = new OAuth2AuthorizationServerConfigurer();
        RequestMatcher endpointsMatcher = authorizationServerConfigurer.getEndpointsMatcher();

        http.securityMatcher(endpointsMatcher)
                .authorizeHttpRequests(authorize ->
                        authorize
                                //.requestMatchers(ALLOW_REQUEST.toArray(new String[0])).permitAll()
                                .anyRequest().authenticated()
                )
                .csrf(csrf -> csrf.ignoringRequestMatchers(endpointsMatcher))
                .apply(authorizationServerConfigurer);

        return http
                .csrf(AbstractHttpConfigurer::disable)
                .getConfigurer(OAuth2AuthorizationServerConfigurer.class)
                .tokenEndpoint(tokenEndpoint -> tokenEndpoint
                        .accessTokenRequestConverter(new CustomPassordAuthenticationConverter())
                        .authenticationProvider(new CustomPassordAuthenticationProvider(authorizationService(),
                                tokenGenerator(), userRepository, passwordEncoder(), tokenCustomizer()))
                )
                .oidc(withDefaults())
                .and()
                .oauth2ResourceServer((resourceServer) -> resourceServer.jwt(withDefaults()))
                .build();
    }

    public static final String JWT_ROLE_NAME = "authorities"; // Defines the JWT claim name for roles


    @Order(2)
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtDecoder jwtDecoder) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(ALLOW_REQUEST.toArray(new String[0])).permitAll()
                        .requestMatchers(PROJECT.concat(FULL_PATH)).hasAuthority(ADMIN.toString())
                        .requestMatchers(TASK.concat(FULL_PATH)).hasAnyAuthority(ADMIN.toString(), USER.toString())
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .decoder(jwtDecoder)
                                .jwtAuthenticationConverter(jwtAuthenticationConverter())
                        )
                )
                .csrf(AbstractHttpConfigurer::disable)
                .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable));

        return http.build();
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

    @Bean
    public OAuth2AuthorizationService authorizationService() {
        return new InMemoryOAuth2AuthorizationService();
    }

    @Bean
    public JwtDecoder jwtDecoder(JWKSource<SecurityContext> jwkSource) {
        return OAuth2AuthorizationServerConfiguration.jwtDecoder(jwkSource);
    }

    @Bean
    public JWKSource<SecurityContext> jwkSource() {
        RSAKey rsaKey = generateRsa();
        JWKSet jwkSet = new JWKSet(rsaKey);
        return (jwkSelector, securityContext) -> jwkSelector.select(jwkSet);
    }

    private static RSAKey generateRsa() {
        KeyPair keyPair = generateRsaKey();
        RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
        RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();
        return new RSAKey.Builder(publicKey)
                .privateKey(privateKey)
                .keyID(UUID.randomUUID().toString())
                .build();
    }

    static KeyPair generateRsaKey() {
        KeyPair keyPair;
        try {
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(2048);
            keyPair = keyPairGenerator.generateKeyPair();
        } catch (Exception ex) {
            throw new IllegalStateException(ex);
        }
        return keyPair;
    }

    @Bean
    public OAuth2TokenGenerator<? extends OAuth2Token> tokenGenerator() {
        NimbusJwtEncoder jwtEncoder = new NimbusJwtEncoder(jwkSource());
        JwtGenerator jwtGenerator = new JwtGenerator(jwtEncoder);
        jwtGenerator.setJwtCustomizer(tokenCustomizer());
        OAuth2AccessTokenGenerator accessTokenGenerator = new OAuth2AccessTokenGenerator();
        OAuth2RefreshTokenGenerator refreshTokenGenerator = new OAuth2RefreshTokenGenerator();
        return new DelegatingOAuth2TokenGenerator(
                jwtGenerator, accessTokenGenerator, refreshTokenGenerator);
    }

    @Bean
    public TokenSettings tokenSettings() {
        return TokenSettings.builder()
                .accessTokenFormat(OAuth2TokenFormat.SELF_CONTAINED)
                .accessTokenTimeToLive(Duration.ofDays(1))
                .build();
    }

    @Bean
    public ClientSettings clientSettings() {
        return ClientSettings.builder().build();
    }

    @Bean
    AuthenticationSuccessHandler authenticationSuccessHandler() {
        return new SavedRequestAwareAuthenticationSuccessHandler();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    BytesEncryptor bytesEncryptor(@Value("${jwt.secret.key}") String secret) {
        SecretKey secretKey = new SecretKeySpec(Base64.getDecoder().decode(secret.trim()), "AES");
        BytesKeyGenerator ivGenerator = KeyGenerators.secureRandom(12);
        return new AesBytesEncryptor(secretKey, ivGenerator, AesBytesEncryptor.CipherAlgorithm.GCM);
    }

    @Bean
    AuthorizationServerSettings authorizationServerSettings() {
        return AuthorizationServerSettings.builder()
                .issuer(issuer)
                .authorizationEndpoint(AUTHORIZE_PATH)
                .tokenEndpoint("/oauth2/token")
                .tokenIntrospectionEndpoint("/oauth2/introspect")
                .tokenRevocationEndpoint("/oauth2/revoke")
                .jwkSetEndpoint("/oauth2/jwks")
                .oidcUserInfoEndpoint("/userinfo")
                .build();
    }

    @Bean
    OAuth2TokenCustomizer<JwtEncodingContext> tokenCustomizer() {
        return context -> {
            //Init
            Set<String> authorities;
            String username;

            Authentication principal = context.getPrincipal();
            CustomPasswordUser user = principal.getDetails() instanceof CustomPasswordUser ? (CustomPasswordUser) principal.getDetails() : null;
//            context.getClaims().claim("Test", "Test Access Token");

            if (OAuth2TokenType.ACCESS_TOKEN.equals(context.getTokenType()) && ObjectUtils.isEmpty(user)) {
                authorities = principal.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority).collect(Collectors.toSet());
                username = principal.getName();
            } else {
                authorities = user.authorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toSet());
                username = user.username();
            }
            context.getClaims().claim("authorities", authorities)
                    .claim("user", username)
                    .claim("id", user.id())
            ;
        };
    }

//    //Set CORS
//    @Bean
//    public CorsFilter corsFilter() {
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        CorsConfiguration config = new CorsConfiguration();
//
//        // Allow all origins, methods, and headers. This is just an example.
//        config.addAllowedOrigin("*");
//        config.addAllowedMethod("*");
//        config.addAllowedHeader("*");
//        source.registerCorsConfiguration("/**", config);
//        return new CorsFilter(source);
//    }


    //Set timeout session
    @Bean
    public HttpSessionListener httpSessionListener() {
        return new HttpSessionListener() {
            @Override
            public void sessionCreated(HttpSessionEvent event) {
                HttpSession session = event.getSession();
                // Set the session timeout to 30 seconds
                session.setMaxInactiveInterval(60);
            }

            @Override
            public void sessionDestroyed(HttpSessionEvent event) {
                // Handle session destroyed event if needed
                event.getSession().invalidate();
            }
        };
    }

}
