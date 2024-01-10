import HistoryOrder from "../components/HistoryOrder";
import MarketHistory from "../components/MarketHistory";
import MarketNews from "../components/MarketNews";
import MarketPairs from "../components/MarketPairs";
import MarketTrade from "../components/MarketTrade";
import OrderBook from "../components/OrderBook";
import TradingChart from "../components/TradingChart";
import TradingChartDark from "../components/TradingChartDark";
import { ThemeConsumer } from "../context/ThemeContext";
import {flashMsg } from "../state";
import { useRecoilValue ,useSetRecoilState} from "recoil";
import FlashMessage from "../components/FlashMessage";


const Exchange = () => {
  const flashMsgData = useRecoilValue(flashMsg);
  const setflashMsgData = useSetRecoilState(flashMsg); // Recoil hook to set flashMsg
  return (
    <>
      <div className="container-fluid mtb15 no-fluid">
        {flashMsgData && (
          <FlashMessage
            alertClass={flashMsgData.class}
            message={flashMsgData.msg}
            onClose={() => setflashMsgData(null)}
          />
        )}
        <div className="row sm-gutters">
          <div className="col-sm-12 col-md-6">
            <ThemeConsumer>
              {({ data }) => {
                return data.theme === "light" ? (
                  <TradingChart />
                ) : (
                  <TradingChartDark />
                );
              }}
            </ThemeConsumer>
            <MarketTrade />
          </div>
          <div className="col-sm-12 col-md-6">
            <MarketPairs />
          </div>

          {/* <div className="col-md-3">
              <OrderBook />
              <MarketHistory />
            </div> */}
          <div className="col-md-9">
            <HistoryOrder />
          </div>
          <div className="col-md-3">
            <MarketNews />
          </div>
        </div>
      </div>
    </>
  );
};
export default Exchange;
