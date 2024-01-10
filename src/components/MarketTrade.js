import React, { useState, useEffect } from "react";
import { FMPAPIURL, FMPENDPOINT, FMPAPIKEY } from "../config";
import { useSetRecoilState } from "recoil";
import { flashMsg } from "../state";

const MarketTrade = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [isMarketOpen, setMarketOpen] = useState(false);
  const setErrorMsg = useSetRecoilState(flashMsg); // Recoil hook to set flashMsg

  useEffect(() => {
    // Define a function to fetch data from your API
    const fetchData = async () => {
      try {
        const response = await fetch(
          FMPAPIURL + FMPENDPOINT.MARKETOPEN + "?apikey=" + FMPAPIKEY,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          const marketData = await response.json();

          if (
            selectedValue === "Stock" ||
            selectedValue === "Index" ||
            selectedValue === "Commodity"
          ) {
            setMarketOpen(marketData.isTheStockMarketOpen);
          } else if (selectedValue === "Forex") {
            setMarketOpen(marketData.isTheForexMarketOpen);
          } else if (selectedValue === "ETF") {
            setMarketOpen(marketData.isTheEuronextMarketOpen);
          }
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

    // Call the fetchData function when selectedValue changes
    if (selectedValue !== "") {
      fetchData();
    }
  }, [selectedValue]); // This will re-run the effect whenever selectedValue changes

  // Handler function to handle select box change
  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };
  return (
    <>
      <div className="market-trade">
        <div className="d-flex justify-content-between">
          <div className="market-trade-buy">
            <form action="#">
              <div className="input-group">
                <select
                  value={selectedValue}
                  onChange={handleSelectChange}
                  className="form-control"
                >
                  <option value="">Asset Type</option>
                  <option value="Stock">Stock (Equity)</option>
                  <option value="Forex">Forex</option>
                  <option value="Index">Index</option>
                  <option value="ETF">ETF</option>
                  <option value="CFD">CFD</option>
                  <option value="Commodity">Commodity</option>
                </select>
              </div>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Price"
                  required
                />
                <div className="input-group-append">
                  <span className="input-group-text">BTC</span>
                </div>
              </div>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Amount"
                  required
                />
                <div className="input-group-append">
                  <span className="input-group-text">ETH</span>
                </div>
              </div>
              <ul className="market-trade-list">
                <li>
                  <a href="#!">25%</a>
                </li>
                <li>
                  <a href="#!">50%</a>
                </li>
                <li>
                  <a href="#!">75%</a>
                </li>
                <li>
                  <a href="#!">100%</a>
                </li>
              </ul>
              <p>
                Available: <span>0 BTC = 0 USD</span>
              </p>
              <p>
                Volume: <span>0 BTC = 0 USD</span>
              </p>
              <p>
                Margin: <span>0 BTC = 0 USD</span>
              </p>
              <p>
                Fee: <span>0 BTC = 0 USD</span>
              </p>
              <button
                disabled={!isMarketOpen}
                type="submit"
                className="btn buy"
              >
                {isMarketOpen ? "Buy" : "Market Closed"}
              </button>
            </form>
          </div>
          <div className="market-trade-sell">
            <form action="#">
              <div className="input-group">
                <select
                  value={selectedValue}
                  onChange={handleSelectChange}
                  className="form-control"
                >
                  <option value="">Asset Type</option>
                  <option value="Stock">Stock (Equity)</option>
                  <option value="Forex">Forex</option>
                  <option value="Index">Index</option>
                  <option value="ETF">ETF</option>
                  <option value="CFD">CFD</option>
                  <option value="Commodity">Commodity</option>
                </select>
              </div>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Price"
                  required
                />
                <div className="input-group-append">
                  <span className="input-group-text">BTC</span>
                </div>
              </div>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Amount"
                  required
                />
                <div className="input-group-append">
                  <span className="input-group-text">ETH</span>
                </div>
              </div>
              <ul className="market-trade-list">
                <li>
                  <a href="#!">25%</a>
                </li>
                <li>
                  <a href="#!">50%</a>
                </li>
                <li>
                  <a href="#!">75%</a>
                </li>
                <li>
                  <a href="#!">100%</a>
                </li>
              </ul>
              <p>
                Available: <span>0 BTC = 0 USD</span>
              </p>
              <p>
                Volume: <span>0 BTC = 0 USD</span>
              </p>
              <p>
                Margin: <span>0 BTC = 0 USD</span>
              </p>
              <p>
                Fee: <span>0 BTC = 0 USD</span>
              </p>
              <button disabled={!isMarketOpen} className="btn sell">
                {isMarketOpen ? "Sell" : "Market Closed"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </>
  );
};

export default MarketTrade;
