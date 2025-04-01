export const environment = {
  production: false,
  apiUrl: 'http://localhost:9000',
  userServiceUrl: 'http://localhost:9000/user-service',
  projectServiceUrl: 'http://localhost:9000/project-service',
  taskServiceUrl: 'http://localhost:9000/taskService',
  defaultAvatarUrl: 'https://www.caspianpolicy.org/no-image.png',
  auth: {
    tokenUrl: '/oauth2/token',
    clientId: 'testing',
    clientSecret: 'password',
    grantType: 'custom_password'
  }
}; 