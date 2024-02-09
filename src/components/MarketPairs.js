import React, { useState, useEffect, useCallback } from "react";
import { Tabs, Tab } from "react-bootstrap";
import {
  FMPAPIURL,
  FMPENDPOINT,
  FMPAPIKEY,
  BASE_URL,
  ENDPOINT,
  SETTING,
  SWA,
  STOCKLIST,
  CRYPTOLIST,
  BULKSTOCKLIST,
} from "../config";
import {
  getColorClass,
  formatPLValue,
  formatValue,
  fetchStremData,
  getBeforeDotValue,
  formatTickerValue,
} from "../utility";
import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";
import {
  flashMsg,
  globalAsset,
  globalProduct,
  userState,
  socketData,
  assetData
} from "../state";
import { setAssetData } from "../auth";
import { ClipLoader } from "react-spinners";
import SymbolList from "../components/SymbolList";
import Pagination from "../components/Pagination";

const MarketPairs = () => {
  const setFlashMsg = useSetRecoilState(flashMsg); // Recoil hook to set flashMsg
  const setGlobalAsset = useSetRecoilState(globalAsset); // Recoil hook to set globalAsset
  const setGlobalProduct = useSetRecoilState(globalProduct); // Recoil hook to set globalProduct
  const [assets, setAssets] = useRecoilState(assetData);
  const [filterAssets, setFilterAssets] = useState([]);
  const [products, setProducts] = useState([
    { id: 1, product_name: "Stock (Equity)" },
  ]);
  const [initialProduct, setInitialProduct] = useState(1);
  const [loading, setLoading] = useState(false);
  const tickerPrices = useRecoilValue(socketData);
  const setTickerPrices = useSetRecoilState(socketData);
  const globalSymbol = SETTING.INITIALSYMBOL;
  const userData = useRecoilValue(userState);
  const [symbolList, setSymbolList] = useState([]);

  useEffect(() => {
    // const fetchProductList = async () => {
    //   try {
    //     setLoading(true);
    //     const response = await fetch(
    //       SWA+ENDPOINT.PRODUCTLIST,
    //       {
    //         method: "GET",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //       }
    //     );

    //     if (response.status === 200) {
    //       const productsData = await response.json();
    //       console.log("productsData",productsData);
    //       setInitialProduct(productsData[0].id);
    //       setProducts(productsData);
    //       fetchData(productsData[0].id);
    //       const selected =productsData.find(product => product.id == productsData[0].id);
    //       setGlobalProduct(selected.product_name)
    //     } else {
    //       const resData = await response.json();
    //       throw new Error(resData.message);
    //     }
    //   } catch (error) {
    //     console.log(error.message);
    //     setFlashMsg({ msg: error.message, class: "alert-danger" });
    //   } finally {
    //     console.log("Final call");
    //     setLoading(false);
    //   }
    // };
    //fetchProductList()

    // Define a function to fetch data from your API
    setGlobalAsset(globalSymbol);
    setGlobalProduct("Stock (Equity)");
    console.log("asset storage",assets);
    if(assets.length<0){
      fetchData(1);
    }

    console.log("tickerPrices array at market pairs", tickerPrices);
  }, []);

  const fetchData = async (initialProduct, symbol = "") => {
    let STOCKURL = symbol ? `v3/quote/${symbol}` : STOCKLIST;

    try {
      setLoading(true);
      const response = await fetch(
        `${FMPAPIURL + STOCKURL}?apikey=${FMPAPIKEY}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const assetsData = await response.json();
        const newAssets = assetsData.map((asset) => ({
          s: asset.symbol,
          ap: asset.price,
          bp: asset.price,
          lp: asset.previousClose,
        }));
        const userSymbols = userData.portfolio;
        const mrktSymbols = [];
        assetsData.forEach((asset) => {
          const nd = {
            [asset.symbol?.toLowerCase()]: {
              s: asset.symbol,
              ap: asset.price,
              bp: asset.price,
              lp: asset.previousClose,
            },
          };

          const symbolKey = getBeforeDotValue(asset.symbol?.toLowerCase());
          //const symbolKey = asset.symbol?.toLowerCase();
          mrktSymbols.push(symbolKey);
          setTickerPrices((prev) => ({ ...prev, ...nd }));
        });

        // Finilaze the symbol list including user portfolio symbol list
        const mergedSymbols = [...new Set([...userSymbols, ...mrktSymbols])];
        // Subscribe to ticker prices
        fetchStremData("websockets", mergedSymbols, (newData) => {
          setTickerPrices((prev) => ({ ...prev, ...newData }));
        });
        fetchStremData("forex", mergedSymbols, (newData) => {
          setTickerPrices((prev) => ({ ...prev, ...newData }));
        });

        if (symbol) {
          return newAssets;
        } else {
          setAssetData(newAssets, setAssets);
          //setAssets(newAssets);
        }
      } else {
        const resData = await response.json();
        throw new Error(resData.message);
      }
    } catch (error) {
      console.log(error);
      setFlashMsg({ msg: error.message, class: "alert-danger" });
      // Handle network errors or other exceptions
    } finally {
      setLoading(false);
    }
  };
  const handleTabChange = (selectedKey) => {
    console.log("Selected selectedKey:", selectedKey);
    const arrKey = selectedKey.split("-");
    fetchData(arrKey[1]);
    const selected = products.find((product) => product.id == arrKey[1]);
    setGlobalProduct(selected.product_name);
  };
  const handleRowClick = (selectedAssest) => {
    setGlobalAsset(selectedAssest);
  };

  const [searchInput, setSearchInput] = useState("");

  const handleSearchChange = (event) => {
    const inputValue = event?.target?.value;
    setSearchInput(inputValue);
  };

  useEffect(() => {
    // Check if the searchInput has a value
    const fetchDataAndSetFilterAssets = async () => {
      if (searchInput.trim() !== "") {
        const fltrAssest = assets.filter((asset) =>
          asset.s.toLowerCase().includes(searchInput.toLowerCase())
        );
        if (fltrAssest.length > 0) {
          setFilterAssets(fltrAssest);
        } else {
          const symbolData = await fetchData(1, searchInput.trim());
          console.log("symbolData", symbolData);
          setFilterAssets(symbolData);
        }
      } else {
        // If searchInput is empty, reset displayedAssets
        setFilterAssets(assets);
      }
    };
    fetchDataAndSetFilterAssets();
  }, [searchInput, assets]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // Calculate the range of items to display based on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  let displayedAssets = filterAssets;
  if (filterAssets.length > 10) {
    displayedAssets = filterAssets.slice(startIndex, endIndex);
  }

  // Update the current page
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  return (
    <>
      {/* {assets.map((symbol) => (
        <SymbolList key={symbol.symbol} symbol={symbol.symbol} onUpdate={handleUpdate} />
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
            onChange={handleSearchChange}
          />
        </div>
        {loading ? (
          <div style={{ marginTop: "14%", marginLeft: "45%" }}>
            <ClipLoader color={"#1E53E5"} loading={loading} size={80} />
          </div>
        ) : (
          <Tabs
            defaultActiveKey={`tab-${initialProduct}`}
            onSelect={handleTabChange}
          >
            {products.map((item, index) => (
              <Tab eventKey={`tab-${item.id}`} title={item.product_name}>
                <table className="table star-active">
                  <thead>
                    <tr>
                      <th>Assest</th>
                      <th>Ask Price</th>
                      <th>Bid Price</th>
                      <th>LastPrice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedAssets.map((item, index) => (
                      <tr
                        onClick={() => handleRowClick(item.s)}
                        className={
                          index === displayedAssets.length - 1 ? "last-row" : ""
                        }
                      >
                        <td>{item.s}</td>
                        {/* <td  className={getColorClass(item.change)}> {item.change} </td>
                    <td  className={getColorClass(item.changesPercentage)}> {item.changesPercentage} </td> */}
                        <td>
                          {formatTickerValue(
                            tickerPrices[item.s?.toLowerCase()]?.ap ?? item.ap,
                            SETTING.CURRENCY
                          )}
                        </td>
                        <td>
                          {formatTickerValue(
                            tickerPrices[item.s?.toLowerCase()]?.bp ?? item.bp,
                            SETTING.CURRENCY
                          )}
                        </td>
                        <td>
                          {formatTickerValue(
                            tickerPrices[item.s?.toLowerCase()]?.lp ?? item.lp,
                            SETTING.CURRENCY
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Use the Pagination component */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(filterAssets.length / itemsPerPage)}
                  onPageChange={handlePageChange}
                />
              </Tab>
            ))}
          </Tabs>
        )}
      </div>
    </>
  );
};
export default MarketPairs;
