import axios from 'axios';

export interface RoleModel {
  id: string;
  name: string;
  code: string;
  status: number;
}

export interface RoleRecord {
  id: string;
  name: string;
  code: string;
  status: number;
  sort: number;
  created_at: string;
  updated_at: string;
}

export function index(params: object) {
  return axios.get('/system/role/index', { params });
}

export function list() {
  return axios.get<RoleRecord[]>('/system/role/list');
}

export function save(data: RoleModel) {
  return axios.post('/system/role/save', data);
}

export function update(id: any, data: RoleModel) {
  return axios.post(`/system/role/update/${id}`, data);
}

export function deleted(id: string) {
  return axios.post(`/system/role/delete?ids=${id}`);
}

export function getMenuIdsByRole(roleId: any) {
  return axios.get(`/system/role/getMenuIdsByRole/${roleId}`);
}

export function menuPermission(roleId: any, menuIds: any) {
  return axios.post(`/system/role/menuPermission/${roleId}`, {
    menu_ids: menuIds,
  });
}
