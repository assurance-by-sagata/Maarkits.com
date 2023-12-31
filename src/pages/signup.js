import React, { useState } from 'react';
import { Link ,useHistory} from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { userState,isLoggedInState } from '../state'

const Signup = () => {

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsChecked: false,
  });
  const [errors, setErrors] = useState({});
  const setUser = useSetRecoilState(userState); // Recoil hook to set user information
  const setLoggedIn = useSetRecoilState(isLoggedInState); // Recoil hook to set user isLoggedInState
  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear the specific field error when the user starts typing again
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    const validationErrors = {};
    if (!formData.username.trim()) {
      validationErrors.username = 'Full Name is required';
    }
    if (!formData.email.trim()) {
      validationErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = 'Invalid email address';
    }
    if (!formData.password.trim()) {
      validationErrors.password = 'Password is required';
    } else if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.termsChecked) {
      validationErrors.termsChecked = 'Please accept Terms and Conditions';
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const response = await fetch('http://localhost:8000/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const userData = await response.json();
          // Save user data to Recoil state for future use
          setUser(userData);
          setLoggedIn(true);
          console.log('Registration successfull');
          history.push('/dashboard')
        } else {
          // Registration failed, handle error scenario
          const errorData = await response.json();
          console.error('Registration failed:', errorData.message);
          // Handle error messages or display to the user
        }
      } catch (error) {
        console.error('Error during registration:', error);
        // Handle network errors or other exceptions
      }
    }
  };
  return (
    <>
      <div className="vh-100 d-flex justify-content-center">
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
              {errors.confirmPassword && <p className="red">{errors.confirmPassword}</p>}
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
                I agree to the{' '}
                <Link to="/terms-and-conditions">Terms & Conditions</Link>
              </label>
              {errors.termsChecked && <p className="red" >{errors.termsChecked}</p>}
            </div>
            <button type="submit" className="btn btn-primary">
              Create Account
            </button>
          </form>
          <h2>
            Already have an account?
            <Link to="/login"> Sign in here</Link>
          </h2>
        </div>
      </div>
    </>
  );
}

export default Signup;