import gameState from '../game/gameState.js';
import { generateRandomUser } from '../game/users.js';

export function registerSocketHandlers(io, socket) {
  //join 
  socket.on('join', (callback) => {
    const { name, color } = generateRandomUser();
    const userId = socket.id;

    gameState.addUser(userId, name, color);
    gameState.addActivity('join', userId, name, color, 'joined the game');

    callback({
      userId,

      name,
      color,
      tiles: gameState.getAllTiles(),
      users: gameState.getAllUsers(),
      leaderboard: gameState.getLeaderboard(),
      activities: gameState.getActivityLog(),
    });

    io.emit('leaderboard_updated', gameState.getLeaderboard());
  });

  //claim tile
  socket.on('claim_tile', (tileId, callback) => {
    const userId = socket.id;
    const user = gameState.getUser(userId);
    if (!user) {
      callback({ success: false, reason: 'User not found' });
      return;
    }


    const result = gameState.claimTile(tileId, userId);

    if (result.success) {
      const tile = result.tile;
      io.emit('tile_updated', result.tile);
      io.emit('leaderboard_updated', gameState.getLeaderboard());
      callback({ success: true, tile });
    } else {
      callback({ success: false, reason: result.reason });
    }
  });

  //disconnect
  socket.on('disconnect', () => {
    const user = gameState.getUser(socket.id);
    if (user) {
      gameState.removeUser(socket.id);
      gameState.addActivity('leave', socket.id, user.name, user.color, 'left the game');

    // Notify all users
      io.emit('user_left', {
        userId: socket.id,
        onlineCount: gameState.getAllUsers().length,
        leaderboard: gameState.getLeaderboard(),
      });
    }
  });
}