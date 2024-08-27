export type RoleType = '' | '*' | 'admin' | 'user';
export interface UserState {
  id?: number;
  username?: string;
  nickname?: string;
  avatar?: string;
  phone?: string;
  email?: string;
  login_time?: string;
  login_ip?: string;
  role: RoleType;
  roles: RoleType[];
}
