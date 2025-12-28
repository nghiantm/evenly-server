package com.evenly.controller;

import com.evenly.Utility.SecurityUtility;
import com.evenly.dto.UserProfileDTO;
import com.evenly.entity.UserInfo;
import com.evenly.exception.MissingTokenException;
import com.evenly.service.JwtService;
import com.evenly.service.UserInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserInfoService userInfoService;

    @Autowired
    private JwtService jwtService;

    /*
    @GetMapping
    public ResponseEntity<UserProfileDTO> getProfile(@RequestHeader("Authorization") String authorizationHeader) {
        UserInfo userInfo = userInfoService.getProfile(jwtService.extractUsername(authorizationHeader.substring(7)));
        UserProfileDTO userProfileDTO = new UserProfileDTO();
        userProfileDTO.setName(userInfo.getName());
        userProfileDTO.setEmail(userInfo.getEmail());
        userProfileDTO.setRoles(userInfo.getRoles());
        userProfileDTO.setImageUrl(userInfo.getImageUrl());

        return ResponseEntity.ok(userProfileDTO);
    }

     */

    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> test() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "good");
        response.put("status", "success");

        return ResponseEntity.ok(response);
    }
}
