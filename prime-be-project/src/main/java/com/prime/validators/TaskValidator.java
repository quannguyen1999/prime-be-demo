package com.prime.validators;

import com.prime.models.request.TaskRequest;
import com.prime.repositories.TaskRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;

import java.util.UUID;

import static com.prime.constants.MessageErrors.*;

@AllArgsConstructor
@Component
public class TaskValidator extends CommonValidator{

    private static final Integer NAME_SIZE = 5;

    private final TaskRepository taskRepository;

    public void validateCreate(TaskRequest taskRequest) {
        checkEmpty().accept(taskRequest, TASK_INVALID);
        validateCheckTitle(taskRequest.getTitle());
        validateCheckDescription(taskRequest.getDescription());
    }

    public void validateDeleteTask(UUID taskId){
        checkEmpty().accept(!ObjectUtils.isEmpty(taskRepository.findById(taskId)), TASK_NOT_EXISTS);
        //TODO check permission remove task
    }

    public void validateUpdate(TaskRequest taskRequest, UUID taskId){
        checkEmpty().accept(!ObjectUtils.isEmpty(taskRepository.findById(taskId)), TASK_NOT_EXISTS);
        validateCreate(taskRequest);
        //TODO check username
    }

    private void validateCheckUserName(String userName){
        checkEmpty().accept(userName, TASK_USER_NAME_INVALID);
        //TODO check username
    }

    private void validateCheckTitle(String title) {
        checkEmpty().accept(title, TASK_TITLE_INVALID);
        checkCondition().accept(title.length() <= NAME_SIZE, TASK_TITLE_INVALID);
    }

    private void validateCheckDescription(String description) {
        checkEmpty().accept(description, TASK_DESCRIPTION_INVALID);
        checkCondition().accept(description.length() <= NAME_SIZE, TASK_DESCRIPTION_INVALID);
    }
}
