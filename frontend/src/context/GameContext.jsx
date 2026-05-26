import React, { createContext, useState, useContext } from 'react';
const GameContext = createContext();

export function GameProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  return (
    <GameContext.Provider
      value={{

        currentUser,
        setCurrentUser,
        leaderboard,
        setLeaderboard,
        isConnected,
        setIsConnected,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}