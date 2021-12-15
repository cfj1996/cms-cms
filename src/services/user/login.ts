/**
 * @name: login
 * @user: cfj
 * @date: 2021/12/11 18:21
 */

import type { Resolve } from '..';
import Server from '..';
import { removeToken } from '@/utils';

export interface ILoginReq {
  email: string;
  password: string;
}

/**
 * 登录
 * @param data
 */
export function login(data: ILoginReq) {
  return Server.post<Resolve<{ token: string }>>('/admin/auth/login', data, { auth: false }).then(
    (res) => {
      return {
        success: res.code === 'ok',
        data: res.data,
        message: res.msg,
      };
    },
  );
}

export interface IRegisterReq {
  username: string;
  password: string;
}

/**
 * 注册
 * @param data
 */
export function register(data: ILoginReq) {
  return Server.post('/login', data, { auth: false });
}

/**
 * 登出
 */
export function logout() {
  removeToken();
  return Server.get<boolean>('/logout');
}

export interface IUserInfo {
  id: string;
  full_name: string;
  role: string;
  is_disable: boolean;
}
/**
 * 过去用户信息
 */
export function userGetInfo() {
  return Server.get<IUserInfo>('/admin/auth/info').then((res) => {
    return {
      success: true,
      data: res,
    };
  });
}

export function upFile(file: File) {
  const formData = new FormData();
  formData.append('files', file);
  return Server.post<string>('/upload/file', formData, {
    prefix: 'http://localhost:3000',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
