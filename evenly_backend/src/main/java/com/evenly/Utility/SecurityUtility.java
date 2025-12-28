package com.evenly.Utility;

import com.evenly.exception.MissingTokenException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
public class SecurityUtility {

    @Value("${OAUTH_USERINFO_ENDPOINT}")
    private String userInfoEndpoint;

    public Map<String, Object> getUserInfo() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + getToken());
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        System.out.println(userInfoEndpoint);

        // Call Auth0 /userinfo endpoint
        ResponseEntity<Map> response = new RestTemplate().exchange(
                userInfoEndpoint,
                HttpMethod.GET,
                entity,
                Map.class
        );

        return response.getBody();

    }

    private String getToken() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new MissingTokenException("User is not authenticated");
        }

        Jwt jwt = ((JwtAuthenticationToken) auth).getToken();
        return jwt.getTokenValue(); // Raw JWT token string
    }
}
