package com.evenly.repository;

import com.evenly.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupRepository extends JpaRepository<Group, String> {
    List<Group> findAllByCreatorId(String creatorId);
}
