package com.prime.validators;

import com.prime.models.request.ProjectRequest;
import com.prime.repositories.ProjectRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;

import java.util.UUID;

import static com.prime.constants.MessageErrors.*;

@AllArgsConstructor
@Component
public class ProjectValidator extends CommonValidator{

    private static final Integer NAME_SIZE = 5;

    private final ProjectRepository projectRepository;

    public void validateCreate(ProjectRequest projectRequest) {
        checkEmpty().accept(projectRequest, PRODUCT_INVALID);
        validateCheckName(projectRequest.getName());
        validateCheckDescription(projectRequest.getDescription());
    }

    public void validateDelete(UUID projectUuid){
       validateUUID(projectUuid);
    }

    public void validateUpdate(ProjectRequest projectRequest, UUID projectUUID){
        validateUUID(projectUUID);
        validateCreate(projectRequest);
    }


    private void validateUUID(UUID projectUuid) {
        checkCondition().accept(ObjectUtils.isEmpty(projectRepository.findById(projectUuid)), PRODUCT_ID_NOT_FOUND);
    }

    private void validateCheckName(String name) {
        checkEmpty().accept(name, PRODUCT_NAME_INVALID);
        checkCondition().accept(name.length() <= NAME_SIZE, PRODUCT_NAME_INVALID);
    }

    private void validateCheckDescription(String description) {
        checkEmpty().accept(description, PRODUCT_DESCRIPTION_INVALID);
        checkCondition().accept(description.length() <= NAME_SIZE, PRODUCT_DESCRIPTION_INVALID);
    }
}
