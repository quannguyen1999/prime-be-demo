package com.prime.models.response;


import com.prime.constants.TaskStatus;
import lombok.Data;

import java.util.UUID;

@Data
public class TaskResponse extends CommonBaseResponse {

    private UUID id;

    private UUID projectId;

    private String projectName;

    private String title;

    private String description;

    private TaskStatus status;

    private UUID assignedTo;

    private String userName;

}
