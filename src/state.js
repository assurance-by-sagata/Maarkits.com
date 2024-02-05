import { atom } from 'recoil';
import { isLoggedIn,getUserData } from './auth';

export const userState = atom({
  key: 'userState',
  default: getUserData(),
});


export const isLoggedInState = atom({
    key: 'isLoggedInState',
    default: isLoggedIn()
});
export const flashMsg = atom({
  key: 'flashMsg',
  default: null
});
export const globalProduct = atom({
  key: 'globalProduct',
  default: null
});
export const globalAsset = atom({
  key: 'globalAsset',
  default: null
});
export const portfolioState = atom({
  key: 'portfolioState',
  default: true
});

export const socketData = atom({
  key: 'socketData',
  default: {}
});