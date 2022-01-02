/**
 * @name: keyword
 * @user: cfj
 * @date: 2021/12/24 21:25
 */
import type { PageParams, PageResolve, Resolve } from '@/services';
import Server from '@/services';

export interface IAddKeyword {
  name: string;
  weight: number;
}

export interface IKeyword {
  id: string;
  name: string;
  weight: number;
  created_at: string;
  updated_at: string;
}

/**
 * 新增关键词
 * @param dara
 */
export const addKeyword = function (dara: IAddKeyword) {
  return Server.post<Resolve>('/keywords/add', dara);
};
/**
 * 获取关键词列表
 * @param params
 */
export const getKeywordPage = function (params: PageParams & { keywords: string }) {
  return Server.get<PageResolve<IKeyword>>('/keysords/search', params).then((res) => ({
    success: res.code === 'ok',
    data: res.data.list,
    total: res.data.total,
  }));
};
/**
 * 删除关键词
 * @param id
 */
export const deleteKeyword = function (id: string) {
  return Server.post<Resolve>('/keywords/delete', { keywords_id: id });
};
/**
 * 修改关键词权重
 * @param id
 * @param weight
 */
export const updateKeyword = function (id: string, weight: number) {
  return Server.post('/keywords/weight/update', { keywords_id: id, weight });
};
