import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // for extra matchers
import { RecoilRoot } from 'recoil'; // Import RecoilRoot for testing Recoil state
import { BrowserRouter as Router } from 'react-router-dom';
import { BASE_URL, ENDPOINT,  } from "../config";

import Signup from '../pages/signup';

// Mock the useHistory hook
const mockPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockPush,
  }),
}));
// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      code: 100,
      data: {
        access_token: 'mocked-access-token',
        user_id: 1,
        username: 'John Doe',
      },
      message: 'Success',
    }),
    status: 200,
  })
);

describe('Signup Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders the Signup component', () => {
    render(
        <RecoilRoot>
          <Router>
            <Signup />
          </Router>
        </RecoilRoot>
      );
    // Your existing rendering tests can go here
  });

  it('submits the form successfully', async () => {
    render(
        <RecoilRoot>
          <Router>
            <Signup />
          </Router>
        </RecoilRoot>
      );

    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email Address'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByLabelText('I agree to the Terms & Conditions'));

    // Mock the API call
    //fetch.mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve({ data: {} }), status: 200 }));
    const expectedApiResponse = {
        code: 200,
        data: {
          access_token: 'mocked-access-token',
          user_id: 1,
          username: 'John Doe',
        },
        message: 'Success',
    };
    fetch.mockImplementationOnce(() => Promise.resolve({
        json: () => Promise.resolve(expectedApiResponse),
        status: 200,
      }));
    // Simulate form submission
    fireEvent.submit(screen.getByRole('button', { name: 'Create Account' }));

    // Wait for the async operations to finish
    await waitFor(() => {
       expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    expect(fetch).toHaveBeenCalledWith(BASE_URL + ENDPOINT.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: 'John Doe',
            email: 'john.doe@example.com',
            password: 'password123',

        }),
      });

  });


});