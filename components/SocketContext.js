
import React, { Component } from 'react';
import io from "socket.io-client";
import { REALTIME } from '../config/config';

export const SocketContext = React.createContext();

export class SocketContextProvider extends Component {
  socket = io(`${REALTIME.HOST}:${REALTIME.PORT}`, { jsonp: false });
  render() {
    return (
      <SocketContext.Provider value={this.socket}>
        {this.props.children}
      </SocketContext.Provider>
    );
  }
}