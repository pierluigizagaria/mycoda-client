const ENDPOINTS = {
  API: '',
  REALTIME: 'http://192.168.1.100:3000'
}

const SOCKET_EVENTS = {
  SESSION_ERROR: 'sessionError',
  SESSION_JOINED: 'sessionJoined',
  SESSION_USER_JOINED: 'userJoined',
  SESSION_USER_LEFT: 'userLeft',
}

export {
  ENDPOINTS,
  SOCKET_EVENTS,
};
