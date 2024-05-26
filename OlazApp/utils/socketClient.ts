import io from 'socket.io-client';

import { BASE_URL } from '@env';

export let socket : any;    

export function init() {
    if (!socket) {
    socket = io(BASE_URL, {
        transports: ['websocket'],
    });
}
}


  export function disconnect() {
    if (socket) {
      socket.disconnect();
      socket.close();
    }
    socket = null;
  }