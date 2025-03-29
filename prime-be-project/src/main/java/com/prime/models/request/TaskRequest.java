package com.prime.models.request;


import com.prime.constants.TaskStatus;
import lombok.Data;
@Data
public class TaskRequest {

    private String title;

    private String description;

    private TaskStatus status;

    private String userName;

}
