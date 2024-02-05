import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // for extra matchers
import { RecoilRoot } from 'recoil'; // Import RecoilRoot for testing Recoil state



import MarketNews from '../components/MarketNews';

describe('Assest  Selection', () => {
it('should handle tab change and update the table with new data', async () => {
    const mockResponse = {
      status: 200,
      json: jest.fn().mockResolvedValueOnce([
          {
            "publishedDate": "2024-02-03T12:00:09.000Z",
            "title": "Range MT4 Indicator",
            "image": "https://ep6nfv99uhg.exactdn.com/wp-content/uploads/2023/11/Range-MT4-Indicator.png",
            "site": "forexmt4indicators",
            "text": "In the ever-evolving landscape of forex trading, having the right tools at your disposal is crucial. One such tool that has gained prominence is the Range MT4 Indicator. In this article, we’ll delve into its intricacies, exploring how it works, its significance in trading, customization options, and strategies to maximize its potential. How Range MT4 […]...",
            "url": "https://www.forexmt4indicators.com/range-mt4-indicator/?utm_source=rss&utm_medium=rss&utm_campaign=range-mt4-indicator",
            "symbol": ""
        }
      ]),
    };
    global.fetch = jest.fn().mockResolvedValueOnce(mockResponse);

    render(
        <RecoilRoot>
          <MarketNews />
        </RecoilRoot>
      );


    await waitFor(() => {
      expect(screen.getByText("Range MT4 Indicator")).toBeInTheDocument();

    });


  });
});




