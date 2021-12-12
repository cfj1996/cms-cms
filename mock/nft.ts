/**
 * @name: nft
 * @user: cfj
 * @date: 2021/12/12 13:50
 */
import { mock, Random } from 'mockjs';

function createArray(size: number) {
  return new Array(size).fill(1).map(() => ({
    id: mock('@guid'),
    categoryTitle: Random.title(3, 8),
    categoryDesc: Random.word(100, 300),
    createAt: Random.datetime(),
    updateAt: Random.datetime(),
  }));
}

export default {
  'GET /API/nftTypes': {
    status: 200,
    success: true,
    total: 100,
    pageSize: 20,
    page: 1,
    data: createArray(20),
  },
  'POST /API/nftTypes': {
    status: 200,
    success: true,
    data: true,
  },
  'GET /API/nftTypes/*': {
    status: 200,
    success: true,
    data: {
      id: mock('@guid'),
      categoryTitle: Random.title(15, 30),
      categoryDesc: Random.word(100, 300),
      createAt: Random.datetime(),
      updateAt: Random.datetime(),
    },
  },
  'PUT /API/nftTypes/*': {
    status: 200,
    success: true,
    data: true,
  },
};
