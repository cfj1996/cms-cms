/**
 * @name: index
 * @user: cfj
 * @date: 2021/12/11 20:46
 */
import type { PageParams } from '@/services';
import Server from '@/services';

/**
 * 查询用户列表
 */
interface IAccessListReq {
  username: string;
  startTime: number;
  endTime: number;
}
export interface IAccessListRes {
  username: string;
  id: string;
  createdTime: string;
  avatar: string;
}
export const getAccountList = function (params: PageParams & IAccessListReq) {
  return Server.get<IAccessListRes[]>('/accounts', params);
};
/**
 * 获取单个用户信息
 * @param id
 */
export const getAccount = function (id: string) {
  return Server.get<IAccessListRes>('/accounts/' + id);
};

/**
 * 新增用户
 * @param data
 */
export interface IAddAccountReq {
  username: string;
  password: string;
  avatar?: string;
}
export const addAccount = function (data: IAddAccountReq) {
  return Server.post<boolean>('/accounts', data);
};

/**
 * 修改用户
 */
interface IUpdateAccountReq {
  username: string;
  avatar: string;
}
export const updateAccount = function (id: string, data: IUpdateAccountReq) {
  return Server.put(`/accounts/${id}`, data);
};
/**
 * 删除用户
 */
export const deleteAccount = function (id: string) {
  return Server.delete(`/accounts/${id}`);
};
