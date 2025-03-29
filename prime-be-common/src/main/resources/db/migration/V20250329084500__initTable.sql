CREATE TABLE `user` (
    `id` varchar(36) NOT NULL PRIMARY KEY,
    `username` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('ADMIN', 'USER') NOT NULL
);

CREATE TABLE `project` (
    `id` varchar(36) NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `owner_id` varchar(36) NOT NULL,
    `create_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`)
);


CREATE TABLE `activity_log` (
    `id` varchar(36) NOT NULL PRIMARY KEY,
    `user_id` varchar(36) NOT NULL,
    `project_id` varchar(36) NOT NULL,
    `action` ENUM('ACTION_1', 'ACTION_2', 'ACTION_3') NOT NULL,
    `timestamp` TIME NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
    FOREIGN KEY (`project_id`) REFERENCES `project`(`id`)
);

CREATE TABLE `task` (
    `id` varchar(36) NOT NULL PRIMARY KEY,
    `project_id` varchar(36) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `status` ENUM('TODO', 'IN_PROGRESS', 'DONE') NOT NULL,
    `assigned_to` varchar(36),
    `create_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`project_id`) REFERENCES `project`(`id`),
    FOREIGN KEY (`assigned_to`) REFERENCES `user`(`id`)
);

CREATE TABLE `client` (
    `id` BINARY(255) NOT NULL PRIMARY KEY,
    `client_id` VARCHAR(255) NOT NULL,
    `client_id_issued_at` DATETIME NOT NULL,
    `client_secret` VARCHAR(255) NOT NULL,
    `client_secret_expires_at` DATETIME,
    `client_name` VARCHAR(255) NOT NULL,
    `client_authentication_methods` VARCHAR(1000),
    `authorization_grant_types` VARCHAR(1000),
    `redirect_uris` VARCHAR(1000),
    `scopes` VARCHAR(1000),
    `client_settings` VARCHAR(2000),
    `token_settings` VARCHAR(2000)
);
