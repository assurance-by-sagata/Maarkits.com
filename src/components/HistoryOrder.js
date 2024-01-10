import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { BASE_URL, ENDPOINT } from "../config";
import { userState } from "../state";
import { useRecoilValue } from "recoil";
import { ClockLoader } from "react-spinners";
import { useSetRecoilState } from "recoil";
import { flashMsg } from "../state";

export default function HistoryOrder() {
  const [portfolioData, setPortfolioData] = useState(null);
  const setErrorMsg = useSetRecoilState(flashMsg); // Recoil hook to set flashMsg
  const userData = useRecoilValue(userState);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
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
          setPortfolioData(data);
        } else {
          const resData = await response.json();
          throw new Error(resData.error.message);
        }
      } catch (error) {
        setErrorMsg({msg:error.message, class:'alert-danger'});
        // Handle network errors or other exceptions
      }
      finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [userData.access_token]);
  return (
    <>
      <div className="market-history-tab market-order mt15">
        <Tabs defaultActiveKey="portfolio">
          <Tab eventKey="portfolio" title="Portfolio">
          {loading ? (
             <div style={{ marginTop: "14%", marginLeft: "45%" }}>
                <ClockLoader  color={"#26de81"} loading={loading} size={80} />
             </div>
           ) : (
            <>
            {portfolioData ? (
              <>
                <div
                  className="market-carousel-item"
                  style={{ margin: "10px" }}
                >
                  <div className="row">
                    <div className="col-sm-2">
                      <h2>$13110.0</h2>
                      <p>Current Value</p>
                    </div>

                    <div className="col-sm-2">
                      <h2>$3110.0</h2>
                      <p>Profit/Loss</p>
                    </div>
                    <div className="col-sm-3">
                      <h2>$11000.0</h2>
                      <p>Starting Amount</p>
                    </div>

                    <div className="col-sm-3">
                      <h2>$9999.0</h2>
                      <p>Total Amount Invested</p>
                    </div>
                    <div className="col-sm-2">
                      <h2>$1001.0</h2>
                      <p>Avaialable Amount</p>
                    </div>
                  </div>
                </div>
                {portfolioData.portfolio.length > 0 ? (
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
                        <tr data-href="exchange-light.html">
                          <td>
                            AA
                            <div className="w10" style={{ width: "200px" }}>
                              <span>2222 shares </span>
                              <span style={{ marginBottom: "4px" }}></span>
                              <span>Avg. $4.50</span>
                            </div>
                          </td>
                          <td className="">$5.90</td>
                          <td>$9999.0</td>
                          <td className="green"><div className="w10" style={{ width: "200px" }}>

                              <span style={{ marginBottom: "4px" }}></span>
                              <span className="green" >+2.3%</span>
                            </div>
                            +$3110.80

                          </td>
                          <td className="green">+$13110.0</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                 ) : (
                  <div className="table-responsive-1">
                    <table className="table star-active1">
                      <thead>
                        <tr>
                          <th style={{textAlign:"center"}}>No Data</th>
                        </tr>
                      </thead>

                    </table>
                  </div>
                )}
              </>
            ) : (
              <span className="no-data">
                <i className="icon ion-md-document"></i>
                No data
              </span>
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
