import type { PageParams, PageResolve, Resolve } from '..';
import Server from '..';

/**
 * @name: index
 * @user: cfj
 * @date: 2022/2/22 22:08
 */
export interface BlindBox extends AddBlindBox {
  id: string;
  state: keyof typeof blindStateMenu;
  sale_amount: number;
  created_at: string;
  updated_at: string;
}

export const blindStateMenu = {
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

export interface AddBlindBox {
  title: string;
  images: string[];
  blind_name: string;
  price: string;
  amount: number;
  play_instruction: string;
  probability: number;
}

export interface EditBlindBox extends AddBlindBox {
  blind_id: string;
}

export const addBlindBox = function (data: AddBlindBox) {
  return Server.post<Resolve<boolean>>('/blindbox/create', data);
};
export const getBlindBoxPage = function (params: PageParams & { blind_name?: string }) {
  return Server.get<PageResolve<BlindBox>>('/blindbox/search', params).then((res) => ({
    success: res.code === 'ok',
    data: res.data.list,
    total: res.data.total,
  }));
};
export const editBlindBox = function (data: EditBlindBox) {
  return Server.post<Resolve<boolean>>('/blindbox/edit', data);
};
export const getBlindBox = function (blind_id: string) {
  return Server.get<Resolve<BlindBox>>('/blindbox/info', { blind_id });
};
export const delBlindBox = function (blind_id: string) {
  return Server.post<Resolve<boolean>>('/blindbox/delete', { blind_id });
};

export const updateBlindBoxState = function (blind_id: string, state: 'onsale' | 'offsale') {
  return Server.post<Resolve<boolean>>('/blindbox/state/update', { blind_id, state });
};
