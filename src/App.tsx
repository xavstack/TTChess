import type { JSX } from 'react';
import AppShell from './components/Layout/AppShell';
import ChessBoard from './components/Board/ChessBoard';
import './index.css';

function App(): JSX.Element {
  return (
    <AppShell>
      <ChessBoard />
    </AppShell>
  );
}

export default App;
