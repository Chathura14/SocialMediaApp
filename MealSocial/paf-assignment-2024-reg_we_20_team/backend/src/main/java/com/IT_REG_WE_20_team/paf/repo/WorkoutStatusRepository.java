package com.IT_REG_WE_20_team.paf.repo;

import com.IT_REG_WE_20_team.paf.model.WorkoutStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkoutStatusRepository extends MongoRepository<WorkoutStatus, String> {

}