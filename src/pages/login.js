import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { isLoggedInState, userState } from "../state";
import { useRecoilValue } from "recoil";
import FlashMessage from "../components/FlashMessage";
import { useSetRecoilState } from "recoil";
import { setLoggedIn, setUserData } from "../auth";

const Login = () => {
  const history = useHistory();
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const userData = useRecoilValue(userState);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  console.log("isLoggedIn at signin:", isLoggedIn); // Log the isLoggedIn state
  console.log("userData at signin:", userData); // Log the isLoggedIn state
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8000/users?email=${username}&password=${password}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          //body: JSON.stringify({'username':username,'password':password}),
        }
      );

      if (response.ok) {
        const userData = await response.json();
        if (!userData.length ==0) {
          // Save user data to Recoil state for future use as well in local storage
          setUserData(userData, setUserState);
          setLoggedIn(true, setLoggedInState);
          console.log("Login successfull");
          history.push("/dashboard");
        } else {
          setError("Invalid credentials. Please try again.");
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };
  const [showMessage, setShowMessage] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");

  const handleCloseFlashMessage = () => {
    setShowMessage(false);
    setFlashMessage("");
  };
  const setUserState = useSetRecoilState(userState); // Recoil hook to set user information
  const setLoggedInState = useSetRecoilState(isLoggedInState); // Recoil hook to set user isLoggedInState

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
              Sign In
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
