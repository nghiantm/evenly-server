package com.evenly.controller;

import com.evenly.dto.GroupCreateRequestDTO;
import com.evenly.dto.GroupCreateResponseDTO;
import com.evenly.dto.GroupsResponseDTO;
import com.evenly.entity.Group;
import com.evenly.exception.MissingArgumentException;
import com.evenly.service.Auth0UserService;
import com.evenly.service.GroupMemberService;
import com.evenly.service.GroupService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/group")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @Autowired
    private Auth0UserService auth0UserService;
    @Autowired
    private GroupMemberService groupMemberService;

    @PostMapping
    @Operation(
            summary = "Create a group for an user"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Group created successfully",
                    content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = GroupCreateResponseDTO.class))
                    }
            )
    })
    public ResponseEntity<GroupCreateResponseDTO> addGroup(@RequestBody GroupCreateRequestDTO group) {
        // Validate input
        if (group == null || !StringUtils.hasText(group.getCreatorId()) || !StringUtils.hasText(group.getName())) {
            throw new MissingArgumentException("Invalid group details provided.");
        }

        Group createdGroup = groupService.addGroup(group);
        GroupCreateResponseDTO responseDTO = new GroupCreateResponseDTO();
        responseDTO.setId(createdGroup.getId());
        responseDTO.setName(createdGroup.getName());
        responseDTO.setDescription(createdGroup.getDescription());
        responseDTO.setImageUrl(createdGroup.getImageUrl());
        responseDTO.setCreatedDate(createdGroup.getCreatedDate());
        responseDTO.setCreatorId(createdGroup.getCreatorId());

        return new ResponseEntity<>(
                responseDTO,
                HttpStatus.CREATED
        );
    }

    @DeleteMapping
    @Operation(
            summary = "Delete a group for an user"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Group deleted successfully"
            )
    })
    public ResponseEntity<String> deleteGroup(@RequestParam("groupId") String groupId) {
        return new ResponseEntity<>(
                groupService.deleteGroup(groupId),
                HttpStatus.OK
        );
    }

    @GetMapping
    public ResponseEntity<List<GroupsResponseDTO>> getGroups(@RequestHeader("Authorization") String accessToken){
        // Call /userinfo if additional profile data is needed
        Map<String, Object> userInfo = auth0UserService.getUserInfo(accessToken);

        // Example: Using user info to fetch roles or customize query
        String email = (String) userInfo.get("email");

        // Fetch all groups for the user
        List<Group> userGroups = groupService.getGroups(email);

        // Enrich with member count and map to DTO
        List<GroupsResponseDTO> groupWithMemberCountList = userGroups.stream()
                .map(group -> new GroupsResponseDTO(
                        group.getId(),
                        group.getName(),
                        group.getDescription(),
                        group.getImageUrl(),
                        group.getCreatedDate(),
                        group.getCreatorId(),
                        groupMemberService.getMemberIds(group.getId())
                ))
                .toList();

        return ResponseEntity.ok(groupWithMemberCountList);


    }
}
