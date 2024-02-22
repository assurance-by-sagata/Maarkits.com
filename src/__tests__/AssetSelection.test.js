/* eslint-disable testing-library/no-debugging-utils */
/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import React from "react";
import { render, waitFor, screen ,fireEvent,act} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"; // for extra matchers
import { RecoilRoot } from "recoil"; // Import RecoilRoot for testing Recoil state
import { userState } from "../state";
import AssetSelection from "../components/MarketPairs";

describe("Assest  Selection", () => {
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
    }
  ];
  const serchMockData = [
    {
      symbol: "GOOG",
      price: 200.16,
      exchange: "NASDAQ",
      previousClose: 199.86,
    },
  ];
  const userData = {
    access_token:"dummy-token",
    email: "ss@test.com",
    user_id: 1,
    username: "ss",
    portfolio: ["aa","aapl"],
  };
  it("should fetch the data from loacl storage and update the table with new data", async () => {
    const mockResponse = {
      status: 200,
      json: jest.fn().mockResolvedValueOnce(mockData),
    };
    global.fetch = jest.fn().mockResolvedValueOnce(mockResponse);
    const userData = {
      access_token:"dummy-token",
      email: "ss@test.com",
      user_id: 1,
      username: "ss",
      portfolio: ["aa","aapl"],
    };
    render(
      <RecoilRoot
          initializeState={(snapshot) => snapshot.set(userState, userData)}
       >
        <AssetSelection />
      </RecoilRoot>
    );

    await waitFor(() => {

      expect(screen.getByText("AAPL")).toBeInTheDocument();
    });
  });
  it("should call api and update the table with new data", async () => {
    const mockResponse = {
      status: 200,
      json: jest.fn().mockResolvedValueOnce(mockData),
    };
    global.fetch = jest.fn().mockResolvedValueOnce(mockResponse);
    const userData = {
      access_token:"dummy-token",
      email: "ss@test.com",
      user_id: 1,
      username: "ss",
      portfolio: ["aa","aapl"],
    };
    render(
      <RecoilRoot
          initializeState={(snapshot) => snapshot.set(userState, userData)}
       >
        <AssetSelection />
      </RecoilRoot>
    );

    await waitFor(() => {

      expect(screen.getByText("AAPL")).toBeInTheDocument();
    });
  });
  it("should handle search input and filter the displayed assets accordingly", async () => {

    const mockResponse = {
      status: 200,
      json: jest.fn().mockResolvedValueOnce(mockData),
    };
    global.fetch = jest.fn().mockResolvedValueOnce(mockResponse);
    const fetchSpy = jest.spyOn(global, 'fetch');
    fetchSpy.mockImplementationOnce(() => Promise.resolve({
      json: () => Promise.resolve(serchMockData),
      status: 200,
    }));
    await act(async () => {
        render(
          <RecoilRoot
              initializeState={(snapshot) => snapshot.set(userState, userData)}
          >
            <AssetSelection />
          </RecoilRoot>
        );
      // Wait for the async operation to complete
        await waitFor(() => {
            // Trigger the search input change
          const searchInput = screen.getByPlaceholderText('Search');
          act(() => {
            fireEvent.change(searchInput, { target: { value: 'GOOG' } });
          });

        });
        await waitFor(() => {
          expect(fetchSpy).toHaveBeenCalledTimes(2);
          expect(screen.getByText('GOOG')).toBeInTheDocument();
          expect(screen.queryByText('AAPL')).not.toBeInTheDocument();
        });

    });
  });

});

