import localeTools from '@/views/tools/locale/zh-CN';
import localeSystem from '@/views/system/locale/zh-CN';
import localeLogin from '@/views/login/locale/zh-CN';
import localeDashboard from '@/views/dashboard/locale/zh-CN';
import localeMenu from './zh-CN/menu';
import localeSettings from './zh-CN/settings';
import localeSearch from './zh-CN/search';

export default {
  'website.title': 'Hyperf Admin',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',
  'navbar.userInfo': '个人信息',
  'navbar.userSettings': '用户设置',
  'navbar.logout': '退出登录',
  ...localeMenu,
  ...localeSettings,
  ...localeSearch,
  ...localeLogin,
  ...localeDashboard,
  ...localeSystem,
  ...localeTools,
};
