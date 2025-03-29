package com.prime.controllers;

import com.prime.constants.PathApi;
import com.prime.models.request.TaskRequest;
import com.prime.models.response.TaskResponse;
import com.prime.service.TaskService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = PathApi.TASK)
@AllArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<TaskResponse> createTask(@RequestBody TaskRequest taskRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createTask(taskRequest));
    }

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<List<TaskResponse>> getListTask(@RequestParam Integer page, @RequestParam Integer size) {
        return ResponseEntity.status(HttpStatus.OK).body(taskService.listTask(page, size));
    }

    @RequestMapping(method = RequestMethod.PUT)
    public ResponseEntity<TaskResponse> putTask(@RequestBody TaskRequest taskRequest, @RequestParam UUID taskId) {
        return ResponseEntity.status(HttpStatus.OK).body(taskService.updateTask(taskRequest, taskId));
    }

    @RequestMapping(method = RequestMethod.DELETE)
    public ResponseEntity<String> deleteTask(@RequestParam UUID taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.status(HttpStatus.OK).body(HttpStatus.OK.toString());
    }







}
