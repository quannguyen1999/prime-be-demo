-- Insert 10 users
INSERT INTO `user` (`id`, `username`, `email`, `password`, `role`) VALUES
(UUID(), 'john_doe', 'john.doe@example.com', '$2a$10$a6Sk21OhB6lHOj5p3JgIJ.PUCZkfYmNR2tJbXRhingy5YW9Cp/Rc6', 'USER'),
(UUID(), 'jane_smith', 'jane.smith@example.com', '$2a$10$a6Sk21OhB6lHOj5p3JgIJ.PUCZkfYmNR2tJbXRhingy5YW9Cp/Rc6', 'USER'),
(UUID(), 'robert_brown', 'robert.brown@example.com', '$2a$10$a6Sk21OhB6lHOj5p3JgIJ.PUCZkfYmNR2tJbXRhingy5YW9Cp/Rc6', 'USER'),
(UUID(), 'emily_clark', 'emily.clark@example.com', '$2a$10$a6Sk21OhB6lHOj5p3JgIJ.PUCZkfYmNR2tJbXRhingy5YW9Cp/Rc6', 'USER'),
(UUID(), 'michael_wilson', 'michael.wilson@example.com', '$2a$10$a6Sk21OhB6lHOj5p3JgIJ.PUCZkfYmNR2tJbXRhingy5YW9Cp/Rc6', 'USER'),
(UUID(), 'sarah_moore', 'sarah.moore@example.com', '$2a$10$a6Sk21OhB6lHOj5p3JgIJ.PUCZkfYmNR2tJbXRhingy5YW9Cp/Rc6', 'USER'),
(UUID(), 'david_white', 'david.white@example.com', '$2a$10$a6Sk21OhB6lHOj5p3JgIJ.PUCZkfYmNR2tJbXRhingy5YW9Cp/Rc6', 'USER'),
(UUID(), 'olivia_jones', 'olivia.jones@example.com', '$2a$10$a6Sk21OhB6lHOj5p3JgIJ.PUCZkfYmNR2tJbXRhingy5YW9Cp/Rc6', 'USER'),
(UUID(), 'james_martin', 'james.martin@example.com', '$2a$10$a6Sk21OhB6lHOj5p3JgIJ.PUCZkfYmNR2tJbXRhingy5YW9Cp/Rc6', 'USER'),
(UUID(), 'emma_taylor', 'emma.taylor@example.com', '$2a$10$a6Sk21OhB6lHOj5p3JgIJ.PUCZkfYmNR2tJbXRhingy5YW9Cp/Rc6', 'USER');

-- Insert 10 projects
INSERT INTO `project` (`id`, `name`, `description`, `owner_id`) VALUES
(UUID(), 'Project Alpha', 'An important business project.', (SELECT `id` FROM `user` ORDER BY RAND() LIMIT 1)),
(UUID(), 'Project Beta', 'Developing a new mobile app.', (SELECT `id` FROM `user` ORDER BY RAND() LIMIT 1)),
(UUID(), 'Project Gamma', 'Website redesign project.', (SELECT `id` FROM `user` ORDER BY RAND() LIMIT 1)),
(UUID(), 'Project Delta', 'Cloud migration strategy.', (SELECT `id` FROM `user` ORDER BY RAND() LIMIT 1)),
(UUID(), 'Project Epsilon', 'AI-based chatbot development.', (SELECT `id` FROM `user` ORDER BY RAND() LIMIT 1)),
(UUID(), 'Project Zeta', 'Cybersecurity improvement plan.', (SELECT `id` FROM `user` ORDER BY RAND() LIMIT 1)),
(UUID(), 'Project Eta', 'Developing a fintech application.', (SELECT `id` FROM `user` ORDER BY RAND() LIMIT 1)),
(UUID(), 'Project Theta', 'Market research analysis.', (SELECT `id` FROM `user` ORDER BY RAND() LIMIT 1)),
(UUID(), 'Project Iota', 'E-commerce backend upgrade.', (SELECT `id` FROM `user` ORDER BY RAND() LIMIT 1)),
(UUID(), 'Project Kappa', 'Customer data analytics tool.', (SELECT `id` FROM `user` ORDER BY RAND() LIMIT 1));

-- Insert 20 tasks (corrected status values)
INSERT INTO `task` (`id`, `project_id`, `title`, `description`, `status`, `assigned_to`) VALUES
(UUID(), (SELECT `id` FROM `project` ORDER BY RAND() LIMIT 1), 'Task 1', 'Write project documentation.', 'BACK_LOG', (SELECT `id` FROM `user` ORDER BY RAND() LIMIT 1)),
(UUID(), (SELECT `id` FROM `project` ORDER BY RAND() LIMIT 1), 'Task 2', 'Develop backend API.', 'DOING', (SELECT `id` FROM `user` ORDER BY RAND() LIMIT 1)),
(UUID(), (SELECT `id` FROM `project` ORDER BY RAND() LIMIT 1), 'Task 3', 'Create database schema.', 'DONE', (SELECT `id` FROM `user` ORDER BY RAND() LIMIT 1)),
(UUID(), (SELECT `id` FROM `project` ORDER BY RAND() LIMIT 1), 'Task 4', 'UI/UX design for dashboard.', 'ON_HOLD', (SELECT `id` FROM `user` ORDER BY RAND() LIMIT 1)),
(UUID(), (SELECT `id` FROM `project` ORDER BY RAND() LIMIT 1), 'Task 5', 'Implement authentication.', 'DOING', (SELECT `id` FROM `user` ORDER BY RAND() LIMIT 1)),
(UUID(), (SELECT `id` FROM `project` ORDER BY RAND() LIMIT 1), 'Task 6', 'Optimize database queries.', 'DONE', (SELECT `id` FROM `user` ORDER BY RAND() LIMIT 1)),
(UUID(), (SELECT `id` FROM `project` ORDER BY RAND() LIMIT 1), 'Task 7', 'Write unit tests.', 'BACK_LOG', (SELECT `id` FROM `user` ORDER BY RAND() LIMIT 1)),
(UUID(), (SELECT `id` FROM `project` ORDER BY RAND() LIMIT 1), 'Task 8', 'Refactor legacy code.', 'DOING', (SELECT `id` FROM `user` ORDER BY RAND() LIMIT 1)),
(UUID(), (SELECT `id` FROM `project` ORDER BY RAND() LIMIT 1), 'Task 9', 'Build front-end components.', 'DONE', (SELECT `id` FROM `user` ORDER BY RAND() LIMIT 1)),
(UUID(), (SELECT `id` FROM `project` ORDER BY RAND() LIMIT 1), 'Task 10', 'Deploy application.', 'BACK_LOG', (SELECT `id` FROM `user` ORDER BY RAND() LIMIT 1)),
(UUID(), (SELECT `id` FROM `project` ORDER BY RAND() LIMIT 1), 'Task 11', 'Set up CI/CD pipeline.', 'DOING', (SELECT `id` FROM `user` ORDER BY RAND() LIMIT 1)),
(UUID(), (SELECT `id` FROM `project` ORDER BY RAND() LIMIT 1), 'Task 12', 'Conduct security audit.', 'DONE', (SELECT `id` FROM `user` ORDER BY RAND() LIMIT 1)),
(UUID(), (SELECT `id` FROM `project` ORDER BY RAND() LIMIT 1), 'Task 13', 'Prepare project report.', 'ON_HOLD', (SELECT `id` FROM `user` ORDER BY RAND() LIMIT 1)),
(UUID(), (SELECT `id` FROM `project` ORDER BY RAND() LIMIT 1), 'Task 14', 'Fix UI bugs.', 'DOING', (SELECT `id` FROM `user` ORDER BY RAND() LIMIT 1)),
(UUID(), (SELECT `id` FROM `project` ORDER BY RAND() LIMIT 1), 'Task 15', 'Optimize cloud costs.', 'DONE', (SELECT `id` FROM `user` ORDER BY RAND() LIMIT 1)),
(UUID(), (SELECT `id` FROM `project` ORDER BY RAND() LIMIT 1), 'Task 16', 'Monitor server logs.', 'ARCHIVED', (SELECT `id` FROM `user` ORDER BY RAND() LIMIT 1)),
(UUID(), (SELECT `id` FROM `project` ORDER BY RAND() LIMIT 1), 'Task 17', 'Conduct stakeholder meeting.', 'DOING', (SELECT `id` FROM `user` ORDER BY RAND() LIMIT 1)),
(UUID(), (SELECT `id` FROM `project` ORDER BY RAND() LIMIT 1), 'Task 18', 'Setup automated tests.', 'DONE', (SELECT `id` FROM `user` ORDER BY RAND() LIMIT 1)),
(UUID(), (SELECT `id` FROM `project` ORDER BY RAND() LIMIT 1), 'Task 19', 'Train AI model.', 'BACK_LOG', (SELECT `id` FROM `user` ORDER BY RAND() LIMIT 1)),
(UUID(), (SELECT `id` FROM `project` ORDER BY RAND() LIMIT 1), 'Task 20', 'Write API documentation.', 'DOING', (SELECT `id` FROM `user` ORDER BY RAND() LIMIT 1));

-- Insert 50+ projects
-- Already looks good — no ENUMs here

-- Insert 500 tasks with corrected statuses
INSERT INTO `task` (`id`, `project_id`, `title`, `description`, `status`, `assigned_to`)
SELECT UUID(),
       (SELECT `id` FROM `project` ORDER BY RAND() LIMIT 1),
       CONCAT('Task ', FLOOR(RAND() * 500) + 1),
       'Auto-generated task for load testing.',
       ELT(FLOOR(1 + (RAND() * 5)), 'BACK_LOG', 'DOING', 'ON_HOLD', 'DONE', 'ARCHIVED'),
       (SELECT `id` FROM `user` ORDER BY RAND() LIMIT 1)
FROM (
  SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION
  SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION
  SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15 UNION
  SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19 UNION SELECT 20 UNION
  SELECT 21 UNION SELECT 22 UNION SELECT 23 UNION SELECT 24 UNION SELECT 25 UNION
  SELECT 26 UNION SELECT 27 UNION SELECT 28 UNION SELECT 29 UNION SELECT 30 UNION
  SELECT 31 UNION SELECT 32 UNION SELECT 33 UNION SELECT 34 UNION SELECT 35 UNION
  SELECT 36 UNION SELECT 37 UNION SELECT 38 UNION SELECT 39 UNION SELECT 40 UNION
  SELECT 41 UNION SELECT 42 UNION SELECT 43 UNION SELECT 44 UNION SELECT 45 UNION
  SELECT 46 UNION SELECT 47 UNION SELECT 48 UNION SELECT 49 UNION SELECT 50
) AS tmp;
