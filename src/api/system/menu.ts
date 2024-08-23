import axios from 'axios';

export interface MenuTreeRecord {
  id: string;
  parent_id: string;
  title: string;
  key: string;
  disabled: boolean;
  children: MenuTreeRecord[];
}

export interface MenuRecord {
  id: string;
  parent_id: string;
  name: string;
  icon: string;
  code: string;
  route: string;
  sort: number;
  hide_menu: number;
  status: number;
  children: MenuRecord[];
}

export function list() {
  return axios.get<MenuRecord[]>('/system/menu/list');
}

export function tree() {
  return axios.get<MenuTreeRecord[]>('/system/menu/tree');
}

export function save(data: MenuRecord) {
  return axios.post('/system/menu/save', data);
}

export function update(id: any, data: MenuRecord) {
  return axios.post(`/system/menu/update/${id}`, data);
}

export function deleted(id: string) {
  return axios.post(`/system/menu/delete?ids=${id}`);
}
