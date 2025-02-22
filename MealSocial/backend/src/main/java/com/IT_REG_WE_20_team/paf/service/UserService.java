package com.IT_REG_WE_20_team.paf.service;

import org.springframework.http.ResponseEntity;

import com.IT_REG_WE_20_team.paf.DTO.UserDTO;
import com.IT_REG_WE_20_team.paf.model.User;

import java.util.List;

public interface UserService {
    ResponseEntity<Object> createUser(User user);
    UserDTO getUserById(String userId);
    List<UserDTO> getAllUsers();
    ResponseEntity<Object> followUser(String userId, String followedUserId);

    ResponseEntity<Object> loginUser(String email, String password);
}
