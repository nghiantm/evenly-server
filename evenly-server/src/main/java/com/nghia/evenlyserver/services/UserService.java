package com.nghia.evenlyserver.services;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nghia.evenlyserver.domain.User;
import com.nghia.evenlyserver.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository users;

    @Transactional
    public User ensureUserExists(Jwt jwt) {
        String sub = jwt.getSubject();

        return users.findByIdpSubject(sub).orElseGet(() -> {
            User.UserBuilder builder = User.builder()
                    .idpSubject(sub)
                    .status("ACTIVE");

            String email = jwt.getClaimAsString("email");
            String name = jwt.getClaimAsString("name");
            Boolean emailVerified = jwt.getClaim("email_verified");

            builder.email(email);
            builder.displayName(name != null ? name : "User");
            builder.emailVerified(emailVerified != null && emailVerified);

            return users.save(builder.build());
        });
    }
}
