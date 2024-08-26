import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginRes {
  token: string;
}
export function login(data: LoginData) {
  return axios.post<LoginRes>('/system/user/login', data);
}

export function logout() {
  return axios.post<LoginRes>('/system/user/logout');
}

export function getUserInfo() {
  return axios.get<UserState>('/system/user/getInfo');
}

export function getMenuList() {
  return axios.get<RouteRecordNormalized[]>('/system/user/menu');
}

export function updateInfo(data: any) {
  return axios.post(`/system/user/updateInfo`, data);
}

export function modifyPassword(data: any) {
  return axios.post(`/system/user/modifyPassword`, data);
}
