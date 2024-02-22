import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // for extra matchers
import { RecoilRoot } from 'recoil'; // Import RecoilRoot for testing Recoil state



import AssetSelection from '../components/MarketPairs';

describe('Assest  Selection', () => {
const mockData=[
  {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "price": 185.85,
    "changesPercentage": -0.5405,
    "change": -1.01,
    "dayLow": 179.25,
    "dayHigh": 187.32,
    "yearHigh": 199.62,
    "yearLow": 143.9,
    "marketCap": 2873594115000,
    "priceAvg50": 190.7624,
    "priceAvg200": 182.395,
    "exchange": "NASDAQ",
    "volume": 100565746,
    "avgVolume": 53759957,
    "open": 179.86,
    "previousClose": 186.86,
    "eps": 6.13,
    "pe": 30.32,
    "earningsAnnouncement": "2024-05-02T10:59:00.000+0000",
    "sharesOutstanding": 15461900000,
    "timestamp": 1706907601
}
];
it('should handle tab change and update the table with new data', async () => {
    const mockResponse = {
      status: 200,
      json: jest.fn().mockResolvedValueOnce(mockData),
    };
    global.fetch = jest.fn().mockResolvedValueOnce(mockResponse);

    render(
        <RecoilRoot>
          <AssetSelection />
        </RecoilRoot>
      );


    await waitFor(() => {
      expect(screen.getByText("AAPL")).toBeInTheDocument();

    });


  });
});




