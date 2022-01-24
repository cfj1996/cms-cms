/**
 * @name: index
 * @user: cfj
 * @date: 2021/12/11 20:46
 */
import type { PageParams, PageResolve, Resolve } from '@/services';
import Server from '@/services';

export const roleEnum = {
  admin: {
    text: '管理员',
  },
  staff: {
    text: '职员',
  },
};

/**
 * 查询用户列表
 */

interface IAccessListReq {
  role: string;
  keywords: string;
  is_disable: boolean;
}

export interface IAddAccess {
  full_name: string;
  email: string;
  password: string;
  role: string;
}

export interface Access extends Omit<IAddAccess, 'password'> {
  id: string;
  is_disable: boolean;
  create_at: string;
  update_at: string;
}

export const getAccountList = function (params: PageParams & IAccessListReq) {
  return Server.get<PageResolve<Access>>('/staff/search', params).then((res) => ({
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
  return Server.get<Resolve<Access>>('/accounts/' + id);
};

export const addAccount = function (data: IAddAccess) {
  return Server.post<Resolve<boolean>>('/staff/add', data);
};

export interface IRePassword {
  staff_id: string;
  password: string;
}

export const rePass = function (data: IRePassword) {
  return Server.post<Resolve<boolean>>('/staff/pwd/reset', data);
};

/**
 * 禁用用户
 */
export const disableAccount = function (id: string) {
  return Server.post<Resolve<boolean>>(`/staff/disable/update`, { staff_id: id });
};
