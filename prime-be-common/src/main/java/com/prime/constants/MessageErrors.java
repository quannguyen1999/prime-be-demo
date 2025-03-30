package com.prime.constants;

/**
 * Description: Define ALl Error Messages
 */
public enum MessageErrors {
    // Pagination-related errors
    PAGE_INVALID, // Indicates that the requested page number is invalid
    SIZE_INVALID, // Indicates that the requested page size is invalid

    // Authentication & Authorization errors
    ACCOUNT_USERNAME_OR_PASS_INVALID, // Incorrect username or password

    // Product-related errors
    PRODUCT_INVALID, // General product validation failure
    PRODUCT_ID_NOT_FOUND, // No product found with the given ID
    PRODUCT_NAME_INVALID, // The provided product name is invalid
    PRODUCT_DESCRIPTION_INVALID, // The provided product description is invalid

    // Task-related errors
    TASK_INVALID, // General task validation failure
    TASK_NOT_EXISTS, // The requested task does not exist
    TASK_TITLE_INVALID, // The provided task title is invalid
    TASK_DESCRIPTION_INVALID, // The provided task description is invalid
    TASK_USER_NAME_INVALID // The assigned username for the task is invalid

}
