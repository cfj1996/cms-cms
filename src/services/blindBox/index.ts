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

export const blindLikNftLevel = [
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'S', label: 'S' },
  { value: 'SS', label: 'SS' },
  { value: 'SSS', label: 'SSS' },
];
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
}

export interface EditBlindBox extends AddBlindBox {
  blind_id: string;
}

export const addBlindBox = function (data: AddBlindBox) {
  return Server.post<Resolve<boolean>>('/blindbox/create', data);
};
export const getBlindBoxPage = function (
  params: PageParams & { blind_name?: string; state?: keyof typeof blindStateMenu },
) {
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

export interface BlindLinkNfts extends AddBlindLinkNft {
  id: string;
  nft_name: string;
  sale_amount: number;
  created_at: string;
  updated_at: string;
}

export interface AddBlindLinkNft {
  blind_box_id: string;
  nft_id: string;
  amount: number;
  weights: number;
  level: string;
  probability: number;
}

export interface EditBlindLinkNft {
  amount: number;
  weights: number;
  probability: number;
  level: string;
  blindcollection_id: string;
}

export const addBlindLinkNft = function (data: AddBlindLinkNft) {
  return Server.post<Resolve<boolean>>('/blindboxcollection/create', data);
};

export const editBlindLinkNft = function (data: EditBlindLinkNft) {
  return Server.post<Resolve<boolean>>('/blindboxcollection/edit', data);
};

export const delBlindLinkNft = function (blindcollection_id: string) {
  return Server.post<Resolve<boolean>>('/blindboxcollection/delete', { blindcollection_id });
};

export const getBlindLinkNfts = function (params: PageParams & { blind_box_id: string }) {
  return Server.get<PageResolve<BlindLinkNfts>>('/blindboxcollection/search', params).then(
    (res) => ({
      success: res.code === 'ok',
      data: res.data.list,
      total: res.data.total,
    }),
  );
};
