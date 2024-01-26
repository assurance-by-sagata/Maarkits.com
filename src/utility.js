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
        [message.s]: message.lp ?? message.bp,
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
