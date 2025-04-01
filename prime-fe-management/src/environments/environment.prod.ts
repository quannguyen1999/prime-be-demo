export const environment = {
  production: true,
  apiUrl: 'https://api.production.com',
  userServiceUrl: 'https://api.production.com/userService',
  projectServiceUrl: 'https://api.production.com/projectService',
  taskServiceUrl: 'https://api.production.com/taskService',
  defaultAvatarUrl: 'https://www.caspianpolicy.org/no-image.png',
  auth: {
    tokenUrl: '/oauth2/token',
    clientId: 'admin',
    clientSecret: 'password',
    grantType: 'custom_password'
  }
}; 