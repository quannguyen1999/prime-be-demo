import { Menu } from "../models/menu.model";
import { environment } from "../../environments/environment";

export const AVATAR_IMAGE = environment.defaultAvatarUrl;
export const ACCESS_TOKEN = "access_token";
export const REFRESH_TOKEN = "refreshToken";
export const NUMBER_TRY_REQUEST = "number_try_request";

// API URLs
export const API_CONFIG = {
  baseUrl: environment.apiUrl,
  userService: {
    baseUrl: environment.userServiceUrl,
    endpoints: {
      users: '/users',
      roles: '/roles'
    }
  },
  projectService: {
    baseUrl: environment.projectServiceUrl,
    endpoints: {
      projects: '/projects',
      tasks: '/tasks'
    }
  },
  taskService: {
    baseUrl: environment.taskServiceUrl,
    endpoints: {
      tasks: '/tasks',
      comments: '/comments'
    }
  },
  auth: {
    tokenUrl: `${environment.userServiceUrl}${environment.auth.tokenUrl}`,
    clientId: environment.auth.clientId,
    clientSecret: environment.auth.clientSecret,
    grantType: environment.auth.grantType
  }
};

export const listMenus: Menu[] = [
  {
    id: 1,
    name: 'Dashboard',
    url: '/home',
    icon: 'dashboard',
    isSelected: false
  },
  {
    id: 2,
    name: 'Projects',
    url: '/projects',
    icon: 'folder',
    isSelected: false
  },
  {
    id: 3,
    name: 'Tasks',
    url: '/tasks',
    icon: 'task',
    isSelected: false
  },
  {
    id: 4,
    name: 'Team',
    url: '/team',
    icon: 'group',
    isSelected: false
  },
  {
    id: 5,
    name: 'Settings',
    url: '/settings',
    icon: 'settings',
    isSelected: false
  }
];
