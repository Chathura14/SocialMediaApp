package com.IT_REG_WE_20_team.paf.service;

import com.IT_REG_WE_20_team.paf.model.Post;
import org.springframework.http.ResponseEntity;

import com.IT_REG_WE_20_team.paf.DTO.PostDTO;

import java.util.List;
import java.util.Optional;

public interface PostService {
    List<Post> getAllPosts();

    Optional<Post> getPostById(String id);

    Post createPost(Post post);

    ResponseEntity<Post> editPost( PostDTO postDTO);

    void deletePost(String id);

    ResponseEntity<Object> likePost(String postId, String userId);

    List<Post> getPostByIdUserId(String userId);

}
