import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { BASE_URL, ENDPOINT, SETTING, FMPAPIURL, FMPAPIKEY } from "../config";
import { getColorClass, formatPLValue, formatValue,fetchStremDataForSymbol } from "../utility";
import { userState ,flashMsg,portfolioState} from "../state";
import { useRecoilValue ,useSetRecoilState} from "recoil";
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
  const updateFlag = useRecoilValue(portfolioState);

  useEffect(() => {
    const fetchDataForSymbol1 = async (symbol) => {
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
            current_amnt:
              currentValue < invested_amount
                ? "-" + currentValue
                : currentValue,
            return_amnt: returnAmnt,
          };
          return finalPortfolioData;
        } else {
          const resData = await response.json();
          throw new Error(resData.message);
        }
      } catch (error) {
        console.log(error.message);
        setErrorMsg({ msg: error.message, class: "alert-danger" });
        // Handle network errors or other exceptions
      } finally {
        console.log("Final call");
      }
    };

    const fetchDataForSymbol = async (symbol) => {

      try {

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
              currentValue < invested_amount
                ? "-" + currentValue
                : currentValue,
            return_amnt: returnAmnt,
          };
          return finalPortfolioData;

      } catch (error) {
        console.log(error.message);
        setErrorMsg({ msg: error.message, class: "alert-danger" });
        // Handle network errors or other exceptions
      } finally {
        console.log("Final call");
      }
    };


    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
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
          if (data.portfolio.length > 0) {
            const promises = data.portfolio.map((symbol) =>
              fetchDataForSymbol(symbol)
            );
            const results = await Promise.all(promises);
            console.log("results", results);

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
                    <div className="col-sm-3">
                      <h2>{formatValue(startingAmnt, SETTING.CURRENCY)}</h2>
                      <p>Opening Balance</p>
                    </div>
                    <div className="col-sm-2">
                      <h2>
                        {formatValue(
                          startingAmnt - investedAmount,
                          SETTING.CURRENCY
                        )}
                      </h2>
                      <p>Avaialable Balance</p>
                    </div>
                    <div className="col-sm-3">
                      <h2>{formatValue(investedAmount, SETTING.CURRENCY)}</h2>
                      <p>Gross Invested Value</p>
                    </div>
                    <div className="col-sm-2">
                      <h2>{formatValue(currentValue, SETTING.CURRENCY)}</h2>
                      <p>Current Value</p>
                    </div>

                    <div className="col-sm-2">
                      <h2 className={getColorClass(returnAmnt)}>
                        {formatPLValue(returnAmnt, SETTING.CURRENCY)}
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
                          {/* <th>AVG COST</th> */}
                          <th>MARKET PRICE</th>
                          <th>MARKET VALUE</th>
                          <th>RETURNS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {portfolioData.map((item, index) => (
                          <tr data-href="exchange-light.html">
                            <td>
                              {/* {item.symbol} ({item.symbol}) */}
                              {item.symbol}
                            </td>
                            <td>{item.qnty}</td>
                            {/* <td>0</td> */}
                            <td className="">
                              {formatValue(item.mkt_price, SETTING.CURRENCY)}
                            </td>

                            <td className={getColorClass(item.current_amnt)}>
                              {" "}
                              {formatValue(item.current_amnt, SETTING.CURRENCY)}
                            </td>
                            <td className={getColorClass(item.return_amnt)}>
                              {formatPLValue(
                                item.return_amnt,
                                SETTING.CURRENCY
                              )}
                            </td>
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
