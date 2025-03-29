INSERT INTO `client` (
    `id`, `authorization_grant_types`, `client_authentication_methods`, `client_id`,
    `client_id_issued_at`, `client_name`, `client_secret`, `client_secret_expires_at`,
    `client_settings`, `redirect_uris`, `scopes`, `token_settings`
) VALUES
    ('615c1526-078d-4f06-b542-19e8a915bfc0', 'authorization_code,refresh_token,client_credentials', 'client_secret_basic,client_secret_post', 'testing', '2024-02-20 00:00:00', 'testing', '$2a$10$H2fnzkVd05EUybKAAaI.lO0r.SYHCh1H9JVpFhiJ9Yv/Ne/QM8Diy', '2025-05-30 00:00:00', '{"key":"value"}', 'http://insomnia', 'read,write,openid', '{"access-token-time-to-live": 1, "authorization-code-time-to-live": 1}'),
    ('fe35f46a-a644-4f45-9d7f-8069056f2e15', 'authorization_code,refresh_token', 'client_secret_basic,client_secret_post', 'admin', '2024-02-20 00:00:00', 'admin', '$2a$10$H2fnzkVd05EUybKAAaI.lO0r.SYHCh1H9JVpFhiJ9Yv/Ne/QM8Diy', '2025-05-30 00:00:00', '{"key":"value"}', 'http://127.0.0.1:4200/,http://127.0.0.1:4200/home,http://127.0.0.1:8080/login/oauth2/code/api-client-oidc,http://127.0.0.1:8080,http://localhost:4200/home', 'read,write,openid', '{"access-token-time-to-live": 1, "authorization-code-time-to-live": 1}');

INSERT INTO `User` (
	id,username,email,`password`,`role`
) VALUES
	 ('6da3d8b1-afc8-4045-9a2d-a38bf7e79aab','admin','admin@prime.com.vn','$2a$10$a6Sk21OhB6lHOj5p3JgIJ.PUCZkfYmNR2tJbXRhingy5YW9Cp/Rc6','ADMIN');