import React, { useEffect } from 'react';

const Stats = ({ wpm, accuracy, onRestart }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Allow user to use Tab to restart quickly
            if (e.key === 'Tab') {
                e.preventDefault();
                onRestart();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onRestart]);

    return (
        <div className="container fade-in flex flex-col items-center justify-center gap-8" style={{ marginTop: '2rem' }}>
            <div className="flex gap-8">
                <div className="stats-card">
                    <div className="stat-value">{wpm}</div>
                    <div className="stat-label">WPM</div>
                </div>
                <div className="stats-card">
                    <div className="stat-value">{accuracy}%</div>
                    <div className="stat-label">Accuracy</div>
                </div>
            </div>

            <button className="primary" onClick={onRestart} style={{ fontSize: '1.2rem', padding: '0.8rem 2rem' }}>
                Result
            </button>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>Press <strong>Tab</strong> to restart</p>
        </div>
    );
};

export default Stats;
