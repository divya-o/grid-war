import React from 'react';
import Grid from './components/Grid';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <Grid />
      </div>
    </div>
  );
}

export default App;