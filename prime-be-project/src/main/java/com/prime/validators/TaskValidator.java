package com.prime.validators;

import com.prime.entities.Task;
import com.prime.feignClient.UserServiceClient;
import com.prime.models.request.TaskRequest;
import com.prime.models.response.UserResponse;
import com.prime.repositories.ProjectRepository;
import com.prime.repositories.TaskRepository;
import com.prime.utils.SecurityUtil;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import java.util.UUID;

import static com.prime.constants.MessageErrors.*;

@AllArgsConstructor
@Component
public class TaskValidator extends CommonValidator {

    private static final Integer NAME_SIZE = 5;

    private final TaskRepository taskRepository;

    private final ProjectRepository projectRepository;

    private final UserServiceClient userServiceClient;

    public UserResponse validateCreate(TaskRequest taskRequest) {
        checkEmpty().accept(taskRequest, TASK_INVALID);
        validateCheckTitle(taskRequest.getTitle());
        validateCheckDescription(taskRequest.getDescription());
        validateIdProject(taskRequest.getProjectId());
        return validateCheckUsername(taskRequest.getAssignedTo());
    }

    public void validateIdProject(UUID id) {
        checkEmpty().accept(id, PRODUCT_INVALID);
        checkCondition().accept(ObjectUtils.isEmpty(projectRepository.findById(id).get()), PRODUCT_ID_NOT_FOUND);
    }

    public void validateForListTaskAdmin(Integer page, Integer size) {
    }

    public UserResponse validateCheckUsername(String username) {
        checkEmpty().accept(username, USER_NAME_INVALID);
        UserResponse userResponse = userServiceClient.findUserByUsername(username);
        checkCondition().accept(ObjectUtils.isEmpty(userResponse), USER_INVALID);
        return userResponse;
    }

    public void validateDeleteTask(UUID taskId) {
        Task task = taskRepository.findById(taskId).get();
        checkEmpty().accept(!ObjectUtils.isEmpty(task), TASK_NOT_EXISTS);
        checkEmpty().accept(!SecurityUtil.isAdmin() && !task.getAssignedTo().equals(SecurityUtil.getIDUser()), TASK_NOT_BELONG_TO_USER);
    }

    public UserResponse validateUpdate(TaskRequest taskRequest, UUID taskId) {
        UserResponse userResponse = null;
        checkEmpty().accept(taskRequest, TASK_INVALID);
        checkCondition().accept(ObjectUtils.isEmpty(taskRepository.findById(taskId)), TASK_NOT_EXISTS);

        if (StringUtils.hasLength(taskRequest.getTitle())) {
            validateCheckTitle(taskRequest.getTitle());
        }
        if (StringUtils.hasLength(taskRequest.getDescription())) {
            validateCheckDescription(taskRequest.getDescription());
        }
        if (StringUtils.hasLength(taskRequest.getAssignedTo()) && !taskRequest.getAssignedTo().equalsIgnoreCase(SecurityUtil.getUserName())) {
            checkCondition().accept(!SecurityUtil.isAdmin(), USER_UNAUTHORIZED);
            userResponse = userServiceClient.findUserByUsername(taskRequest.getAssignedTo());
            checkCondition().accept(ObjectUtils.isEmpty(userResponse), USER_INVALID);
        }
        return userResponse;
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
