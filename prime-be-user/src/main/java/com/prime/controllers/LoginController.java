package com.prime.controllers;


import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;

import static com.prime.constants.PathApi.AUTHENTICATOR_PATH;
import static com.prime.constants.PathApi.REGISTRATION_PATH;

@AllArgsConstructor
@Controller
public class LoginController {
    private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();
    private final AuthenticationFailureHandler authenticatorFailureHandler =
            new SimpleUrlAuthenticationFailureHandler("/authenticator?error");

    private final AuthenticationSuccessHandler authenticationSuccessHandler;

    @PostMapping(REGISTRATION_PATH)
    public void validateRegistration(@RequestParam("code") String code,
                                     HttpServletRequest request,
                                     HttpServletResponse response,
                                     @CurrentSecurityContext SecurityContext context) throws ServletException, IOException {



            this.authenticationSuccessHandler.onAuthenticationSuccess(request, response, getAuthentication(request, response));

    }

    @GetMapping(AUTHENTICATOR_PATH)
    public String authenticator(
            @CurrentSecurityContext SecurityContext context) {
        return "authenticator";
    }

    @PostMapping(AUTHENTICATOR_PATH)
    public void validateCode(
            @RequestParam("code") String code,
            HttpServletRequest request,
            HttpServletResponse response,
            @CurrentSecurityContext SecurityContext context) throws ServletException, IOException {


            this.authenticationSuccessHandler.onAuthenticationSuccess(request, response, getAuthentication(request, response));
               }

    private Authentication getAuthentication(
            HttpServletRequest request,
            HttpServletResponse response) {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        securityContext.setAuthentication(securityContext.getAuthentication());
        SecurityContextHolder.setContext(securityContext);
        securityContextRepository.saveContext(securityContext, request, response);
        return securityContext.getAuthentication();
    }

//    private Account getUser(SecurityContext context) {
//        CustomUserDetails userDetails = (CustomUserDetails) context.getAuthentication().getPrincipal();
//        return userDetails.getUser();
//    }
}
