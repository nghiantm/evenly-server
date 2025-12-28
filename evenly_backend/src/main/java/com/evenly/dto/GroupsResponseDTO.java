package com.evenly.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.sql.Date;
import java.util.List;

@Data
@AllArgsConstructor
public class GroupsResponseDTO {
    private String id;
    private String name;
    private String description;
    private String imageUrl;
    private Date createdDate;
    private String creatorId;
    private List<String> members;
}
