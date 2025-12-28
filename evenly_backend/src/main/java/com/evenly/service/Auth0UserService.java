package com.evenly.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class Auth0UserService {

    @Value("${OAUTH_USERINFO_ENDPOINT}")
    private String userInfoEndpoint;

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> getUserInfo(String jwtToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", jwtToken);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        System.out.println(jwtToken);

        // Call Auth0 /userinfo endpoint
        ResponseEntity<Map> response = restTemplate.exchange(
                userInfoEndpoint,
                HttpMethod.GET,
                entity,
                Map.class
        );
        return response.getBody(); // Contains user profile (email, name, roles, etc.)
    }
}