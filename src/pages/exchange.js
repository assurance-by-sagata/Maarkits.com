import HistoryOrder from "../components/HistoryOrder";
import MarketHistory from "../components/MarketHistory";
import MarketNews from "../components/MarketNews";
import MarketPairs from "../components/MarketPairs";
import MarketTrade from "../components/MarketTrade";
import OrderBook from "../components/OrderBook";
import TradingChart from "../components/TradingChart";
import TradingChartDark from "../components/TradingChartDark";
import { ThemeConsumer } from "../context/ThemeContext";
import { isLoggedInState, userState } from "../state";
import { useRecoilValue } from "recoil";

const Exchange = () => {
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const userData = useRecoilValue(userState);

  console.log("isLoggedIn at signin:", isLoggedIn); // Log the isLoggedIn state
  console.log("userData at signin:", userData); // Log the isLoggedIn state
  return (
    <>
      <div className="container-fluid mtb15 no-fluid">
        <div className="row sm-gutters">
          <div className="col-sm-12 col-md-9">
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
          <div className="col-sm-12 col-md-3">
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
