/**
 * @name: login
 * @user: cfj
 * @date: 2021/12/11 18:21
 */

import type { Resolve } from '..';
import Server from '..';
import { removeToken } from '@/utils';
import request from 'umi-request';
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

export interface IFileView {
  uploadURL: string;
  viewingURL: string;
}

export function upFile(mimeType: string, size: number, name: string) {
  console.log(name);
  return Server.post<{ images: IFileView[] }>('/files/imagepost/uploadurl', {
    images: [
      {
        mimeType: mimeType,
        fileSize: size,
      },
    ],
  }).then((res) => {
    console.log('res', res);
    return res.images[0];
  });
}

export function upFile2(mimeType: string, size: number, name: string) {
  return request
    .get(`http://localhost:3008/upload/file?name=${name}&ContentType=${mimeType}`)
    .then((res) => ({
      uploadURL: res.data.uploadUrl,
      viewingURL: res.data.url,
    }));
}
