
import React, { Component } from 'react';
import io from "socket.io-client";
import { ENDPOINTS } from '../config/constants';

export const SocketContext = React.createContext();

export class SocketContextProvider extends Component {
  constructor() {
    super();
    this.socket = io(ENDPOINTS.REALTIME, { jsonp: false });
  }
  render() {
    return (
      <SocketContext.Provider value={this.socket}>
        {this.props.children}
      </SocketContext.Provider>
    );
  }
}