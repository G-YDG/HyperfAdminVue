import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const SYSTEM: AppRouteRecordRaw = {
  path: '/system',
  name: 'System',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.system',
    requiresAuth: true,
    icon: 'icon-lock',
    order: 0,
  },
  children: [
    {
      path: 'user',
      name: 'SystemUser',
      component: () => import('@/views/system/user/index.vue'),
      meta: {
        locale: 'menu.system.user',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'role',
      name: 'SystemRole',
      component: () => import('@/views/system/role/index.vue'),
      meta: {
        locale: 'menu.system.role',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'menu',
      name: 'SystemMenu',
      component: () => import('@/views/system/menu/index.vue'),
      meta: {
        locale: 'menu.system.menu',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'logs',
      name: 'SystemLogs',
      component: '',
      meta: {
        locale: 'menu.system.logs',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        {
          path: 'login',
          name: 'SystemLoginLogs',
          component: () => import('@/views/system/logs/login-log/index.vue'),
          meta: {
            locale: 'menu.system.logs.login',
            requiresAuth: true,
            roles: ['*'],
          },
        },
      ],
    },
  ],
};

export default SYSTEM;
