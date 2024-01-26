import React, { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { Link } from "react-router-dom";
import { fetchStremDataForSymbol } from "../utility";
const OtpVerify = () => {
  const symbol = "eurusd"; // Replace with your list of symbols
  const apiKey = "pranav.chaudhary@sagataltd.io";
  // const [sendMessage, lastMessage, readyState] = useWebSocket(
  //   "wss://demos.kaazing.com/echo"
  // );
  useEffect(() => {
    fetchStremDataForSymbol({symbol:'aapl'});
  }, []);

  return (
    <>

      <div className="vh-100 d-flex justify-content-center">
        <div className="form-access my-auto">
          <form>
            <span>Locked</span>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              required
            />
            <button type="submit" className="btn btn-primary">
              Unlock
            </button>
            <h2>
              No luck? <Link to="/reset">Reset Password</Link>
            </h2>
          </form>
        </div>
      </div>
    </>
  );
};
export default OtpVerify;
