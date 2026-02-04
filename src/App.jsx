import React, { useState } from 'react';
import PracticeMode from './components/PracticeMode';
import QuizMode from './components/QuizMode';

function App() {
  const [mode, setMode] = useState('practice'); // 'practice' | 'quiz'

  return (
    <>
      <header className="container flex flex-col items-center gap-4" style={{ marginBottom: '3rem' }}>
        <div className="text-center">
          <h1>GitHub Command Typer</h1>
          <p>Master your Git CLI skills</p>
        </div>

        <nav className="flex gap-4">
          <button
            className={mode === 'practice' ? 'active' : ''}
            onClick={() => setMode('practice')}
          >
            Practice
          </button>
          <button
            className={mode === 'quiz' ? 'active' : ''}
            onClick={() => setMode('quiz')}
          >
            Quiz
          </button>
        </nav>
      </header>

      <main className="container w-full">
        {mode === 'practice' && <PracticeMode />}
        {mode === 'quiz' && <QuizMode />}
      </main>

      <footer style={{ marginTop: 'auto', padding: '2rem', color: 'var(--subtext-color)', fontSize: '0.8rem' }}>
        <p>Shortcuts: <strong>Tab</strong> to restart</p>
      </footer>
    </>
  );
}

export default App;
