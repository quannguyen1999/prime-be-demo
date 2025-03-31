import { Menu } from "../models/menu.model";

export const AVATAR_IMAGE = "https://www.caspianpolicy.org/no-image.png"
export const ACCESS_TOKEN = "access_token";
export const REFRESH_TOKEN = "refreshToken";
export const NUMBER_TRY_REQUEST = "number_try_request";

export const listMenus: Array<Menu> = [ {
        id: 1,
        typeIcon: 'supervisor_account',
        value: 'Manage users',
        isSelected: false,
        url: 'users'
    },
    {
        id: 2,
        typeIcon: 'developer_board',
        value: 'Manage Projects',
        isSelected: false,
        url: 'project'
    },
    {
        id: 3,
        typeIcon: 'done',
        value: 'Manage Tasks',
        isSelected: true,
        url: 'tasks'
    },
    {
        id: 4,
        typeIcon: 'description',
        value: 'View Log',
        isSelected: false,
        url: 'activityLogs'
        
    }
];
