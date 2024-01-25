import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userState, isLoggedInState } from "../state";
import { setLoggedIn, setUserData } from "../auth";
import FlashMessage from "../components/FlashMessage";
import { BASE_URL, ENDPOINT } from "../config";
import { BeatLoader } from "react-spinners";


const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsChecked: false,
  });
  const [errors, setErrors] = useState({});
  const setUserState = useSetRecoilState(userState); // Recoil hook to set user information
  const setLoggedInState = useSetRecoilState(isLoggedInState); // Recoil hook to set user isLoggedInState
  const history = useHistory();
  const [showMessage, setShowMessage] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear the specific field error when the user starts typing again
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Omitting confirmPassword and termsChecked from formData before making the API call
    const { confirmPassword, termsChecked, ...finalData } = formData;
    // Basic client-side validation
    const validationErrors = {};
    if (!formData.username.trim()) {
      validationErrors.username = "Full Name is required";
    }
    if (!formData.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = "Invalid email address";
    }
    if (!formData.password.trim()) {
      validationErrors.password = "Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.termsChecked) {
      validationErrors.termsChecked = "Please accept Terms and Conditions";
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        setLoading(true);
        const response = await fetch(BASE_URL + ENDPOINT.REGISTER, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalData),
        });

        if (response.status===200) {
          const userData = await response.json();
          // Save user data to Recoil state for future use as well in local storage
          setUserData(userData.data, setUserState);
          setLoggedIn(true, setLoggedInState);
          history.push("/dashboard");
        } else {
          const resData = await response.json();
          throw new Error(resData.message);
        }
      } catch (error) {
         setErrorMsg(error.message);
        // Handle network errors or other exceptions
      }
      finally {
        setLoading(false);
      }
    }
  };


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
        {errorMsg && (
          <FlashMessage
            alertClass="alert-danger"
            message={errorMsg}
            onClose={() => setErrorMsg("")}
          />
        )}
        <div className="form-access my-auto">
          <form onSubmit={handleSubmit}>
            <span>Create Account</span>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Full Name"
                value={formData.username}
                name="username"
                onChange={handleChange}
              />
              {errors.username && <p className="red">{errors.username}</p>}
            </div>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                placeholder="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="red">{errors.email}</p>}
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="red">{errors.password}</p>}
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="red">{errors.confirmPassword}</p>
              )}
            </div>
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="form-checkbox"
                name="termsChecked"
                checked={formData.termsChecked}
                onChange={handleChange}
              />
              <label className="custom-control-label" htmlFor="form-checkbox">
                I agree to the{" "}
                <Link to="/terms-and-conditions">Terms & Conditions</Link>
              </label>
              {errors.termsChecked && (
                <p className="red">{errors.termsChecked}</p>
              )}
            </div>
            <button type="submit" className="btn btn-primary">
            {loading ? (
                <BeatLoader style={{ display: "block", margin: "0 auto",fontSize:"16px" }} color={"#ffffff"} loading={loading} size={8} />
              ) : (
                "Create Account"
              )}

            </button>
          </form>
          <h2>
            Already have an account?
            <Link to="/"> Sign in here</Link>
          </h2>
        </div>
      </div>
    </>
  );
};

export default Signup;
