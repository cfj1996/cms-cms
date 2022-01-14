/**
 * @name: index
 * @user: cfj
 * @date: 2022/1/13 13:52
 */
import type { PageParams, PageResolve, Resolve } from '@/services';
import Server from '@/services';

export const bannerState = {
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
export const LinkType = {
  outlink: {
    text: '外部链接',
  },
  innerlink: {
    text: '内部链接',
  },
};

export interface AddBanner {
  title: string;
  image: string;
  number: string;
  link: string;
  link_type: keyof typeof LinkType; //跳转链接类型
}

export interface Banner extends AddBanner {
  id: string;
  state: keyof typeof bannerState;
  created_at: string;
  updated_at: string;
}

/**
 * 添加banner
 * @param data
 */
export const addBanner = function (data: AddBanner) {
  return Server.post<Resolve<boolean>>('/banner/create', data);
};

interface EditAccount extends AddBanner {
  banner_id: string;
}

export const editBanner = function (data: EditAccount) {
  return Server.post<Resolve<boolean>>('/banner/edit', data);
};
export const getBannerPage = function (
  params: PageParams & { state?: keyof typeof bannerState; keywords: string },
) {
  return Server.get<PageResolve<Banner>>('/banner/search', params).then((res) => {
    return {
      success: res.code === 'ok',
      data: res.data.list,
      total: res.data.total,
    };
  });
};

export const updateBannerState = function (id: string, state: keyof typeof bannerState) {
  return Server.post<Resolve<boolean>>('/banner/state/update', { banner_id: id, state });
};

export const delBanner = function (id: string) {
  return Server.post<Resolve<boolean>>('/banner/delete', { banner_id: id });
};
