package com.nghia.evenlyserver.controllers;

import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nghia.evenlyserver.domain.User;
import com.nghia.evenlyserver.services.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class InitController {

    private final UserService userService;

    @GetMapping("/init")
    public Map<String, Object> me(@AuthenticationPrincipal Jwt jwt) {
        User user = userService.ensureUserExists(jwt);

        return Map.of(
                "userId", user.getId(),
                "sub", jwt.getSubject(),
                "email", user.getEmail(),
                "displayName", user.getDisplayName()
        );
    }
}
