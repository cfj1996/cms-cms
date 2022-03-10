import type { PageParams, PageResolve, Resolve } from '..';
import Server from '..';
import type { Tag } from '@/services/nft/tag';

export enum NftType {
  collection = '藏品',
  collectionEntity = '藏品+实体',
}

export const purchaseEnum = [
  { value: true, label: '开启' },
  { value: false, label: '关闭' },
];
export const canSaleEnum = [
  { value: true, label: '开启' },
  { value: false, label: '关闭' },
];
// TODO 为了年前上的阉割功能 临时增加的权限
export const nftTypeEnum = {
  collection: {
    text: '藏品',
  },
  collectionEntity: {
    text: '藏品+实体',
    disabled: true,
  },
};

export enum AssetsType {
  'image' = '图片',
  'video' = '视频',
}

export enum NftState {
  draf = '草稿',
  onsale = '上架',
  offsale = '下架',
}

export const nftStateEnum = {
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

export interface INft extends IAddNft {
  id: string;
  state: string;
  category_name: string;
  is_purchase: boolean;
  limit_number: number;
  sale: number;
  desc: string;
  heat: number;
  interval_time: number;
  created_at: string;
  updated_at: string;
  tag_names: string[];
}

export interface AddSku {
  nft_id: string;
  price: string;
  attribute: string;
  images: string[];
  amount: number;
}

export interface Sku extends AddSku {
  id: string;
  is_purchase: boolean;
  limit_number: number;
  interval_time: number;
  created_at: string;
  updated_at: string;
}

export interface INftReq {
  state?: keyof typeof nftStateEnum;
  is_can_sale?: boolean;
}

export enum NftLevel {
  'B' = 'B',
  'A' = 'A',
  'S' = 'S ',
  'SS' = 'SS',
  'SSS' = 'SSS',
}

/**
 * 获取nft列表
 * @param params
 */
export const getNftList = function (params: PageParams & INftReq) {
  return Server.get<PageResolve<INft>>('/nft/search', params).then((res) => {
    return {
      success: res.code === 'ok',
      data: res.data.list,
      total: res.data.total,
    };
  });
};

export interface IAddNft {
  category_id: string;
  name: string;
  type: string;
  title: string;
  desc: string;
  transaction_hash: string;
  images: string[];
  token_id?: number;
  total: number;
  price: string;
  start_time: Date;
  end_time: Date;
  available_number: number;
  is_can_sale: boolean;
  level: keyof typeof NftLevel;
  material_type: keyof typeof AssetsType;
}

export interface UpdateNft {
  title: string;
  nft_id: string;
  price?: string;
  name?: string;
  is_can_sale?: boolean;
  available_number?: number;
  start_time: Date;
  end_time: Date;
  desc?: string;
  level: keyof typeof NftLevel;
}

/**
 * 新增Nft
 * @param data
 */
export const addNft = function (data: Omit<IAddNft, 'category_id' | 'total'>) {
  return Server.post<Resolve>('/nft/create', data);
};

/**
 * 修改nft基本信息
 * @param data
 */
export const updateNft = function (data: UpdateNft) {
  return Server.post<Resolve<boolean>>(`/nft/edit`, data);
};
/**
 * 修改nft状态
 * @param id
 * @param state
 */
export const updateNftState = function (id: string, state: string) {
  return Server.post<Resolve>(`/nft/state/update`, { nft_id: id, state: state });
};
/**
 * 修改nft 热度
 * @param id
 * @param heat
 */
export const updateNftWeight = function (id: string, heat: number) {
  return Server.put(`/nft/${id}`, { heat: heat });
};

/**
 * 修改nft 热门搜索关键词
 * @param id
 * @param keyWords
 */
export const updateNftKeyWords = function (id: string, keyWords: string[]) {
  return Server.put(`/nft/${id}`, { keyWords: keyWords });
};
/**
 * 获取藏品详情
 * @param id
 */
export const getNft = function (id: string) {
  return Server.get<Resolve<INft>>('/nft/info', { nft_id: id });
};
/**
 * 获取合约地址
 */
export const getContractAddress = function (issuer_id: string) {
  return Server.get<Resolve<{ contract_address: string }>>('/nft/contract/deploy', { issuer_id });
};

/**
 * 铸币
 */
export interface IPlatform {
  category_id: string;
  total: number;
}

export const platform = function (data: IPlatform) {
  return Server.post<Resolve<{ transaction_hash: string; token_id: number }>>(
    '/nft/mint/platform',
    data,
  );
};

export const getSkuList = function (params: PageParams & { nft_id: string; attribute?: string }) {
  return Server.get<PageResolve<Sku>>('/sku/search', params).then((res) => ({
    success: res.code === 'ok',
    data: res.data.list,
    total: res.data.total,
  }));
};

export const addSku = function (data: AddSku) {
  return Server.post<Resolve<boolean>>('/sku/create', data);
};

export const delSku = function (id: string) {
  return Server.post<Resolve<boolean>>('/sku/delete', { sku_id: id });
};

export interface Purchase {
  is_purchase: boolean;
  limit_number: number;
  interval_time: number;
}

export const editNftPurchase = function (data: Purchase & { nft_id: string }) {
  return Server.post<Resolve<boolean>>('/nft/purchase', data);
};

export const skuNftPurchase = function (data: Purchase & { sku_id: string }) {
  return Server.post<Resolve<boolean>>('/sku/purchase', data);
};
export const delNft = function (id: string) {
  return Server.post<Resolve>('/nft/delete', { nft_id: id });
};
export const appendTotal = function (data: { nft_id: string; append_total: number }) {
  return Server.post<Resolve<boolean>>('/nft/mint/append', data);
};
export const updateNftSell = function (id: string, state: boolean) {
  return Server.post<Resolve<boolean>>('/nft/cansale/update', { nft_id: id, is_can_sale: state });
};

export const addNftTag = (data: { nft_id: string; tag_id: string }) => {
  return Server.post<Resolve>('/nfttag/add', data);
};
export const delNftTag = (nft_tag_id: string) => {
  return Server.post<Resolve>('/nfttag/delete', { nft_tag_id });
};
export const getNftTags = (id: string) => {
  return Server.get<PageResolve<Tag>>('/nfttag/info?nft_id=' + id);
};
