import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
 
export const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});
 
export function joinGame() {
  return new Promise((resolve, reject) => {
    socket.emit('join', (data) => {
      if (data) {
        resolve(data);
      } else {
        reject(new Error('Failed to join game'));
      }
    });
  });
}
 
export function claimTile(tileId) {
  return new Promise((resolve, reject) => {
    socket.emit('claim_tile', tileId, (response) => {
      if (response.success) {
        resolve(response.tile);
      } else {
        reject(new Error(response.reason || 'Failed to claim tile'));
      }
    });
  });
}