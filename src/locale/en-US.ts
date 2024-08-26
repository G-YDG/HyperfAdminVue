import localeSystem from '@/views/system/locale/en-US';
import localeLogin from '@/views/login/locale/en-US';
import localeDashboard from '@/views/dashboard/locale/en-US';
import localeMenu from './en-US/menu';
import localeSettings from './en-US/settings';
import localeSearch from './en-US/search';

export default {
  'website.title': 'Arco Pro',
  'navbar.docs': 'Docs',
  'navbar.action.locale': 'Switch to English',
  'navbar.userInfo': 'User Info',
  'navbar.userSettings': 'User Settings',
  'navbar.logout': 'Logout',
  ...localeMenu,
  ...localeSettings,
  ...localeSearch,
  ...localeLogin,
  ...localeDashboard,
  ...localeSystem,
};
