import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { BASE_URL, ENDPOINT, SETTING } from "../config";
import {
  getColorClass,
  formatPLValue,
  formatValue,
  formatTickerValue,
  fetchStremDataForSymbols,
  fetchStremData,
  fetchMarketPriceForSymbol,
} from "../utility";
import { userState, flashMsg, portfolioState, socketData } from "../state";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { ClipLoader } from "react-spinners";

export default function HistoryOrder() {
  const [portfolioData, setPortfolioData] = useState([]);
  const setErrorMsg = useSetRecoilState(flashMsg); // Recoil hook to set flashMsg
  const userData = useRecoilValue(userState);
  const [loading, setLoading] = useState(false);

  const [investedAmount, setInvestedAmount] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [returnAmnt, setReturnAmnt] = useState(0);
  const [startingAmnt, setStartingAmnt] = useState(0);
  const [availableCash, setAvailableCash] = useState(0);
  const updateFlag = useRecoilValue(portfolioState);
  const tickerPrices = useRecoilValue(socketData);
  const setTickerPrices = useSetRecoilState(socketData);

  useEffect(() => {
    const fetchDataForSymbol = async (symbol) => {
      try {
        fetchMarketPriceForSymbol(symbol, (newPrice) => {
          setTickerPrices((prev) => ({
            ...prev,
            ...newPrice,
          }));
        });
        const currentValue = 0 * symbol.quantity;
        const mkt_price = 0;
        const invested_amount = symbol.invested_amount;
        const returnAmnt = currentValue - invested_amount;

        const finalPortfolioData = {
          product: symbol.name,
          symbol: symbol.symbol,
          qnty: symbol.quantity,
          avg_cost: symbol.avg_cost,
          mkt_price: mkt_price,
          invested_amount: invested_amount,
          current: currentValue,
          current_amnt:
            currentValue < invested_amount ? "-" + currentValue : currentValue,
          return_amnt: returnAmnt,
        };
        return finalPortfolioData;
      } catch (error) {
        console.log(error.message);
        setErrorMsg({ msg: error.message, class: "alert-danger" });
        // Handle network errors or other exceptions
      }
    };

    const fetchPortfolioData = async () => {
      try {
        // console.log("response");
        //setLoading(true);
        // console.log("response 1");
        // console.log("userData", userData);
        const response = await fetch(BASE_URL + ENDPOINT.PORTFOLIO, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + userData.access_token,
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          const arrData = await response.json();

          const data = arrData.data;
          setStartingAmnt(data.starting_amt);
          setAvailableCash(data.available_cash);
          if (data.portfolio.length > 0) {
            const promises = data.portfolio.map((symbol) =>
              fetchDataForSymbol(symbol)
            );
            const results = await Promise.all(promises);

            const totals = results.reduce(
              (accumulator, currentValue) => {
                accumulator.invested_amount += currentValue.invested_amount;
                accumulator.current += currentValue.current;
                accumulator.return_amnt += currentValue.return_amnt;
                return accumulator;
              },
              { invested_amount: 0, current: 0, return_amnt: 0 }
            );

            // console.log("SSAASA", results);

            setInvestedAmount(totals.invested_amount);
            setCurrentValue(totals.current);
            setReturnAmnt(totals.return_amnt);
            setPortfolioData(results);
          }
        } else {
          const resData = await response.json();
          throw new Error(resData.message);
        }
      } catch (error) {
        setErrorMsg({ msg: error.message, class: "alert-danger" });
        // Handle network errors or other exceptions
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [updateFlag]);

  useEffect(() => {
    const currentValue = portfolioData.reduce((total, ticker) => {
      const symbolKey = ticker.symbol?.toLowerCase();
      const lpValue =
        tickerPrices[symbolKey]?.ap ?? tickerPrices[symbolKey]?.bp ?? tickerPrices[symbolKey]?.lp ?? 0;
      total += ticker.qnty * (lpValue ?? 0);
      return total;
    }, 0);
    setCurrentValue(currentValue);
    console.log("availableCash",availableCash,"  currentValue:" ,currentValue," startingAmnt:",startingAmnt)
    console.log("portfolioData",portfolioData)

    setReturnAmnt((availableCash + currentValue) - startingAmnt);
  }, [tickerPrices, portfolioData]);

  return (
    <>
      <div className="market-history-tab market-order mt15">
        <Tabs defaultActiveKey="portfolio">
          <Tab eventKey="portfolio" title="Portfolio">
            {loading ? (
              <div
                style={{ marginTop: "14%", marginLeft: "45%" }}
                data-testid="loading-indicator"
              >
                <ClipLoader color={"#1E53E5"} loading={loading} size={80} />
              </div>
            ) : (
              <>
                <div
                  className="market-carousel-item"
                  style={{ margin: "10px" }}
                >
                  <div className="row">
                    <div className="col-sm-3">
                      <h2>{formatValue(startingAmnt, SETTING.CURRENCY)}</h2>
                      <p>Opening Balance</p>
                    </div>
                    <div className="col-sm-2">
                      {console.log('availableCash inside return',availableCash)}
                      <h2>{formatValue(availableCash, SETTING.CURRENCY)}</h2>
                      <p>Avaialable Balance</p>
                    </div>
                    <div className="col-sm-3">
                      <h2>{formatValue(investedAmount, SETTING.CURRENCY)}</h2>
                      <p>Gross Invested Value</p>
                    </div>
                    <div className="col-sm-2">
                      <h2>
                        {formatTickerValue(currentValue, SETTING.CURRENCY)}
                      </h2>
                      <p>Current Value</p>
                    </div>

                    <div className="col-sm-2">
                      <h2 className={getColorClass(returnAmnt)}>
                        {formatPLValue(((availableCash + currentValue) - startingAmnt), SETTING.CURRENCY)}
                        {/*  change the code for run time calculation {formatPLValue(returnAmnt, SETTING.CURRENCY)} */}
                      </h2>
                      <p>Profit/Loss</p>
                    </div>
                  </div>
                </div>
                {portfolioData.length > 0 ? (
                  <div className="table-responsive-1">
                    <table className="table star-active1">
                      <thead>
                        <tr>
                          <th>PRODUCT</th>
                          <th>UNITS OWNED</th>

                          <th>MARKET PRICE</th>
                          <th>MARKET VALUE</th>
                          <th>INVESTED</th>
                          <th>RETURNS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {portfolioData.map((item, index) => {
                          const symbolKey = item.symbol?.toLowerCase();
                          console.log("tickerPrices[symbolKey]", tickerPrices[symbolKey]);
                          let lpValue = 0;
                          lpValue = tickerPrices[symbolKey]?.ap ?? tickerPrices[symbolKey]?.bp ?? tickerPrices[symbolKey]?.lp ?? 0 ;
                          return (
                            <tr key={index} data-href="exchange-light.html">
                              <td>
                              {item.symbol}
                              </td>
                              <td>{item.qnty}</td>
                              {/* <td>0</td> */}
                              <td className="">
                                {formatTickerValue(lpValue, SETTING.CURRENCY)}
                              </td>

                              <td className={getColorClass(item.current_amnt)}>
                                {formatValue(
                                  lpValue * item.qnty,
                                  SETTING.CURRENCY
                                )}
                              </td>
                              <td
                                className={getColorClass(item.invested_amount)}
                              >
                                {formatValue(
                                  item.invested_amount,
                                  SETTING.CURRENCY
                                )}
                              </td>
                              <td
                                className={getColorClass(
                                  lpValue * item.qnty - item.invested_amount
                                )}
                              >
                                {formatPLValue(
                                  lpValue * item.qnty - item.invested_amount,
                                  SETTING.CURRENCY
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="table-responsive-1">
                    <table className="table star-active1">
                      <thead>
                        <tr>
                          <th style={{ textAlign: "center" }}>No Data</th>
                        </tr>
                      </thead>
                    </table>
                  </div>
                )}
              </>
            )}
          </Tab>
          {/* <Tab eventKey="order-history" title="Order history" style={{display:"none"}}>
            <ul className="d-flex justify-content-between market-order-item">
              <li>Time</li>
              <li>All pairs</li>
              <li>All Types</li>
              <li>Buy/Sell</li>
              <li>Price</li>
              <li>Amount</li>
              <li>Executed</li>
              <li>Unexecuted</li>
            </ul>
            <span className="no-data">
              <i className="icon ion-md-document"></i>
              No data
            </span>
          </Tab> */}
        </Tabs>
      </div>
    </>
  );
}
