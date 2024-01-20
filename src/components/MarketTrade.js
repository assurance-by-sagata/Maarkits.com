import React, { useState, useEffect } from "react";
import {
  FMPAPIURL,
  FMPENDPOINT,
  FMPAPIKEY,
  BASE_URL,
  ENDPOINT,
} from "../config";
import { useSetRecoilState,useRecoilValue } from "recoil";
import { flashMsg, userState ,globalProduct, globalAsset } from "../state";
import { BeatLoader } from "react-spinners";




const MarketTrade = () => {


  const [isMarketOpen, setMarketOpen] = useState(false);
  const setFlashMsg = useSetRecoilState(flashMsg); // Recoil hook to set flashMsg
  const symbol = useRecoilValue(globalAsset);
  const product = useRecoilValue(globalProduct);
  const [quantity, setQuantity] = useState(0);
  const [sellQuantity,setSellQuantity] = useState(0);
  const userData = useRecoilValue(userState);
  const [loading, setLoading] = useState(false);

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
            product === "Stock (Equity)" ||
            product === "Index" ||
            product ==="Commodity"
          ) {
            setMarketOpen(marketData.isTheStockMarketOpen);
            //console.log("isTheStockMarketOpen",marketData.isTheStockMarketOpen);
           } else if (product === "Forex") {
            setMarketOpen(marketData.isTheForexMarketOpen);
            //console.log("isTheForexMarketOpen",marketData.isTheForexMarketOpen);
          } else if (product === "ETF") {
            setMarketOpen(marketData.isTheEuronextMarketOpen);
            //console.log("isTheEuronextMarketOpen",marketData.isTheEuronextMarketOpen);
          }

        } else {
          const resData = await response.json();
          throw new Error(resData.error.message);
        }
      } catch (error) {
        console.log(error.message);
        setFlashMsg({ msg: error.message, class: "alert-danger" });
        // Handle network errors or other exceptions
      } finally {
        console.log("Final call");
      }
    };

    // Call the fetchData function when product changes
    if (product !== "") {
      fetchData();
    }
  }, [product]); // This will re-run the effect whenever product changes


  const handleBuyStock = async () => {
    try {
      const response = await fetch( BASE_URL + ENDPOINT.BUY,
        {
          method: "POST",
          headers: {
            Authorization: userData.access_token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({symbol:symbol,shares: quantity,type:product}),
        }
      );
      if (response.status === 200) {
        const data = await response.json();
         setFlashMsg({ msg: `${symbol} assest sussefully purchased!`, class: "alert-success" });
      } else {
        const resData = await response.json();
        throw new Error(resData.error.message);
      }
    } catch (error) {
      setFlashMsg({ msg: error.message, class: "alert-danger" });
      // Handle network errors or other exceptions
    } finally {
      setLoading(false);
    }
  };
  const handleSellStock = async () => {
    try {
      const response = await fetch( BASE_URL + ENDPOINT.SELL,
        {
          method: "POST",
          headers: {
            Authorization: userData.access_token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({symbol:symbol,shares: quantity,type:product}),
        }
      );
      if (response.status === 200) {
        const data = await response.json();
         setFlashMsg({ msg: `${symbol} assest sussefully purchased!`, class: "alert-success" });
      } else {
        const resData = await response.json();
        throw new Error(resData.error.message);
      }
    } catch (error) {
      setFlashMsg({ msg: error.message, class: "alert-danger" });
      // Handle network errors or other exceptions
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="market-trade">
        <div className="d-flex justify-content-between">
          <div className="market-trade-buy">
            <form action="#">

              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder={symbol}
                  disabled
                  value={symbol}
                />
                <div className="input-group-append">
                  <span className="input-group-text">{product}</span>
                </div>
              </div>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  placeholder="No of Shares"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
                <div className="input-group-append">
                  <span className="input-group-text">{product}</span>
                </div>
              </div>

              <button
                disabled={!isMarketOpen}
                type="button"
                className="btn buy"
                onClick={handleBuyStock}
              >
                {isMarketOpen ? "Buy" : "Market Closed"}
              </button>
            </form>
          </div>
          <div className="market-trade-sell">
            <form action="#">

               <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder={symbol}
                  disabled
                  value={symbol}
                />
                <div className="input-group-append">
                  <span className="input-group-text">{product}</span>
                </div>
              </div>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  placeholder="No of Shares"
                  required
                  value={sellQuantity}
                  onChange={(e) => setSellQuantity(e.target.value)}
                />
                <div className="input-group-append">
                  <span className="input-group-text">{product}</span>
                </div>
              </div>

              <button type="button" disabled={!isMarketOpen} className="btn sell"  onClick={handleSellStock} >
                {loading ? (
                  <BeatLoader style={{ display: "block", margin: "0 auto",fontSize:"16px" }} color={"#ffffff"} loading={loading} size={8} />
                ) : (
                  isMarketOpen ? "Sell" : "Market Closed"
                )}

              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarketTrade;
