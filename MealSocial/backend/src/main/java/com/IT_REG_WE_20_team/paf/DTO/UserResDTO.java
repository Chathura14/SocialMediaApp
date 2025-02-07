package com.IT_REG_WE_20_team.paf.DTO;

import com.IT_REG_WE_20_team.paf.model.RegistrationSource;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserResDTO {

    private String id;

    private String name;

    private String email;

    private String profileImage;

    private RegistrationSource source;

    private List<String> followedUsers;
}
