
import React, { Component } from 'react';
import io from "socket.io-client";
import { REALTIME } from '../config/config';
import userData from '../helpers/userData';

export const SocketContext = React.createContext();

export class SocketContextProvider extends Component {
  socket = io(`${REALTIME.HOST}:${REALTIME.PORT}`, { jsonp: false });
  constructor(props) {
    super(props);
    this.state = { socket: null };
    userData.load().then((data) => 
      this.setState({
        socket: io(`${REALTIME.HOST}:${REALTIME.PORT}`, {
          query: {
            authentication: `Bearer ${data.accessToken}`,
          },
          jsonp: false
        })
      })
    );
  }

  render() {
    return (
      <SocketContext.Provider value={{ socket: this.state.socket }}>
        {this.props.children}
      </SocketContext.Provider>
    );
  }
}