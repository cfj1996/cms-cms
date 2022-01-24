/**
 * @name: access.ts
 * @user: cfj
 * @date: 2022/1/24 15:56
 */

import type { IUserInfo } from '@/services/user/login';

export default function (initialState: { currentUser: IUserInfo }) {
  const { role } = initialState.currentUser || {};
  console.log('access', initialState);
  return {
    admin: role === 'admin',
    staff: role === 'staff',
  };
}
