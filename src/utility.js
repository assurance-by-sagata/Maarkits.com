import { COMANYWEBSOCKET } from "./config";

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
    { minimumFractionDigits: 2 }
  )}`;
  return formattedValue;
};
export const formatValue = (pl, symbol) => {
  const formattedValue = `${symbol}${Math.abs(pl).toLocaleString("en-US", {
    minimumFractionDigits: 2,
  })}`;
  return formattedValue;
};
export const fetchStremDataForSymbol = (symbl) => {
  return new Promise((resolve, reject) => {
    const symbol = symbl.symbol;
    const socket = new WebSocket("wss://forex.financialmodelingprep.com");
    // Connection opened
    socket.addEventListener("open", (event) => {
      console.log("WebSocket connection opened for symbol", symbol);

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
      console.log(`WebSocket message received for symbol ${symbol}:`, message);

      // Check if the authentication was successful
      if (message.status === 200 && message.event === "login") {
        // If authenticated, send subscribe request
        const subscribeMessage = {
          event: "subscribe",
          data: {
            ticker: symbol,
          },
        };
        socket.send(JSON.stringify(subscribeMessage));
      } else if (message.status === 200 && message.event === "subscribe") {
        console.log(`Successfully subscribed to ${symbol}`);
      } else {
        // Resolve the promise with the received data
        resolve(message);
      }
      // Handle other message types as needed
    });

    // Connection closed
    socket.addEventListener("close", (event) => {
      console.log(`WebSocket connection closed for symbol ${symbol}:`, event);
    });
    // Handle errors
    socket.addEventListener("error", (event) => {
      console.error(`WebSocket error for symbol ${symbol}:`, event);
      reject(event); // Reject the promise in case of an error
    });
  });
};
