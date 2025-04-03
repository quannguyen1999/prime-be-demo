package com.prime.constants;

/**
 * Description: Define Api Path
 */
public interface PathApi {
    String PROJECT = "/projects";
    String USER = "/users";
    String LIST_USER_NAME = "/getListUserNames";
    String FIND_USER_NAME = "/findUserByName";
    String TASK = "/tasks";
    String GET_TASK_BY_PROJECT = "/projects";
    String GET_PROJECT_BY_ID = "/id";
    String GET_PROJECT_STATISTICS = "/statistics";
    String GET_TASK_ROOT = "/root";
    String AUTHENTICATOR_PATH = "/authenticator";
    String AUTHORIZE_PATH = "/oauth2/authorize";
    String REGISTRATION_PATH = "/registration";
    String FULL_PATH = "/**";

}
