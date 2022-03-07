/**
 * @name: tag
 * @user: cfj
 * @date: 2022/3/7 22:21
 */
import type { PageParams, PageResolve, Resolve } from '@/services';
import Server from '@/services';

export interface Tag extends AddTag {
  id: string;
  updated_at: string;
  created_at: string;
}

export interface AddTag {
  tag_name: string;
}

export const addTag = function (data: AddTag) {
  return Server.post<Resolve>('/taglibrary/create', data);
};
export const delTag = (tag_id: string) => {
  return Server.post<Resolve>('/taglibrary/delete', { tag_id });
};
export const getTags = function (params: PageParams & { tag_name?: string }) {
  return Server.get<PageResolve<Tag>>('/taglibrary/search', params).then((res) => ({
    success: res.code === 'ok',
    data: res.data.list,
    total: res.data.total,
  }));
};
