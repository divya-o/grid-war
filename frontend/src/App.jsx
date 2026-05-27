import React, { useState, useEffect } from 'react';
import { socket, joinGame } from './socket/socket';
import { useGame } from './context/GameContext';
import Header from './components/Header';
import Grid from './components/Grid';
import Leaderboard from './components/Leaderboard';
import ActivityFeed from './components/ActivityFeed';
import './App.css';

function App() {
 const {
    setCurrentUser,
    setOnlineCount,
    setLeaderboard,
    addActivity,
    setIsConnected,
  } = useGame();
 
  const [loading, setLoading] = useState(true);
  const [initialTiles, setInitialTiles] = useState([]);
 
  useEffect(() => {
    // Connection established
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('[✓] Connected to server');
    });
 
    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('[✗] Disconnected from server');
    });
 
    // Join game
    const initializeGame = async () => {
      try {
        const data = await joinGame();
        
        setCurrentUser({
          id: data.userId,
          name: data.name,
          color: data.color,
        });

        setInitialTiles(data.tiles);
        setOnlineCount(data.users.length);
        setLeaderboard(data.leaderboard);
 
        data.activities.forEach((activity) => {
          addActivity(activity);
        });
 
        setLoading(false);
      } catch (error) {
        console.error('Failed to join game:', error);
        setLoading(false);
      }
    };
 
    initializeGame();
 
    // Listen for real-time updates
    socket.on('user_joined', (data) => {
      setOnlineCount(data.onlineCount);
      setLeaderboard(data.leaderboard);
      addActivity({
        type: 'join',
        userId: data.userId,
        userName: data.name,
        userColor: data.color,
        details: 'joined the game',
        timestamp: Date.now(),
      });
    });
 
    socket.on('user_left', (data) => {
      setOnlineCount(data.onlineCount);
      setLeaderboard(data.leaderboard);
    });
 
    socket.on('leaderboard_updated', (leaderboard) => {
      setLeaderboard(leaderboard);
    });
 
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('user_joined');
      socket.off('user_left');
      socket.off('leaderboard_updated');
    };
  }, [setCurrentUser, setOnlineCount, setLeaderboard, addActivity, setIsConnected]);
 
  if (loading) {
    return (
      <div className="loadingContainer">
        <div className="spinner"></div>
        <p>Joining the game...</p>
      </div>
    );
  }
  
  return (
    <div className="app">
      <Header />
      <div className="container">
        <Grid initialTiles={initialTiles} />

        <div className="sidebar">
          <Leaderboard />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}

export default App;