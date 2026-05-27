import React, { createContext, useState, useContext, useCallback } from 'react';
const GameContext = createContext();

export function GameProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [onlineCount, setOnlineCount] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activities, setActivities] = useState([]);

  const [isConnected, setIsConnected] = useState(false);

  const updateLeaderboard = useCallback((newLeaderboard) => {
    setLeaderboard(newLeaderboard);
  }, []);
 
  const updateOnlineCount = useCallback((count) => {
    setOnlineCount(count);
  }, []);
 
  const addActivity = useCallback((activity) => {
    setActivities((prev) => [activity, ...prev].slice(0, 10));
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
    onlineCount,
    setOnlineCount: updateOnlineCount,
    leaderboard,
    setLeaderboard: updateLeaderboard,
    activities,
    addActivity,
    isConnected,
    setIsConnected,
  };

  return (
    <GameContext.Provider
      value=
        {value}>{children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = React.useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}