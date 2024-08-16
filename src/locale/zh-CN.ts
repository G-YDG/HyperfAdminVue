import localeLogin from '@/views/login/locale/zh-CN';
import localeWorkplace from '@/views/dashboard/workplace/locale/zh-CN';
import localeMenu from './zh-CN/menu';
import localeSettings from './zh-CN/settings';

export default {
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',
  'navbar.switchRoles': '切换角色',
  'navbar.userCenter': '用户中心',
  'navbar.userSettings': '用户设置',
  'navbar.logout': '退出登录',
  ...localeMenu,
  ...localeSettings,
  ...localeLogin,
  ...localeWorkplace,
};
