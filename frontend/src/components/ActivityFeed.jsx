import React from 'react';
import { useGame } from '../context/GameContext';
import './ActivityFeed.css';

function ActivityFeed() {
  const { activities } = useGame();

  const formatTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;

    if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
  };

  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'claim':
        return `claimed tile ${activity.details}`;
      case 'join':
        return 'joined the game';
      case 'leave':
        return 'left the game';
      default:
        return activity.details;
    }
  };

  return (
    <div className="feedContainer">
      <div className="header">
        <span className="title">⚡ ACTIVITY FEED</span>
      </div>

      <div className="entries">
        {activities.slice(0, 8).map((activity, index) => (
          <div key={index} className="entry">
            <div
              className="colorDot"
              style={{ backgroundColor: activity.userColor }}
            />

            <div className="content">
              <span className="name">{activity.userName}</span>
              <span className="action">{getActivityText(activity)}</span>
            </div>

            <div className="time">{formatTime(activity.timestamp)}</div>
          </div>
        ))}
      </div>

      <div className="footer">
        <a href="#" className="link">
          View Full Activity →
        </a>
      </div>
    </div>
  );
}

export default ActivityFeed;