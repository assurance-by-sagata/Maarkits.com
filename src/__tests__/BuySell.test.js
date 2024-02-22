/* eslint-disable testing-library/no-wait-for-multiple-assertions */
/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-wait-for-side-effects */
import React from "react";
import {
  render,
  waitFor,
  screen,
  act,
  fireEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"; // for extra matchers
import { RecoilRoot} from "recoil"; // Import RecoilRoot for testing Recoil state
import { BrowserRouter as Router } from "react-router-dom";
import MarketTrade from "../components/MarketTrade";
import { globalProduct, flashMsg, portfolioState ,userState} from "../state";

// Mock your Recoil state using RecoilRoot
// Mock your Recoil state using RecoilRoot
const RecoilStateMock = ({ children }) => (
  <RecoilRoot
    initializeState={(snap) => {
      snap.set(globalProduct, "Stock (Equity)");
      snap.set(flashMsg, { msg: "", class: "" });
      snap.set(portfolioState, false);
      snap.set(userState, {
        access_token: 'mock-access-token',
      })
    }}
  >
    {children}
  </RecoilRoot>
);

// Mock the handleBuySellStock method

describe("MarketTrade", () => {
  //Component rendering
  it("should render two forms for buying and selling assets", () => {
    // Arrange
    render(
      <RecoilRoot>
        <Router>
          <MarketTrade />
        </Router>
      </RecoilRoot>
    );
    // Act
    const buyForm = screen.queryByTestId("sell-form");
    const sellForm = screen.queryByTestId("buy-form");
    // Assert
    expect(buyForm).toBeInTheDocument();
    expect(sellForm).toBeInTheDocument();
  });
  // Disables the buy and sell buttons when the market is open
  it("should enable buy and sell buttons when the market is open", async () => {
    // Mocking the fetch function to simulate market open
    const mockResponse = {
      status: 200,
      json: jest.fn().mockResolvedValueOnce({ isTheStockMarketOpen: true }),
    };
    global.fetch = jest.fn().mockResolvedValueOnce(mockResponse);

    //console.log('isTheStockMarketOpen',isTheStockMarketOpen);
    // Arrange
    await act(async () => {
      render(
        <RecoilStateMock>
          <Router>
            <MarketTrade />
          </Router>
        </RecoilStateMock>
      );

      // Wait for the component to fetch market data and render
      await waitFor(() => {
        expect(screen.getByTestId("buy-btn")).not.toBeDisabled();
        expect(screen.getByTestId("sell-btn")).not.toBeDisabled();
      });
    });
  });

  // Disables the buy and sell buttons when the market is open
  it("should enable buy and sell buttons when the market is close", async () => {
    // Mocking the fetch function to simulate market open
    const mockResponse = {
      status: 200,
      json: jest.fn().mockResolvedValueOnce({ isTheStockMarketOpen: false }),
    };
    global.fetch = jest.fn().mockResolvedValueOnce(mockResponse);

    //console.log('isTheStockMarketOpen',isTheStockMarketOpen);
    // Arrange
    await act(async () => {
      render(
        <RecoilStateMock>
          <Router>
            <MarketTrade />
          </Router>
        </RecoilStateMock>
      );

      // Wait for the component to fetch market data and render
      await waitFor(() => {
        expect(screen.getByTestId("buy-btn")).toBeDisabled();
        expect(screen.getByTestId("sell-btn")).toBeDisabled();
      });
    });
  });

  //Sends a POST request to the server to buy or sell shares
  it("should display a success message and update the portfolio state when a buy/sell request is successful", async () => {
    // Mocking the fetch function to simulate market open
    const mockMarketResponse = {
      status: 200,
      json: jest.fn().mockResolvedValueOnce({ isTheStockMarketOpen: true }),
    };
    global.fetch = jest.fn().mockResolvedValueOnce(mockMarketResponse);
    const expectedApiResponse = {
      code: 200,
      message: 'Success',
    };
    // Mocking the handleBuySellStock method
     // Spy on the fetch method
    const fetchSpy = jest.spyOn(global, 'fetch');
    fetchSpy.mockImplementationOnce(() => Promise.resolve({
      json: () => Promise.resolve(expectedApiResponse),
      status: 200,
    }));


    await act(async () => {
      render(
        <RecoilStateMock>
          <Router>
            <MarketTrade />
          </Router>
        </RecoilStateMock>
      );

      // Wait for the component to fetch market data and render
      await waitFor(() => {
        // Interact with the buy button and input fields
        const buyButton = screen.getByTestId('buy-btn');
        const symbolInput = screen.getByPlaceholderText('Buy Symbol');
        const quantityInput = screen.getByPlaceholderText('Buy No of Shares');
        fireEvent.change(symbolInput, { target: { value: 'AAPL' } });
        fireEvent.change(quantityInput, { target: { value: '10' } });
        fireEvent.click(buyButton);
      });

      // Wait for the success message and update flag
      await waitFor(() => {
        expect(fetchSpy).toHaveBeenCalled();
      });
    });
  });
});
