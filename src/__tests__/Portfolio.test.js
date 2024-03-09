/* eslint-disable testing-library/no-debugging-utils */
/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import React from "react";
import {
  render,
  act,
  waitFor,
  screen,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"; // for extra matchers
import { RecoilRoot } from "recoil"; // Import RecoilRoot for testing Recoil state
import { BrowserRouter as Router } from "react-router-dom";
import HistoryOrder from "../components/HistoryOrder";
// Mock the utility method
import { formatValue, formatTickerValue, formatPLValue } from "../utility";
import { SETTING } from "../config";
import { userState } from "../state";

jest.setTimeout(60000);

// Mock API response data
const mockPortfolioData = {
  code: 200,
  data: {
    available_cash: 1477.4599999999998,
    portfolio: [
      {
        asset_type: "Stock (Equity)",
        invested_amount: 103.959999084473,
        name: "Alcoa Corporation",
        quantity: 4,
        symbol: "AA",
      },
      {
        asset_type: "Forex",
        invested_amount: 5864.03004821777,
        name: "Apple Inc.",
        quantity: 8,
        symbol: "AAPL",
      },
      {
        asset_type: "Stock (Equity)",
        invested_amount: 5863.85004821777,
        name: "Apple Inc.",
        quantity: 20,
        symbol: "AAPL",
      },
      {
        asset_type: "Forex",
        invested_amount: 10.9400000286102,
        name: "EUR/USD",
        quantity: 2,
        symbol: "EURUSD",
      },
      {
        asset_type: "Stock (Equity)",
        invested_amount: 104.999995231628,
        name: "MiNK Therapeutics, Inc.",
        quantity: 100,
        symbol: "INKT",
      },
      {
        asset_type: "Stock (Equity)",
        invested_amount: 795.68,
        name: "Meta Platforms, Inc.",
        quantity: 1,
        symbol: "META",
      },
      {
        asset_type: "Stock (Equity)",
        invested_amount: 731.859985351562,
        name: "Microsoft Corporation",
        quantity: 2,
        symbol: "MSFT",
      },
      {
        asset_type: "Index",
        invested_amount: 109.480003356934,
        name: "Nasdaq, Inc.",
        quantity: 2,
        symbol: "NDAQ",
      },
      {
        asset_type: "Stock (Equity)",
        invested_amount: 1219.19998168945,
        name: "Tesla, Inc.",
        quantity: 5,
        symbol: "TSLA",
      },
    ],
    starting_amt: 10000,
    total_invested_amount: 14804.000061178196,
    username: "ss",
  },
  message: "Success",
};

// Mock the utility method
jest.mock("../utility", () => ({
  ...jest.requireActual("../utility"),
  fetchMarketPriceForSymbol: jest.fn(),
}));

global.fetch = jest.fn();

describe("HistoryOrder Component", () => {
  // Mock setup before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("fetches and displays data when update flag is true", async () => {

    const mockFetchMarketPriceForSymbol =
      require("../utility").fetchMarketPriceForSymbol;

    const mockUserState = {
      access_token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcwNDIwNTkwNSwianRpIjoiNjI5ZTYxZDctMTRkZS00MDM1LTk5NzYtZWQ3ZTM5MWMxMWJjIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6eyJpZCI6MSwidXNlcm5hbWUiOiJzcyJ9LCJuYmYiOjE3MDQyMDU5MDUsImNzcmYiOiJlN2Y4MmRkNy1kODAzLTQ1MGItOTgzMy04YWRlM2JiODY5ZmEiLCJleHAiOjE3MDQyMDY4MDV9.AnB3rurYNbZAFjjSsV-ilivl8W8JIK1RejCotor6zgk",
      email: "ss@test.com",
      user_id: 1,
      username: "ss",
      portfolio: [
        "aa",
        "aapl",
        "aapl",
        "eurusd",
        "goog",
        "inkt",
        "msft",
        "ndaq",
        "tsla",
      ],
    };
    // Mock the fetch function
    const mockResponse = {
      status: 200,
      json: jest.fn().mockResolvedValueOnce(mockPortfolioData),
    };
    global.fetch = jest.fn().mockResolvedValueOnce(mockResponse);

    // Mock the implementation of fetchMarketPriceForSymbol
    mockFetchMarketPriceForSymbol.mockImplementation((symbol, callback) => {
      // Call the callback with the mocked newPrice
      callback({
        [symbol.symbol?.toLowerCase()]: {
          s: symbol.symbol,
          ap: 150,
          bp: 150,
          lp: 150,
        },
      });
    });

    console.log("Before rendering component");
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      render(
        <RecoilRoot
          initializeState={(snapshot) => snapshot.set(userState, mockUserState)}
        >
          <Router>
            <HistoryOrder />
          </Router>
        </RecoilRoot>
      );
      console.log("After rendering component");
    });
    // Wait for the component to finish rendering
    await waitFor(
      async () => {

        screen.debug();
        expect(screen.queryByTestId("loading-indicator")).toBeNull();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(screen.getByText("Opening Balance")).toBeInTheDocument();

        // Expect ticker data to be present in the document
        expect(screen.getByText("META")).toBeInTheDocument();

        // Expect starting balance to be set
        expect(
          screen.getByText(
            formatValue(mockPortfolioData.data.starting_amt, SETTING.CURRENCY)
          )
        ).toBeInTheDocument();

        // Expect available cash to be set
        expect(
          screen.getByText(
            formatValue(mockPortfolioData.data.available_cash, SETTING.CURRENCY)
          )
        ).toBeInTheDocument();

        // Expect gross invested value to be set
        expect(
          screen.getByText(
            formatValue(
              mockPortfolioData.data.total_invested_amount,
              SETTING.CURRENCY
            )
          )
        ).toBeInTheDocument();

        const currentVal = mockPortfolioData.data.portfolio.reduce(
          (total, ticker) => (total += ticker.quantity * 150),
          0
        );

        // Expect current value to be set
        expect(
          screen.getByText(formatTickerValue(currentVal, SETTING.CURRENCY))
        ).toBeInTheDocument();

        // Expect profit/loss value to be set
        expect(
          screen.getByText(
            formatPLValue(
              (mockPortfolioData.data.available_cash + currentVal) - mockPortfolioData.data.starting_amt ,
              SETTING.CURRENCY
            )
          )
        ).toBeInTheDocument();
      }
    );
  });
});
