import React from 'react';
import Layout from '../components/Layout';
import { Switch, Route } from 'react-router-dom';
import Exchange from '../pages/exchange';
import Profile from './profile';
import Wallet from './wallet';
import Settings from './settings';
import Login from './login';
import Reset from './reset';
import OtpVerify from './otp-verify';
import OtpNumber from './otp-number';
import Lock from './lock';
import TermsAndConditions from './terms-and-conditions';
import NewsDetails from './news-details';
import Signup from './signup';
import Notfound from './notfound';
import PrivateRoute from '../components/PrivateRoute'
import UnauthorisedRoute from '../components/UnauthorisedRoute'
export default function index() {
  return (
    <>
      <Switch>
          <UnauthorisedRoute exact path="/" component={Login}></UnauthorisedRoute>
          <UnauthorisedRoute path="/signup" component={Signup}></UnauthorisedRoute>
          <PrivateRoute path="/">
            <Layout>
              <PrivateRoute exact path="/dashboard" component={Exchange}></PrivateRoute>
              <PrivateRoute exact path="/profile" component={Profile}></PrivateRoute>
              <PrivateRoute exact path="/wallet" component={Wallet}></PrivateRoute>
              <PrivateRoute exact path="/settings" component={Settings}></PrivateRoute>
              <PrivateRoute exact path="/reset" component={Reset}></PrivateRoute>
              <PrivateRoute exact path="/otp-verify" component={OtpVerify}></PrivateRoute>
              <PrivateRoute exact path="/otp-number" component={OtpNumber}></PrivateRoute>
              <PrivateRoute exact path="/lock" component={Lock}></PrivateRoute>
              <PrivateRoute exact path="/terms-and-conditions" component={TermsAndConditions}></PrivateRoute>
              <PrivateRoute exact path="/news-details" component={NewsDetails}></PrivateRoute>
              <PrivateRoute exact path="/notfound" component={Notfound}></PrivateRoute>
            </Layout>
          </PrivateRoute>
      </Switch>
    </>
  );
}
