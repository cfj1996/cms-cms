import { getValue, removeValue, setValue } from './storage';

const tokeKey = 'token';
export const setToken = function (value: string) {
  setValue(tokeKey, value, -1);
};
export const getToken = function () {
  return getValue(tokeKey);
};
export const removeToken = function () {
  removeValue(tokeKey);
};
