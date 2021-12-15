import type { PageParams, PageResolve } from '..';
import Server from '..';

/**
 * @name: index
 * @user: cfj
 * @date: 2021/12/12 13:25
 */
export interface INftType {
  id: string;
  category_title: string;
  category_desc: string;
  create_at: string;
  update_at: string;
}
interface IGetTypeReq {
  categoryTitle: string;
  createStartTime: number;
  createEndTime: number;
  updateStartTime: number;
  updateEndTime: number;
}

/**
 * 获取所有nft类型
 */
export const getAllNftType = function () {
  return Server.get<INftType[]>('/nftTypes/all');
};

/**
 * 获取nft 列表
 * @param params
 */
export const getNftTypeList = function (params: PageParams & IGetTypeReq) {
  return Server.get<PageResolve<INftType>>('/nft/category/search', params).then((res) => {
    return {
      success: res.code === 'ok',
      data: res.data.list,
      total: res.data.total,
    };
  });
};

/**
 * 添加nft
 * @param data
 */
export interface IAddNftType {
  category_title: string;
  category_desc: string;
}
export const addNftType = function (data: IAddNftType) {
  return Server.post<boolean>('/nft/category/add', data);
};
/**
 * 获取单个nftType详情
 * @param id
 */
export const getNftType = function (id: string) {
  return Server.get<INftType>('/nftTypes/' + id);
};
/**
 * 修改nftType
 * @param id
 * @param data
 */
export const updateNftType = function (id: string, data: IAddNftType) {
  return Server.put<boolean>(`/nftTypes/${id}`, data);
};
