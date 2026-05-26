const GRID_WIDTH = 30;
const GRID_HEIGHT = 30;

class GameState {

  constructor() {
    this.tiles= new Map();
    this.users= new Map();
    this.activityLog =[];

    this.initializeTiles();
  }

  initializeTiles() {
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {

        const id = `tile_${x}_${y}`;  //id given

        this.tiles.set(id, {
          id,
          x,
          y,
          ownerId: null,
          ownerName: null,
          ownerColor: null,
          claimedAt: null,
        });
      }
    }
  }

  addUser(userId, userName, userColor) {
    this.users.set(userId, {
      id: userId,
      name: userName,
      color: userColor,
      joinedAt: Date.now(),
    });

    this.addActivity(
      'join',
      userId,
      userName,
      userColor,
      'joined the game'
    );
  }

  removeUser(userId) {
    const user= this.users.get(userId);

    if (user) {
      this.addActivity(
        'leave',
        user.id,
        user.name,
        user.color,
        'left the game'
      );
    }

    this.users.delete(userId);
  }

  getUser(userId) {
    return this.users.get(userId);
  }

  claimTile(tileId, userId) {
    const tile = this.tiles.get(tileId);

    if (!tile) {
      return {
        success: false,
        reason: 'Tile not found',
      };
    }

    const user = this.users.get(userId);

    if (!user) {
      return {
        success: false,
        reason:'User not found',
      };
    }

    //update ownership
    tile.ownerId = user.id;
    tile.ownerName = user.name;
    tile.ownerColor = user.color;
    tile.claimedAt = Date.now();

    //track activity
    this.addActivity(
      'claim',
      user.id,
      user.name,
      user.color,
      `${tile.x}, ${tile.y}`
    );

    return {
      success: true,
      tile,
    };
  }

  getTile(tileId) {
    return this.tiles.get(tileId);
  }

  getAllTiles() {
    return Array.from(this.tiles.values());
  }

  getAllUsers() {
    return Array.from(this.users.values());
  }

  addActivity(type, userId, userName, userColor, details) {
    this.activityLog.push({
      type,
      userId,
      userName,
      userColor,
      details,
      timestamp: Date.now(),
    });

    //latest 50 events
    if (this.activityLog.length > 50) {
      this.activityLog.shift();
    }
  }

  getActivityLog() {
    return this.activityLog;
  }

  getLeaderboard() {
    const scores = {};

    //ccount owned tiles
    this.tiles.forEach((tile) => {
      if (tile.ownerId) {
        scores[tile.ownerId] = (scores[tile.ownerId] || 0) + 1;
      }
    });

    return Object.entries(scores)
      .map(([userId, tileCount]) => {
        const user= this.users.get(userId);

        return {
          userId,
          name:  user?.name || 'Unknown',
          color:  user?.color || '#ffffff',
          tileCount,
        };
      })

      .sort((a, b) => b.tileCount - a.tileCount)
      .slice(0, 10);
  }
}

export default new GameState();