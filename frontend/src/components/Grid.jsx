import React, { useEffect, useState } from 'react';
import { socket } from '../socket/socket';
import styles from './Grid.module.css';

function Grid() {
  const [tiles, setTiles] = useState({});

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


  const gridSize = 30;
  const tileIds = Object.keys(tiles);

  return (
    <div
      className={styles.grid}
      style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
      }}
    >
      {tileIds.map((tileId) => {
        const tile = tiles[tileId];

        return (
          <div
            key={tileId}
            className={styles.tile}
            style={{
              backgroundColor: tile.color || '#1a1a1a',
            }}
          />
        );
      })}
      
    </div>
  );
}

export default Grid;