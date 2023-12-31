import { atom } from 'recoil';
import { isLoggedIn,getUserData } from './auth';

export const userState = atom({
  key: 'userState',
  default: getUserData,
});


export const isLoggedInState = atom({
    key: 'isLoggedInState',
    default: isLoggedIn
  });