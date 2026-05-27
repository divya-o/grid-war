import React from 'react';
import { useGame } from '../context/GameContext';
import './Header.css';

function Header() {
  const { currentUser, onlineCount, leaderboard, isConnected } = useGame();

  const myTileCount = currentUser
    ? leaderboard.find((entry) => entry.userId === currentUser.id)?.tileCount || 0 : 0;

  const myRank = currentUser
    ? leaderboard.findIndex((entry) => entry.userId === currentUser.id) + 1 : 0;

  return (
    <div className="header">
      <div className="logo">
        <div className="logoIcon">🔷</div>
        <div>
          <h1>REALTIME GRID</h1>
          <p>Claim.Conquer</p>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <span className="statIcon">●</span>
          <span className="label">Online:</span>
          <span className="value">{onlineCount}</span>
        </div>

        <div className="stat">
          <span className="statIcon">▦</span>
          <span className="label">Tiles Claimed:</span>
          <span className="value">{myTileCount}</span>
        </div>

        <div className="stat">
          <span className="statIcon">⭐</span>
          <span className="label">Rank:</span>
          <span className="value">#{myRank || '-'}</span>
        </div>
      </div>

      <div className="user">
        {currentUser && (
          <>
            <div
              className="userColor"
              style={{ backgroundColor: currentUser.color }}
            />
            <div>
              <div className="userName">{currentUser.name}</div>
              <div className="userId">{currentUser.id.slice(0, 5)}</div>
            </div>
          </>
        )}
        <div
          className={`connectionStatus ${
            isConnected ? 'connected' : 'disconnected'
          }`}
        >
          ●
        </div>
      </div>
    </div>
  );
}

export default Header;