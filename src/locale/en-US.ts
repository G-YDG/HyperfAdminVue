import localeLogin from '@/views/login/locale/en-US';
import localeWorkplace from '@/views/dashboard/workplace/locale/en-US';
import localeMenu from './en-US/menu';
import localeSettings from './en-US/settings';

export default {
  'navbar.docs': 'Docs',
  'navbar.action.locale': 'Switch to English',
  'navbar.switchRoles': 'Switch Roles',
  'navbar.userCenter': 'User Center',
  'navbar.userSettings': 'User Settings',
  'navbar.logout': 'Logout',
  ...localeMenu,
  ...localeSettings,
  ...localeLogin,
  ...localeWorkplace,
};
