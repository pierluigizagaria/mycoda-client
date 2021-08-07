
import React, { useState } from 'react';
import io from "socket.io-client";
import { REALTIME } from '../config/config';
import localUserData from '../helpers/localUserData';

export const SocketContext = React.createContext();

export function SocketContextProvider({children}) {

  const [socket, setSocket] = useState(null);

  function connect(accessToken) {
    const socket = io(`${REALTIME.HOST}`, {
      query: {
        authentication: `Bearer ${accessToken}`,
      },
      jsonp: false,
    });
    setSocket(socket);
  };

  function disconnect() {
    if (socket) socket.disconnect();
    setSocket(null);
  }
  
  return (
    <SocketContext.Provider value={{ connect, disconnect, socket }}>
      {children}
    </SocketContext.Provider>
  );
};