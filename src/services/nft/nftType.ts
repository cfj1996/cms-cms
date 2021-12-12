import type { PageParams } from '..';
import Server from '..';

/**
 * @name: index
 * @user: cfj
 * @date: 2021/12/12 13:25
 */
export interface INftType {
  id: string;
  categoryTitle: string;
  categoryDesc: string;
  createAt: string;
  updateAt: string;
}
interface IGetTypeReq {
  categoryTitle: string;
  createStartTime: number;
  createEndTime: number;
  updateStartTime: number;
  updateEndTime: number;
}

/**
 * 获取nft 列表
 * @param params
 */
export const getNftTypeList = function (params: PageParams & IGetTypeReq) {
  return Server.get<INftType[]>('/nftTypes', params);
};

/**
 * 添加nft
 * @param data
 */
export interface IAddNftType {
  categoryTitle: string;
  categoryDesc: string;
}
export const addNftType = function (data: IAddNftType) {
  return Server.post<boolean>('/nftTypes', data);
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
