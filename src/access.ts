/**
 * @name: access.ts
 * @user: cfj
 * @date: 2022/1/24 15:56
 */

import type { IUserInfo } from '@/services/user/login';

export default function (initialState: { currentUser: IUserInfo }) {
  const { role } = initialState.currentUser || {};
  return {
    admin: role === 'admin',
    staff: role === 'staff',
    // TODO 为了年前上的阉割功能 临时增加的权限
    castrated: false,
  };
}
