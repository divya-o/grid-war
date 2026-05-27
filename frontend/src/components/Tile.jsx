import React, { useCallback } from 'react';
import { claimTile } from '../socket/socket';
import './Tile.css';

const Tile = React.memo(function Tile({ tile, onClaimError }) {
  const handleClick = useCallback(async () => {
    try {
      await claimTile(tile.id);
    } catch (error) {
      onClaimError?.(error.message);
    }
  }, [tile.id, onClaimError]);

  const isLocked = tile.lockedUntil && Date.now() < tile.lockedUntil;
  const lockProgress = isLocked
    ? ((tile.lockedUntil - Date.now()) / 3000) * 100
    : 0;

  return (
    <div
      className={`tile ${isLocked ? 'locked' : ''}`}
      onClick={handleClick}
      style={{
        backgroundColor: tile.ownerColor || '#1a1f3a',
      }}
    >
      {isLocked && (
        <div
          className="lockRing"
          style={{
            borderColor: tile.ownerColor,
            opacity: Math.max(0.3, lockProgress / 100),
          }}
        />
      )}
      {tile.ownerColor && (
        <div className="corner" style={{ backgroundColor: tile.ownerColor }} />
      )}
    </div>
  );
});

export default Tile;