import type { RouteRecordNormalized } from 'vue-router';

export interface WebsiteSetting {
  WEBSITE_SETTING_TITLE: string;
  WEBSITE_SETTING_LOGO: string;
  WEBSITE_SETTING_RECORD_NUMBER: string;
  WEBSITE_SETTING_URL: string;
  WEBSITE_SETTING_COMPANY: string;
  WEBSITE_SETTING_TIME: string;
}

export interface AppState {
  theme: string;
  colorWeak: boolean;
  navbar: boolean;
  menu: boolean;
  topMenu: boolean;
  hideMenu: boolean;
  menuCollapse: boolean;
  footer: boolean;
  themeColor: string;
  menuWidth: number;
  globalSettings: boolean;
  device: string;
  tabBar: boolean;
  menuFromServer: boolean;
  serverMenu: RouteRecordNormalized[];
  websiteSetting: WebsiteSetting;
}
