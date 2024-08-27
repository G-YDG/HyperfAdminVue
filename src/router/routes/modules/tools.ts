import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const TOOLS: AppRouteRecordRaw = {
  path: '/tools',
  name: 'Tools',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.tools',
    requiresAuth: true,
    icon: 'icon-tools',
    order: 0,
  },
  children: [
    {
      path: 'generateCode',
      name: 'GenerateCode',
      component: () => import('@/views/tools/generate-code/index.vue'),
      meta: {
        locale: 'menu.tools.generateCode',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default TOOLS;
