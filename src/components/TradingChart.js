import React from 'react';
import { AdvancedChart } from 'react-tradingview-embed';
import { globalProduct, globalAsset } from '../state';
import { useRecoilValue } from 'recoil';


export default function TradingChart() {
  const getBeforeDotValue = (inputString) => {
    // Check if the input string is not null and contains a dot
    if (inputString && inputString.includes('.')) {
      // Use split to get the part before the dot
      return inputString.split('.')[0];
    } else {
      // If there is no dot or the input string is null, return the original string
      return inputString;
    }
  };
  const symbol = useRecoilValue(globalAsset);
  console.log("symbol in trading chart",symbol);
  return (
    <>
      <div className="main-chart mb15">
        <AdvancedChart
          widgetProps={{
            theme: 'light',
            symbol:getBeforeDotValue(symbol),
            allow_symbol_change: true,
            toolbar_bg: '#fff',
            height: 550,
          }}
        />
      </div>
    </>
  );
}
