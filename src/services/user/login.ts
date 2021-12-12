/**
 * @name: login
 * @user: cfj
 * @date: 2021/12/11 18:21
 */

import Server from '..';
import { removeToken } from '@/utils';
import type { IAccess } from '@/services/Account';

export interface ILoginReq {
  username: string;
  password: string;
}

/**
 * 登录
 * @param data
 */
export function login(data: ILoginReq) {
  return Server.post<string>('/login', data, { auth: false });
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
  account: string;
  role: string;
  isDisable: boolean;
  createAt: string;
  updateAt: string;
}
/**
 * 过去用户信息
 */
export function userGetInfo() {
  return Server.get<IAccess>('/user/getInfo');
}

export function upFile(file: File) {
  console.log('file', file);
  return Server.post<string>(
    '/upload/file',
    { file: file },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
}
