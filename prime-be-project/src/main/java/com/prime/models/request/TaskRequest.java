package com.prime.models.request;


import com.prime.constants.TaskStatus;
import lombok.Data;

import java.util.UUID;

@Data
public class TaskRequest {

    private String title;

    private String description;

    private TaskStatus status;

    private String assignedTo;

    private UUID projectId;

}
