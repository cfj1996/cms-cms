/**
 * @name: Issuer
 * @user: cfj
 * @date: 2022/2/20 19:21
 */
import type { PageParams, PageResolve, Resolve } from '@/services';
import Server from '@/services';

export interface IAddIssuer {
  issuer_name: string;
  issuer_desc: string;
}

export interface IEditIssuer extends IAddIssuer {
  issuer_id: string;
}

export interface Issuer extends IAddIssuer {
  id: string;
  created_at: string;
  updated_at: string;
}

export const getIssuerList = function (params: PageParams & { issuer_name?: string }) {
  return Server.get<PageResolve<Issuer>>('/issuer/search', params).then((res) => ({
    success: res.code === 'ok',
    data: res.data.list,
    total: res.data.total,
  }));
};

export const addIssuer = function (data: IAddIssuer) {
  return Server.post<Resolve<boolean>>('/issuer/create', data);
};

export const editIssuer = function (data: IEditIssuer) {
  return Server.post<Resolve<boolean>>('/issuer/edit', data);
};
