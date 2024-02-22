/* eslint-disable testing-library/no-debugging-utils */
import React from "react";
import {
  render,
  waitFor,
  screen,
  fireEvent,
  act,
} from "@testing-library/react";
import { RecoilRoot } from "recoil"; // Import RecoilRoot for testing Recoil state
import { userState } from "../state";
import "@testing-library/jest-dom/extend-expect"; // for extra matchers
import AssetSelection from "../components/MarketPairs";

describe("Reload the Page after market close", () => {
  const mockData = [
    {
      symbol: "AAPL",
      price: 185.85,
      exchange: "NASDAQ",
      previousClose: 186.86,
    },
    {
      symbol: "GOOG",
      price: 200.16,
      exchange: "NASDAQ",
      previousClose: 199.86,
    },
  ];

  const userData = {
    access_token: "dummy-token",
    email: "ss@test.com",
    user_id: 1,
    username: "ss",
    portfolio: ["aa", "aapl"],
  };
  // Mocking the setTimeout function to control time in tests
  jest.useFakeTimers();

  it("should reload the page if the market is closed", async () => {
    const mockResponse = {
        status: 200,
        json: jest.fn().mockResolvedValueOnce(mockData),
      };
    global.fetch = jest.fn().mockResolvedValueOnce(mockResponse);
    // Mock the Date object to control the current time
    const originalDate = global.Date;
    global.Date = jest.fn(() => new originalDate("2024-02-15T21:00:00Z")); // Set the mock date to 09:00 PM UTC
    // Convert current time to UTC for comparison

    const reloadTime = 60000; // 60 seconds or one minutes
    render(
      <RecoilRoot
        initializeState={(snapshot) => snapshot.set(userState, userData)}
      >
        <AssetSelection />
      </RecoilRoot>
    );
    // Fast-forward time to trigger the setInterval function
    act(() => {
      jest.advanceTimersByTime(reloadTime); // Advance 1 minute (marketClosingTime is checked every 60 seconds)
    });
    //check the last price
    await waitFor(() => {
        expect(screen.getByText("$186.86000")).toBeInTheDocument();
    });

     // Fast-forward time to trigger the clearInterval function (component unmounting)
     act(() => {
        jest.runOnlyPendingTimers();
      });
  });
});
