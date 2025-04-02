package com.prime.controllers;

import com.prime.models.request.CommonPageInfo;
import com.prime.models.response.ActivityLogResponse;
import com.prime.service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/activity-logs")
@RequiredArgsConstructor
public class ActivityLogController {

    private final ActivityLogService activityLogService;
    
    @GetMapping
    public ResponseEntity<CommonPageInfo<ActivityLogResponse>> getActivityLogs(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        return ResponseEntity.ok(activityLogService.getActivityLogs(page, size));
    }


} 