package com.IT_REG_WE_20_team.paf.repo;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.IT_REG_WE_20_team.paf.model.Comment;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPostId(String postId);
}
