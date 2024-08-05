import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from './AuthContext';
import { WSS_URL } from '../constants';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [ready, setReady] = useState(false);
  const userId = user?.id;

  // Ref to store message handlers to avoid re-creating handlers
  const messageHandlers = useRef({});

  useEffect(() => {
    const ws = new WebSocket(WSS_URL);

    ws.onopen = () => {
      console.log('WebSocket connection established');
      setReady(true);
      if (userId) {
        ws.send(JSON.stringify({
          type: 'registerUser',
          data: { userId }
        }));
      }
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (messageHandlers.current[message.type]) {
        messageHandlers.current[message.type](message.data);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setReady(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setSocket(ws);

    return () => {
      ws.close();
      setSocket(null);
    };
  }, [userId]);

  const registerMessageHandler = (type, handler) => {
    messageHandlers.current[type] = handler;
  };

  const unregisterMessageHandler = (type) => {
    delete messageHandlers.current[type];
  };

  return (
    <WebSocketContext.Provider value={{ socket, ready, setReady, registerMessageHandler, unregisterMessageHandler }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
