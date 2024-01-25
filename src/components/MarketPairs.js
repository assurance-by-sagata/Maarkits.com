import React, { useState, useEffect,useCallback } from "react";
import { Tabs, Tab } from 'react-bootstrap';
import {
  FMPAPIURL,
  FMPENDPOINT,
  FMPAPIKEY,
  BASE_URL,
  ENDPOINT,
  SETTING,
  SWA,

} from "../config";
import { getColorClass, formatPLValue, formatValue } from "../utility";
import { useSetRecoilState } from "recoil";
import { flashMsg,globalAsset,globalProduct} from "../state";
import { ClipLoader } from "react-spinners";
import SymbolList from "../components/SymbolList";



const MarketPairs = () => {

  const setFlashMsg = useSetRecoilState(flashMsg); // Recoil hook to set flashMsg
  const setGlobalAsset = useSetRecoilState(globalAsset); // Recoil hook to set globalAsset
  const setGlobalProduct = useSetRecoilState(globalProduct); // Recoil hook to set globalProduct
  const [assets, setAssets] = useState([]);
  const [products, setProducts] = useState([]);
  const [initialProduct, setInitialProduct] = useState(0);
  const [loading, setLoading] = useState(false);



  const limit =10;
  const globalSymbol="AAPL";

  useEffect(() => {
    const fetchProductList = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          SWA+ENDPOINT.PRODUCTLIST,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          const productsData = await response.json();
          console.log("productsData",productsData);
          setInitialProduct(productsData[0].id);
          setProducts(productsData);
          fetchData(productsData[0].id);
          const selected =productsData.find(product => product.id == productsData[0].id);
          setGlobalProduct(selected.product_name)
        } else {
          const resData = await response.json();
          throw new Error(resData.message);
        }
      } catch (error) {
        console.log(error.message);
        setFlashMsg({ msg: error.message, class: "alert-danger" });
      } finally {
        console.log("Final call");
        setLoading(false);
      }
    };

    // Define a function to fetch data from your API
     setGlobalAsset(globalSymbol)
     fetchProductList()

    // if (!loading){
    //   alert(initialProduct)
    //   fetchData(initialProduct);
    //   const selected =products.find(product => product.id == initialProduct);
    //  setGlobalProduct(selected.product_name)
    // }



  }, []);

  const fetchData = async (initialProduct) => {
    try {
      const response = await fetch(
        //`${SWA+ENDPOINT.ASSETSLIST}?id=${initialProduct}&limit=${limit}`,
        'https://financialmodelingprep.com/api/v3/quote/AGOL.BO,NYKAA.BO,ITC.BO,AAPL,META,GOOG,PMGOLD.AX,INDIGRID.NS,INDIGRID.NS?apikey=6fbceaefb411ee907e9062098ef0fd66',
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const assetsData = await response.json();
        setAssets(assetsData);

      } else {
        const resData = await response.json();
        throw new Error(resData.message);
      }
    } catch (error) {
      console.log(error.message);
      setFlashMsg({ msg: error.message, class: "alert-danger" });
      // Handle network errors or other exceptions
    } finally {
      console.log("Final call");
    }
  };
  const handleTabChange = (selectedKey) => {
    console.log("Selected selectedKey:", selectedKey);
    const arrKey = selectedKey.split('-');
    fetchData(arrKey[1])
    const selected =products.find(product => product.id == arrKey[1]);
    setGlobalProduct(selected.product_name)
  };
  const handleRowClick = (selectedAssest) => {
      setGlobalAsset(selectedAssest)
  };
  const [symbolData, setSymbolData] = useState({});
  const handleUpdate = (symbol, data) => {
    // Update the state with the received data for the specific symbol
    setSymbolData((prevData) => ({
      ...prevData,
      [symbol]: data,
    }));
  };
  return (
    <>


      {/* {assets.map((symbol) => (
        <SymbolList key={symbol} symbol={symbol} onUpdate={handleUpdate} />
      ))} */}
      <div className="market-pairs">
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-sm">
              <i className="icon ion-md-search"></i>
            </span>
          </div>
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            aria-describedby="inputGroup-sizing-sm"
          />
        </div>
        {loading ? (
              <div style={{ marginTop: "14%", marginLeft: "45%" }}>
                <ClipLoader color={"#1E53E5"} loading={loading} size={80} />
              </div>
            ) : (
          <Tabs defaultActiveKey={`tab-${initialProduct}`}  onSelect={handleTabChange}>
          {products.map((item, index)=>(
            <Tab eventKey={`tab-${item.id}`} title={item.product_name}>
              <table className="table star-active">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Change</th>
                    <th>Change(%)</th>
                    <th>Open</th>
                    <th>High</th>
                    <th>Low</th>
                    <th>Close</th>
                  </tr>
                </thead>
                <tbody>

                {assets.map((item, index) => (
                  <tr onClick={() => handleRowClick(item.symbol)} >
                    <td>{item.symbol}</td>
                    <td  className={getColorClass(item.change)}> {item.change} </td>
                    <td  className={getColorClass(item.changesPercentage)}> {item.changesPercentage} </td>
                    <td>{item.open}</td>
                    <td>{item.dayHigh}</td>
                    <td>{item.dayLow}</td>
                    <td>{item.previousClose}</td>

                  </tr>
                ))}


                </tbody>
              </table>
            </Tab>
          ))}
          </Tabs>
           )}
      </div>
    </>
  );
}
export default MarketPairs;