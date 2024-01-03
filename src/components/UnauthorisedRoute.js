import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isLoggedInState } from '../state';
import { useRecoilValue } from 'recoil';

const UnauthorisedRoute = ({ component: Component, ...rest }) => {
    const isLoggedIn = useRecoilValue(isLoggedInState);
    return (
      <Route
        {...rest}
        render={(props) =>
          isLoggedIn ? (
            <Redirect to="/dashboard" />
          ) : (
            <Component {...props} />
          )
        }
      />
    );
  };
  export default UnauthorisedRoute;