import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isLoggedInState } from '../state';
import { useRecoilValue } from 'recoil';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const isLoggedIn = useRecoilValue(isLoggedInState);
    console.log('isLoggedIn:', isLoggedIn); // Log the isLoggedIn state
    return (
      <Route
        {...rest}
        render={(props) =>
          isLoggedIn ? (
            <Component {...props} />
          ) : (
            <Redirect to="/" />
          )
        }
      />
    );
  };
  export default PrivateRoute;