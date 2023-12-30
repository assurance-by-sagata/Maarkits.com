import { atom } from 'recoil';

export const userState = atom({
  key: 'userState',
  default: null, // Initial value is null; it will be updated after successful registration
});


export const isLoggedInState = atom({
    key: 'isLoggedInState',
    default: false, // Initially the user is not logged in
  });