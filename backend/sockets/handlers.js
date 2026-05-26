import gameState from '../game/gameState.js';
import { generateRandomUser } from '../game/users.js';

export function registerSocketHandlers(io, socket) {
  //join 
  socket.on('join', (callback) => {
    const { name, color } = generateRandomUser();

    gameState.addUser(socket.id, name, color);

    callback({
      userId: socket.id,

      name,
      color,
      tiles: gameState.getAllTiles(),
      leaderboard: gameState.getLeaderboard(),
    });

    io.emit('leaderboard_updated', gameState.getLeaderboard());
  });

  //claim tile
  socket.on('claim_tile', (tileId, callback) => {
    const result = gameState.claimTile(tileId, socket.id);

    if (result.success) {
      io.emit('tile_updated', result.tile);
      io.emit('leaderboard_updated', gameState.getLeaderboard());
    }
    callback(result);
  });

  //disconnect
  socket.on('disconnect', () => {
    gameState.removeUser(socket.id);

    io.emit('leaderboard_updated', gameState.getLeaderboard());
  });
}