import React, { useState, useEffect, useCallback } from 'react';
import { socket } from '../socket/socket';
import Tile from './Tile';
import './Grid.css';

function Grid({ initialTiles = [] }) {
  const [tiles, setTiles] = useState({});
  const [error, setError] = useState('');

  // initialiaze tiles from socket
  useEffect(() => {
    if (initialTiles && initialTiles.length > 0) {
      const tilesMap = {};
      initialTiles.forEach((tile) => {
        tilesMap[tile.id] = tile;
      });
      setTiles(tilesMap);
    }
  }, [initialTiles]);
  //listen
  useEffect(() => {
    const handleTileUpdated = (tile) => {
      setTiles((prev) => ({
        ...prev,
        [tile.id]: tile,
      }));
    };

    socket.on('tile_updated', handleTileUpdated);

    return () => {
      socket.off('tile_updated', handleTileUpdated);
    };
  }, []);

  const handleClaimError = useCallback((message) => {
    setError(message);
    setTimeout(() => setError(''), 3000);
  }, []);

  const tileIds = Object.keys(tiles);
  const gridSize = 30;

  return (
    <div className="gridContainer">
      {error && <div className="errorMessage">{error}</div>}

      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {tileIds.map((tileId) => (
          <Tile
            key={tileId}
            tile={tiles[tileId]}
            onClaimError={handleClaimError}
          />
        ))}
      </div>
    </div>
  );
}

export default Grid;