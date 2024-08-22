import axios from 'axios';
import { RoleRecord } from '@/api/system/role';

export interface UserModel {
  id: string;
  username: string;
  password: string;
  nickname: string;
  avatar: string;
  status: number;
  role_ids: string[];
}

export interface UserRecord {
  id: string;
  username: string;
  password: string;
  nickname: string;
  avatar: string;
  status: number;
  roles: RoleRecord[];
  created_at: string;
}

export function index(params: object) {
  return axios.get('/system/user/index', { params });
}

export function save(data: UserModel) {
  return axios.post('/system/user/save', data);
}

export function update(id: any, data: UserModel) {
  return axios.post(`/system/user/update/${id}`, data);
}

export function deleted(id: string) {
  return axios.post(`/system/user/delete?ids=${id}`);
}
