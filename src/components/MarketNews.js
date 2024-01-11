import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { FMPAPIURL, FMPENDPOINT, FMPAPIKEY ,STOCKNEWSAPIURL,NEWSAPIKEY} from "../config";
import { useSetRecoilState } from "recoil";
import { flashMsg } from "../state";

const MarketNews = () => {
  const [symbol, setSymbol] = useState('');
  const [marketNewsData, setMarketNews] = useState([]);
  const setErrorMsg = useSetRecoilState(flashMsg); // Recoil hook to set flashMsg

  useEffect(() => {

    const fetchData = async ( ) => {
      const APIURL= symbol? `${STOCKNEWSAPIURL}/v1?tickers=${symbol}&items=4&page=1&token=${NEWSAPIKEY}` : FMPAPIURL + FMPENDPOINT.FOREXNEWS  + FMPAPIKEY;

      try {
        const response = await fetch(
          APIURL,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          const marketData = await response.json();
          setMarketNews(marketData)
          console.log("newsData",marketData);
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

     // Call fetchData initially when the component mounts
     fetchData();

     // Set up an interval to make the API call every 5 minutes (300,000 milliseconds)
     const intervalId = setInterval(() => {
       fetchData();
     }, 300000); // 5 minutes in milliseconds

     // Clean up the interval when the component unmounts or when the dependency changes
     return () => {
       clearInterval(intervalId);
     };

  }, [symbol]);
  return (
    <>
      <div className="market-news mt15">
        <h2 className="heading">Market News</h2>
        <ul>
        {marketNewsData.map((item, index) => (
          <li>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              <strong>{item.title}</strong>
              {item.image && (
                 <img src={item.image} alt={item.title} />
              )}
              {item.text}
              <span>{item.publishedDate}</span>
            </a>
          </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default MarketNews;