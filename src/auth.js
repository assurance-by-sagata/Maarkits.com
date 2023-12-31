// Auth.js - Handles authentication status and user data using localStorage
  export const setLoggedIn = (loggedIn, setLoggedInState) => {
    localStorage.setItem('isLoggedIn', loggedIn.toString());
    setLoggedInState(loggedIn);
  };

  export const clearUserDataAndLogout = (setLoggedInState, setUserDataState) => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    setLoggedInState(false);
    setUserDataState(null);
  };

  export const setUserData = (userData, setUserDataState) => {
    localStorage.setItem('userData', JSON.stringify(userData));
    setUserDataState(userData);
  };

  export const isLoggedIn = () => {
    return localStorage.getItem('isLoggedIn') === 'true';
  };

  export const getUserData = () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  };
