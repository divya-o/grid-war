# Real-Time Grid - Multiplayer Tile Claiming Game

A fast, interactive, real-time multiplayer web application where users compete to claim 

## features

- **Real-time Synchronization**: all players see updates instantly via WebSocket
- **Server-Authoritative State**: prevents cheating with backend validation
- **Conflict-Safe Claiming**: first-write-wins conflict resolution
- **Cooldown System**: 3-second lockout after claiming to prevent spam
- **Live Leaderboard**: track top players by tile count
- **Activity Feed**: see recent actions from all players
- **Optimized Rendering**: memoized tiles prevent unnecessary re-renders
- **Responsive UI**: dark theme with vibrant neon colors


## Quick Start

### Prerequisites required:
- Node.js 16+ installed
- npm or yarn

### Server Setup

```bash
cd backend
npm install
npm start
```

### Client Setup

```bash
cd frontend
npm install
npm run dev
```

## Architecture Overview

### Backend State Management

**Game State (In-Memory)**
- `tiles`: Map of all 900 tiles (30×30)
- `users`: Map of connected players
- `activityLog`: Recent actions for activity feed
- Leaderboard calculated dynamically per request

**Server-Authoritative Conflict Resolution**
- Client requests - Server validates - Server updates state - Broadcast to all
- Prevents duplicate claims via sequential event processing
- Cooldown validation prevents tile reclaim by 3-second lockout

### Frontend State Management

**Context (Global)**
- `currentUser`: Current player identity
- `onlineCount`: Connected player count
- `leaderboard`: Top 10 players
- `activities`: Recent activity log
- `isConnected`: WebSocket status

**Local Component State**
- Grid holds tile data locally 
- Tile components are memoized to prevent unnecessary updates

### Real-Time Communication

**Client → Server Events**
- `join`: Player joins game
- `claim_tile`: Player claims a tile

**Server → Client Events**
- `initial_state`: Sent when player joins 
- `tile_updated`: Broadcast when tile ownership changes
- `user_joined`: Broadcast when new player joins
- `user_left`: Broadcast when player disconnects
- `leaderboard_updated`: Sent after tile updates

## Design Decisions

### Why In-Memory State?
Keeps focus on real-time synchronization and interaction quality instead of persistence infrastructure. Production would add Redis or database.

### Why Memoized Tiles?
React.memo ensures only changed tiles re-render.

### Why Local Grid State?
Prevents app-wide re-renders. Context is reserved for global data, tiles stored locally in Grid component

### Why Server-Authoritative?
Client cannot be trusted for ownership, server validates all changes before broadcasting

### Why Cooldown Lock?
Prevents tile-spam behavior and demonstrates backend validation logic. Optional feature but adds polish

## How It Works

### Claiming a Tile

1. User clicks tile on grid
2. Client emits (claim_tile) event with tile ID
3. Server validates:
   - User exists
   - Tile exists
   - Tile not in cooldown
4. Server updates tile ownership
5. Server broadcasts (tile_updated) to all clients
6. All clients update grid in real-time
7. Server broadcasts (leaderboard_updated)

### Simultaneous Claims

If multiple users click the same tile simultaneously:
- Node.js event loop processes sequentially
- First request in queue wins
- Second request receives "--Tile is locked" error
- Cooldown prevents immediate reclaim

## Performance Optimizations

**Rendering**
- Tile components memoized with (react.memo`)
- Grid state isolated 
- Only changed tiles re-render

**Network**
- Socket.IO automatic reconnection
- Debounced leaderboard updates
- Activity log capped at 50 entries

**UI**
- CSS transitions for smooth animations
- Hardware-accelerated transforms
- Minimal DOM churn

## Scalability 

**Current preferences**
- In-memory state lost on restart
- Single-process server (no clustering)
- No persistence layer

**Future Additions**
- Redis pub/sub for horizontal scaling
- PostgreSQL for persistent tiles/users
- Socket.IO adapters for multi-server setup
- Rate limiting per user
- Tile history/audit log

Intentionally not implemented for current scope.

##  Testing

### Manual Testing Checklist

- [ ] Join game → Receive random name and color
- [ ] See other players join in real-time
- [ ] Click tile → Ownership updates immediately
- [ ] Cooldown lock prevents reclaim for 3 seconds
- [ ] Leaderboard updates after claims
- [ ] Activity feed shows recent actions
- [ ] Disconnect → Other players see you leave
- [ ] Reconnect → Recover full game state

## License

Open source.
