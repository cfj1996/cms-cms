/**
 * @name: index
 * @user: cfj
 * @date: 2021/12/11 20:46
 */
import type { PageParams, PageResolve, Resolve } from '@/services';
import Server from '@/services';

export enum Role {
  admin = '管理员',
}

export const roleEnum = Object.keys(Role).map((key) => ({
  value: key,
  label: Role[key],
}));

export interface IAccess {
  id: string;
  account: string;
  role: string;
  isDisable: boolean;
  createAt: string;
  updateAt: string;
}

/**
 * 查询用户列表
 */
interface IAccessListReq {
  username: string;
  startTime: number;
  endTime: number;
}

export const getAccountList = function (params: PageParams & IAccessListReq) {
  return Server.get<PageResolve<IAccess>>('/accounts', params).then((res) => ({
    success: res.code === 'ok',
    data: res.data.list,
    total: res.data.total,
  }));
};
/**
 * 获取单个用户信息
 * @param id
 */
export const getAccount = function (id: string) {
  return Server.get<Resolve<IAccess>>('/accounts/' + id);
};

/**
 * 新增用户
 * @param data
 */
export interface IAddAccountReq {
  account: string;
  password: string;
  role: string;
  isDisable: boolean;
}

export const addAccount = function (data: IAddAccountReq) {
  return Server.post<Resolve<boolean>>('/accounts', data);
};

/**
 * 修改用户
 */
export interface IUpdateAccountReq {
  account: string;
  role: string;
  isDisable: boolean;
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
