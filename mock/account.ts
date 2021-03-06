/**
 * @name: account
 * @user: cfj
 * @date: 2021/12/11 21:32
 */
import { mock, Random } from 'mockjs';

function createArray(size: number) {
  return new Array(size).fill(1).map((i, k) => ({
    id: mock('@guid'),
    account: Random.name(),
    role: 'admin',
    isDisable: k % 2 === 1,
    createAt: Random.datetime(),
    updateAt: Random.datetime(),
  }));
}

export default {
  'GET /API/accounts': {
    status: 200,
    success: true,
    total: 100,
    pageSize: 20,
    page: 1,
    data: createArray(20),
  },
  'GET /API/accounts/*': {
    status: 200,
    success: true,
    data: {
      id: mock('@guid'),
      account: Random.name(),
      role: 'admin',
      isDisable: false,
      createAt: Random.datetime(),
      updateAt: Random.datetime(),
    },
  },
  'POST /API/accounts': {
    status: 200,
    success: true,
    data: true,
  },
  'PUT /API/accounts/*': {
    status: 200,
    success: true,
    data: true,
  },
  'DELETE /API/accounts/*': {
    status: 200,
    success: true,
    data: true,
  },
};
