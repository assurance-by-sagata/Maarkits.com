import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { isLoggedInState, userState } from "../state";
import FlashMessage from "../components/FlashMessage";
import { useSetRecoilState } from "recoil";
import { setLoggedIn, setUserData } from "../auth";
import { BASE_URL, ENDPOINT } from "../config";
import { BeatLoader } from "react-spinners";

const Login = () => {
  const history = useHistory();
  const setUserState = useSetRecoilState(userState); // Recoil hook to set user information
  const setLoggedInState = useSetRecoilState(isLoggedInState); // Recoil hook to set user isLoggedInState
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(BASE_URL + ENDPOINT.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password: password }),
      });
      if (response.status === 200) {
        const userData = await response.json();
        if (userData) {
          // Save user data to Recoil state for future use as well in local storage
          setUserData(userData.data, setUserState);
          setLoggedIn(true, setLoggedInState);
           history.push("/dashboard");
        }
      } else {
        const resData = await response.json();
        throw new Error(resData.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const [showMessage, setShowMessage] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");

  const handleCloseFlashMessage = () => {
    setShowMessage(false);
    setFlashMessage("");
  };

  return (
    <>
      <div className="container d-flex flex-column justify-content-center justify-content-center align-items-center">
        {showMessage && (
          <FlashMessage
            message={flashMessage}
            onClose={handleCloseFlashMessage}
            alertClass="alert-danger"
          />
        )}
        {error && (
          <FlashMessage
            alertClass="alert-danger"
            message={error}
            onClose={() => setError("")}
          />
        )}
        <div className="form-access my-auto clearfix">
          <form onSubmit={handleSubmit}>
            <span>Sign In</span>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                placeholder="Email Address"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="text-right">
              <Link to="/reset">Forgot Password?</Link>
            </div>
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="form-checkbox"
              />
              <label className="custom-control-label" htmlFor="form-checkbox">
                Remember me
              </label>
            </div>
            <button type="submit" className="btn btn-primary">
              {loading ? (
                <BeatLoader style={{ display: "block", margin: "0 auto",fontSize:"16px" }} color={"#ffffff"} loading={loading} size={8} />
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          <h2>
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </h2>
        </div>
      </div>
    </>
  );
};

export default Login;
