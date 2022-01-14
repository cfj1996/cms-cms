/**
 * @name: index
 * @user: cfj
 * @date: 2022/1/13 15:07
 */
import type { PageParams, PageResolve, Resolve } from '@/services';
import Server from '@/services';

export const activityState = {
  draf: {
    text: '草稿',
    status: 'Default',
  },
  onsale: {
    text: '上架',
    status: 'Success',
  },
  offsale: {
    text: '下架',
    status: 'Error',
  },
};

export interface AddActivity {
  title: string;
  content: string;
  number: string;
  list_title: string;
  associate: string[];
  images: string[];
  start_time: string;
  end_time: string;
}

export const addActivity = function (data: AddActivity) {
  return Server.post<Resolve<boolean>>('/activity/create', data);
};

export interface Activity extends AddActivity {
  id: string;
  state: keyof typeof activityState;
  created_at: string;
  updated_at: string;
}

export const getActivityPage = function (params: PageParams & { keywords: string }) {
  return Server.get<PageResolve<Activity>>('/activity/search', params).then((res) => {
    return {
      success: res.code === 'ok',
      data: res.data.list,
      total: res.data.total,
    };
  });
};
export const delActivity = function (id: string) {
  return Server.post<Resolve<boolean>>('/activity/delete', { activity_id: id });
};

export interface EditAccount extends AddActivity {
  activity_id: string;
}

export const editAccount = function (data: EditAccount) {
  return Server.post<Resolve<boolean>>('/activity/edit', data);
};
export const updateAccountState = function (id: string, state: keyof typeof activityState) {
  return Server.post<Resolve<boolean>>('/activity/state/update', { activity_id: id, state });
};
