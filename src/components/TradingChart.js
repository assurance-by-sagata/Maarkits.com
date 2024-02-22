import React from 'react';
import { AdvancedChart } from 'react-tradingview-embed';
import { globalProduct, globalAsset, globalExchange } from '../state';
import {getBeforeDotValue} from '../utility';
import { useRecoilValue } from 'recoil';


export default function TradingChart() {

  const symbol = useRecoilValue(globalAsset);
  const exchange = useRecoilValue(globalExchange);
  console.log("symbol in trading chart",symbol);
  return (
    <>
      <div className="main-chart mb15">
        <AdvancedChart
          widgetProps={{
            theme: 'light',
            symbol: exchange+':'+getBeforeDotValue(symbol),
            allow_symbol_change: true,
            toolbar_bg: '#fff',
            height: 550,
          }}
        />
      </div>
    </>
  );
}
