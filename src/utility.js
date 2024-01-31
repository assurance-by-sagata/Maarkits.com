import { FMPAPIURL,FMPAPIKEY } from "./config";

export const getColorClass = (pl) => {
  if (pl < 0) {
    return "red";
  } else {
    return "green";
  }
};

export const formatPLValue = (pl, symbol) => {
  const sign = pl < 0 ? "-" : "+"; // Determine the sign based on PL value
  const formattedValue = `${sign}${symbol}${Math.abs(pl).toLocaleString(
    "en-US",
    { minimumFractionDigits: 4 }
  )}`;
  return formattedValue;
};
export const formatValue = (pl, symbol) => {
  const formattedValue = `${symbol}${Math.abs(pl).toLocaleString("en-US", {
    minimumFractionDigits: 2,
  })}`;
  return formattedValue;
};

export const formatTickerValue = (pl, symbol) => {
  const formattedValue = `${symbol}${Math.abs(pl).toLocaleString("en-US", {
    minimumFractionDigits: 5,
  })}`;
  return formattedValue;
};

export const fetchStremDataForSymbols = (stream, symbols, updatePrice) => {
  const socket = new WebSocket(`wss://${stream}.financialmodelingprep.com`);
  // Connection opened
  socket.addEventListener("open", (event) => {
    //console.log("WebSocket connection opened");

    // Send login message
    const loginMessage = {
      event: "login",
      data: {
        apiKey: "pranav.chaudhary@sagataltd.io",
      },
    };
    socket.send(JSON.stringify(loginMessage));
  });
  // Listen for messages
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    //console.log(`WebSocket message received`, message);

    // Check if the authentication was successful
    if (message.status === 200 && message.event === "login") {
      // If authenticated, send subscribe request
      symbols.forEach((s) => {
        const subscribeMessage = {
          event: "subscribe",
          data: {
            ticker: s,
          },
        };
        socket.send(JSON.stringify(subscribeMessage));
      });
    } else if (message.status === 200 && message.event === "subscribe") {
      //console.log(`Successfully subscribed to:`, message);
    } else {
      updatePrice({
        [message.s]: message.lp ?? message.bp,
      });
    }
    // Handle other message types as needed
  });

  // Connection closed
  socket.addEventListener("close", (event) => {
    //console.log(`WebSocket connection closed`, event);
  });
  // Handle errors
  socket.addEventListener("error", (event) => {
    console.error(`WebSocket error`, event);
  });
};

export const fetchMarketPriceForSymbol = async (symbol,updatePrice) => {
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
      const asset= stockData[0];
      updatePrice({
         [symbol.symbol?.toLowerCase()]:{ s: asset.symbol,
          ap: asset.price,
          bp: asset.price,
          lp: asset.previousClose}

      });
    } else {
      const resData = await response.json();
      throw new Error(resData.message);
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const fetchStremData = (stream, symbols, updatePrice) => {
  const socket = new WebSocket(`wss://${stream}.financialmodelingprep.com`);
  // Connection opened
  socket.addEventListener("open", (event) => {
    console.log("WebSocket connection opened");

    // Send login message
    const loginMessage = {
      event: "login",
      data: {
        apiKey: "pranav.chaudhary@sagataltd.io",
      },
    };
    socket.send(JSON.stringify(loginMessage));
  });
  // Listen for messages
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    console.log(`WebSocket message received`, message);

    // Check if the authentication was successful
    if (message.status === 200 && message.event === "login") {
      // If authenticated, send subscribe request
      symbols.forEach((s) => {
        const subscribeMessage = {
          event: "subscribe",
          data: {
            ticker: s,
          },
        };
        socket.send(JSON.stringify(subscribeMessage));
      });
    } else if (message.status === 200 && message.event === "subscribe") {
      console.log(`Successfully subscribed to:`, message);
    } else {
      updatePrice({
        [message.s]: {
          s:message.s,
          ...(message.ap !== undefined && message.ap !== null && { ap: message.ap }),
          ...(message.bp !== undefined && message.bp !== null && { bp: message.bp }),
          ...(message.lp !== undefined && message.lp !== null && { lp: message.lp }),
         },
      });
    }
    // Handle other message types as needed
  });

  // Connection closed
  socket.addEventListener("close", (event) => {
    console.log(`WebSocket connection closed`, event);
  });
  // Handle errors
  socket.addEventListener("error", (event) => {
    console.error(`WebSocket error`, event);
  });
};

export const getBeforeDotValue = (inputString) => {
  // Check if the input string is not null and contains a dot
  if (inputString && inputString.includes('.')) {
    // Use split to get the part before the dot
    return inputString.split('.')[0];
  } else {
    // If there is no dot or the input string is null, return the original string
    return inputString;
  }
};