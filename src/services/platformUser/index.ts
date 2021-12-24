/**
 * @name: index
 * @user: cfj
 * @date: 2021/12/16 16:58
 */
import type { PageParams, PageResolve } from '@/services';
import Server from '@/services';

export interface IPlat {
  id: string;
  nick_name: string;
  open_id: string;
  session_key: string;
  created_at: string;
  updated_at: string;
}

export interface IPlatReq {
  keywords: string;
}
export const getPlatLIst = function (params: PageParams & IPlatReq) {
  return Server.get<PageResolve<IPlat>>('/user/search', params).then((res) => ({
    success: res.code === 'ok',
    data: res.data.list,
    total: res.data.total,
  }));
};
