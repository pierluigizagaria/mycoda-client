
import React, { useState } from 'react';
import io from "socket.io-client";
import { REALTIME } from '../config/config';
import userData from '../helpers/userData';

export const SocketContext = React.createContext();

export function SocketContextProvider({children}) {

  const [socket, setSocket] = useState(null);

  function connect() {
    userData.load().then((data) =>
      setSocket(
        io(`${REALTIME.HOST}`, {
          query: {
            authentication: `Bearer ${data.accessToken}`,
          },
          jsonp: false,
        })
      )
    );
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