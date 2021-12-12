/**
 * @name: nft
 * @user: cfj
 * @date: 2021/12/12 22:57
 */
import { mock, Random } from 'mockjs';

function createArray(size: number) {
  return new Array(size).fill(1).map(() =>
    mock({
      id: mock('@guid'),
      name: Random.title(2),
      title: Random.title(2),
      'serialNumber|100-100000': 110,
      categoryId: mock('@guid'),
      files: [Random.url(), Random.url()],
      price: 5000.22,
      'total|1-100': 100,
      'sale|1-100': 50,
      desc: Random.word(100),
      'heat|1-100': 100,
      blockChainMsg: Random.word(100),
      'state|+1': ['draft', 'onsale', 'offsale'],
      createAt: Random.datetime(),
      updateAt: Random.datetime(),
    }),
  );
}
export default {
  'GET /api/nft': {
    status: 200,
    success: true,
    total: 100,
    pageSize: 20,
    page: 1,
    data: createArray(20),
  },
  'POST /api/nft': {
    status: 200,
    success: true,
    data: true,
  },
  'PUT /api/nft/*': {
    status: 200,
    success: true,
    data: true,
  },
  'get /api/nft/*': {
    status: 200,
    success: true,
    data: createArray(1)[0],
  },
};
