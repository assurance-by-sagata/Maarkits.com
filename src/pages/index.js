import React from 'react';
import Layout from '../components/Layout';
import { Switch, Route } from 'react-router-dom';
import Exchange from '../pages/exchange';
import Markets from '../pages/markets';
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
export default function index() {
  return (
    <>
      <Switch>
          <Route exact path="/" component={Login}></Route>
          <Route path="/signup" component={Signup}></Route>
          {/* <Route exact path="/login" component={Login} ></Route> */}
        <PrivateRoute path="/">
          <Layout>
            <PrivateRoute exact path="/dashboard" component={Exchange}>

            </PrivateRoute>
            <Route path="/markets">
              <Markets />
            </Route>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/wallet">
              <Wallet />
            </Route>
            <Route path="/settings">
              <Settings />
            </Route>
            <Route path="/reset">
              <Reset />
            </Route>
            <Route path="/otp-verify">
              <OtpVerify />
            </Route>
            <Route path="/otp-number">
              <OtpNumber />
            </Route>
            <Route path="/lock">
              <Lock />
            </Route>
            <Route path="/terms-and-conditions">
              <TermsAndConditions />
            </Route>
            <Route path="/news-details">
              <NewsDetails />
            </Route>
            <Route path="/notfound">
              <Notfound />
            </Route>
          </Layout>
        </PrivateRoute>
      </Switch>
    </>
  );
}
