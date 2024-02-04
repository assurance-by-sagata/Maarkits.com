import React from "react";
import { render, waitFor, screen ,act,fireEvent} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"; // for extra matchers
import { RecoilRoot,atom, useRecoilValue,useSetRecoilState } from "recoil"; // Import RecoilRoot for testing Recoil state
import { BrowserRouter as Router } from "react-router-dom";
import MarketTrade from "../components/MarketTrade";
import { globalProduct, flashMsg} from '../state';


// Mock your Recoil state using RecoilRoot
const RecoilStateMock = ({ children }) => (
  <RecoilRoot initializeState={(snap) => { snap.set(globalProduct, 'Stock (Equity)');  }}>
    {children}
  </RecoilRoot>
);


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
        < RecoilStateMock>
          <Router>
            <MarketTrade />
          </Router>
        </RecoilStateMock>
      );

      // Wait for the component to fetch market data and render
      await waitFor(() => {
       expect(screen.getByTestId('buy-btn')).not.toBeDisabled();
       expect(screen.getByTestId('sell-btn')).not.toBeDisabled();

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
         < RecoilStateMock>
           <Router>
             <MarketTrade />
           </Router>
         </RecoilStateMock>
       );

       // Wait for the component to fetch market data and render
       await waitFor(() => {
        expect(screen.getByTestId('buy-btn')).toBeDisabled();
        expect(screen.getByTestId('sell-btn')).toBeDisabled();

       });


     });
   });

  //Sends a POST request to the server to buy or sell shares
  it('should display a success message and update the portfolio state when a buy/sell request is successful', async () => {
    const mockResponse = {
      status: 200,
      json: jest.fn().mockResolvedValueOnce({ isTheStockMarketOpen: true }),
    };
    global.fetch = jest.fn().mockResolvedValueOnce(mockResponse);
    const setFlashMsg = jest.fn();
    const setUpdateFlag = jest.fn();
    render(

        <RecoilStateMock
          initializeState={(snapshot) =>
            snapshot.set(flashMsg, { msg: null, class: null })
          }
        >
          <Router>
            <MarketTrade />
          </Router>
        </RecoilStateMock>

    );
    const buyButton = screen.getByTestId('buy-btn');
    const symbolInput = screen.getByPlaceholderText('AAPL');
    const quantityInput = screen.getByPlaceholderText('No of Shares');
    fireEvent.change(symbolInput, { target: { value: 'AAPL' } });
    fireEvent.change(quantityInput, { target: { value: '10' } });
    fireEvent.click(buyButton);
    await waitFor(() => {
      expect(setFlashMsg).toHaveBeenCalledWith({
        msg: 'AAPL assest sussefully purchased',
        class: 'alert-success'
      });
      expect(setUpdateFlag).toHaveBeenCalled();
    });
  });

});
