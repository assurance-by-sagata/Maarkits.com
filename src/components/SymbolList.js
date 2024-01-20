import React, { useEffect,useState } from 'react';

const SymbolList = ({ symbol,onUpdate }) => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const socket = new WebSocket('wss://websockets.financialmodelingprep.com');

    // Connection opened
    socket.addEventListener('open', (event) => {
      console.log('WebSocket connection opened for symbol', symbol);

      // Send login message
      const loginMessage = {
        event: 'login',
        data: {
          apiKey: '6fbceaefb411ee907e9062098ef0fd66',
        },
      };
      socket.send(JSON.stringify(loginMessage));
    });

    // Listen for messages
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      console.log(`WebSocket message received for symbol ${symbol}:`, message);

      // Check if the authentication was successful
      if (message.status === 200 && message.event ==="login") {
        // If authenticated, send subscribe request
        const subscribeMessage = {
          event: 'subscribe',
          data: {
            ticker: symbol,
          },
        };
        socket.send(JSON.stringify(subscribeMessage));
      } else if ( message.status === 200 && message.event === 'subscribe') {
        console.log(`Successfully subscribed to ${symbol}`);

      }else{
        onUpdate(symbol, message);
      }
      // Handle other message types as needed
    });

    // Connection closed
    socket.addEventListener('close', (event) => {
      console.log(`WebSocket connection closed for symbol ${symbol}:`, event);
    });

    // Cleanup on component unmount
    return () => {
      console.log(`Cleaning up WebSocket connection for symbol ${symbol}`);
      socket.close();
    };
  }, [symbol,onUpdate]);

  return null;
};

export default SymbolList;
