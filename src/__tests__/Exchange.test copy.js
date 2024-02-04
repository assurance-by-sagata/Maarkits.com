import React from "react";
import { render, waitFor, screen,act } from "@testing-library/react";
import HistoryOrder from "../components/HistoryOrder";
import { RecoilRoot } from "recoil"; // Import RecoilRoot for testing Recoil state
import { BrowserRouter as Router } from "react-router-dom";
describe("HistoryOrder component", () => {
  const mockUserData = {
    access_token:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcwNDIwNTkwNSwianRpIjoiNjI5ZTYxZDctMTRkZS00MDM1LTk5NzYtZWQ3ZTM5MWMxMWJjIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6eyJpZCI6MSwidXNlcm5hbWUiOiJzcyJ9LCJuYmYiOjE3MDQyMDU5MDUsImNzcmYiOiJlN2Y4MmRkNy1kODAzLTQ1MGItOTgzMy04YWRlM2JiODY5ZmEiLCJleHAiOjE3MDQyMDY4MDV9.AnB3rurYNbZAFjjSsV-ilivl8W8JIK1RejCotor6zgk", // Replace with a valid access token
  };

  const mockPortfolioData = {
    code: 200,
    data: {
      available_cash: 1477.46,
      portfolio: [
        {
          asset_type: "Stock (Equity)",
          invested_amount: 103.96,
          name: "Alcoa Corporation",
          quantity: 4,
          symbol: "AA",
        },
        {
          asset_type: "Forex",
          invested_amount: 5864.03,
          name: "Apple Inc.",
          quantity: 8,
          symbol: "AAPL",
        },
        {
          asset_type: "Stock (Equity)",
          invested_amount: 5863.85,
          name: "Apple Inc.",
          quantity: 20,
          symbol: "AAPL",
        },
        {
          asset_type: "Forex",
          invested_amount: 13.12,
          name: "EUR/USD",
          quantity: 2,
          symbol: "EURUSD",
        },
        // Add other portfolio items based on your data
      ],
      starting_amt: 10000.0,
      total_invested_amount: 14806.18,
      username: "ss",
    },
    message: "Success",
  };

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockPortfolioData),
        status: 200,
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders portfolio data and statistics correctly", async () => {
    await act(async () => {
      render(
        <RecoilRoot>
          <Router>
            <HistoryOrder />
          </Router>
        </RecoilRoot>
      );
      // Print the HTML content for debugging
      //console.log(screen.debug());

      // Wait for the fetch call to complete and the component to update
      await waitFor(() => {
        expect(screen.getByText("$10,000.00")).toBeInTheDocument();
      });

      // Check if loading spinner is not present
      expect(screen.queryByTestId("loading-spinner")).toBeNull();

      // Check if portfolio data is rendered correctly
      expect(screen.getByText("$10,000.00")).toBeInTheDocument();
      expect(screen.getByText("$2,477.46")).toBeInTheDocument();
      expect(screen.getByText("$14,806.18")).toBeInTheDocument();

      // Check if portfolio table is rendered correctly
      expect(screen.getAllByTestId("portfolio-row")).toHaveLength(
        mockPortfolioData.data.portfolio.length
      );

      // Add more specific assertions based on your component structure
      // For example: Check if the first row contains correct data

      // Check if the portfolio statistics are calculated correctly
      expect(screen.getByText("$7,319.75")).toBeInTheDocument();
      expect(screen.getByText("+$7,486.43")).toBeInTheDocument();
    });
  });
});
