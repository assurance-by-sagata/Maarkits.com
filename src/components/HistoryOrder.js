import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { BASE_URL, ENDPOINT, SETTING, FMPAPIURL, FMPAPIKEY } from "../config";
import { getColorClass, formatPLValue, formatValue } from "../utility";
import { userState } from "../state";
import { useRecoilValue } from "recoil";
import { ClipLoader } from "react-spinners";
import { useSetRecoilState } from "recoil";
import { flashMsg } from "../state";

export default function HistoryOrder() {
  const [portfolioData, setPortfolioData] = useState([]);
  const setErrorMsg = useSetRecoilState(flashMsg); // Recoil hook to set flashMsg
  const userData = useRecoilValue(userState);
  const [loading, setLoading] = useState(false);

  const [investedAmount, setInvestedAmount] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [returnAmnt, setReturnAmnt] = useState(0);
  const [startingAmnt, setStartingAmnt] = useState(0);

  useEffect(() => {
    const fetchDataForSymbol = async (symbol) => {
      const APIURL = `${FMPAPIURL}v3/quote/${symbol.symbol}?apikey=${FMPAPIKEY}`;
      try {
        const response = await fetch(APIURL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          const stockData = await response.json();
          const currentValue = stockData[0].price * symbol.quantity;
          const mkt_price = stockData[0].price;
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
            current_amnt: currentValue<invested_amount?"-"+currentValue :currentValue,
            return_amnt: returnAmnt,
          };
          return finalPortfolioData;
        } else {
          const resData = await response.json();
          throw new Error(resData.error.message);
        }
      } catch (error) {
        console.log(error.message);
        setErrorMsg({ msg: error.message, class: "alert-danger" });
        // Handle network errors or other exceptions
      } finally {
        console.log("Final call");
      }
    };
    const fetchDataForSymbol1 = (symbol) => {
      const socket = new WebSocket(
        `wss://websockets.financialmodelingprep.com/api/v3/quote/${symbol.symbol}?apikey=6fbceaefb411ee907e9062098ef0fd66`
      );
      console.log("WebSocket object:", socket);
      return () => {
        if (socket.readyState === 1) {
          // <-- This is important
          socket.close();
        }
        //socket.close();
      };
      // socket.onopen = (event) => {
      //   console.log("WebSocket opened:", event);
      // };

      // socket.onmessage = (event) => {
      //   const stockData = JSON.parse(event.data);
      //   console.log("stockData", stockData);
      //   // const finalPortfolioData = {
      //   //   product: symbol.stock_name,
      //   //   qnty: symbol.quantity,
      //   //   avg_cost: symbol.avg_cost,
      //   //   mkt_price: stockData.price,
      //   //   invested_amount: symbol.invested_amount,
      //   //   current: stockData.price * symbol.quantity,
      //   // };
      //   // setPortfolioData((prevData) => ({
      //   //   ...prevData,
      //   //   portfolio: [...prevData.portfolio, finalPortfolioData],
      //   // }));
      // };

      // socket.onclose = (event) => {
      //   console.log("WebSocket closed:", event);
      //   console.log("Close code:", event.code);
      //   console.log("Close reason:", event.reason);
      // };
      // socket.onerror = (event) => {
      //   console.error("WebSocket error:", event);
      //   if (event.message) {
      //     console.error("WebSocket Error message:", event.message);
      //   }
      // };
      // return () => {
      //   if (socket.readyState === 1) { // <-- This is important
      //       socket.close();
      //   }
      //   //socket.close();
      // };
    };

    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        const response = await fetch(BASE_URL + ENDPOINT.PORTFOLIO, {
          method: "POST",
          headers: {
            Authorization: userData.access_token,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          const data = await response.json();

          if (data.portfolio.length > 0) {
            const promises = data.portfolio.map((symbol) =>
              fetchDataForSymbol(symbol)
            );
            const results = await Promise.all(promises);
            console.log('results',results);
            setPortfolioData(results);
            const totals = results.reduce(
              (accumulator, currentValue) => {
                accumulator.invested_amount += currentValue.invested_amount;
                accumulator.current += currentValue.current;
                accumulator.return_amnt += currentValue.return_amnt;
                return accumulator;
              },
              { invested_amount: 0, current: 0, return_amnt: 0 }
            );


            setInvestedAmount(totals.invested_amount);
            setCurrentValue(totals.current);
            setReturnAmnt(totals.return_amnt);
            setStartingAmnt(data.starting_amt);
            setPortfolioData(results);
          }

        } else {
          const resData = await response.json();
          throw new Error(resData.error.message);
        }
      } catch (error) {
        setErrorMsg({ msg: error.message, class: "alert-danger" });
        // Handle network errors or other exceptions
      } finally {
        setLoading(false);
      }
    };
    // Call fetchData initially when the component mounts
    fetchPortfolioData();

  }, []);

  return (
    <>
      <div className="market-history-tab market-order mt15">
        <Tabs defaultActiveKey="portfolio">
          <Tab eventKey="portfolio" title="Portfolio">
            {loading ? (
              <div style={{ marginTop: "14%", marginLeft: "45%" }}>
                <ClipLoader color={"#1E53E5"} loading={loading} size={80} />
              </div>
            ) : (
              <>
                <div
                  className="market-carousel-item"
                  style={{ margin: "10px" }}
                >
                  <div className="row">
                    <div className="col-sm-2">
                      <h2>
                        {formatValue(
                          currentValue,
                          SETTING.CURRENCY
                        )}
                      </h2>
                      <p>Current Value</p>
                    </div>

                    <div className="col-sm-2">
                      <h2 className={getColorClass(returnAmnt)}>
                        {formatPLValue(returnAmnt, SETTING.CURRENCY)}
                      </h2>
                      <p>Profit/Loss</p>
                    </div>
                    <div className="col-sm-3">
                      <h2>
                        {formatValue(
                          startingAmnt,
                          SETTING.CURRENCY
                        )}
                      </h2>
                      <p>Starting Amount</p>
                    </div>

                    <div className="col-sm-3">
                      <h2>{formatValue(
                          investedAmount,
                          SETTING.CURRENCY
                        )}</h2>
                      <p>Total Amount Invested</p>
                    </div>
                    <div className="col-sm-2">
                      <h2>{formatValue(
                          (startingAmnt-investedAmount),
                          SETTING.CURRENCY
                        )}</h2>
                      <p>Avaialable Amount</p>
                    </div>
                  </div>
                </div>
                {portfolioData.length > 0 ? (
                  <div className="table-responsive-1">
                    <table className="table star-active1">
                      <thead>
                        <tr>
                          <th>PRODUCT</th>
                          <th>MKT PRICE</th>
                          <th>INVESTED</th>
                          <th>RETURNS</th>
                          <th>CURRENT </th>
                        </tr>
                      </thead>
                      <tbody>
                      {portfolioData.map((item, index)  => (
                        <tr data-href="exchange-light.html">
                          <td>
                          {/* {item.symbol} ({item.symbol}) */}
                          {item.symbol}
                            <div className="w10" style={{ width: "200px" }}>
                              <span>{item.qnty} Shares </span>
                              <span style={{ marginBottom: "4px" }}></span>

                            </div>
                          </td>
                          <td className="">{formatValue(item.mkt_price,SETTING.CURRENCY)}</td>
                          <td>{formatValue(item.invested_amount,SETTING.CURRENCY)}</td>
                          <td className={getColorClass(item.return_amnt)}>
                          {formatPLValue(item.return_amnt,SETTING.CURRENCY)}
                            {/* <div className="w10" style={{ width: "200px" }}>
                              <span style={{ marginBottom: "4px" }}></span>
                              <span className="green">+2.3%</span>
                            </div> */}
                          </td>
                          <td className={getColorClass(item.current_amnt)}> {formatPLValue(item.current_amnt,SETTING.CURRENCY)}</td>
                        </tr>
                      ))}
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
          <Tab eventKey="order-history" title="Order history">
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
          </Tab>
        </Tabs>
      </div>
    </>
  );
}
