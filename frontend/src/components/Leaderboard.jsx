import React from 'react';
import { useGame } from '../context/GameContext';
import './Leaderboard.css';

function Leaderboard() {
  const { leaderboard, currentUser } = useGame();

  return (
    <div className="leaderboardContainer">
      <div className="header">
        <span className="title">🏆 LEADERBOARD</span>
      </div>

      <div className="entries">
        {leaderboard.slice(0, 8).map((entry, index) => {
          const isCurrentUser = currentUser?.id === entry.userId;

          return (
            <div
              key={entry.userId}
              className={`entry ${isCurrentUser ? 'active' : ''}`}
            >
              <div className="rank">{index + 1}</div>

              <div
                className="colorDot"
                style={{ backgroundColor: entry.color }}
              />

              <div className="name">{entry.name}</div>

              <div className="count">{entry.tileCount}</div>
            </div>
          );
        })}
      </div>

      <div className="footer">
        <a href="#" className="link">
          View Full Leaderboard →
        </a>
      </div>
    </div>
  );
}

export default Leaderboard;