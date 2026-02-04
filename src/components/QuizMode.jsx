import React, { useState, useEffect, useRef, useCallback } from 'react';
import { quizQuestions } from '../data/commands';
import Stats from './Stats';

const ROUNDS = 5;

const QuizMode = () => {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [input, setInput] = useState('');
    const [startTime, setStartTime] = useState(null); // specific to question? or total runs?
    // Let's track total time for the session
    const [sessionStartTime, setSessionStartTime] = useState(null);
    const [completedTime, setCompletedTime] = useState(null); // End timestamp

    // For stats
    const [incorrectAttempts, setIncorrectAttempts] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [correctCharsTotal, setCorrectCharsTotal] = useState(0);

    // Feedback
    const [isError, setIsError] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const inputRef = useRef(null);

    const startQuiz = useCallback(() => {
        // Shuffle and pick ROUNDS
        const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random());
        setQuestions(shuffled.slice(0, ROUNDS));
        setCurrentIndex(0);
        setInput('');
        setSessionStartTime(null);
        setCompletedTime(null);
        setIncorrectAttempts(0);
        setCorrectCharsTotal(0);
        setIsFinished(false);
        setIsError(false);
        setFeedback(null);
        setTimeout(() => inputRef.current?.focus(), 10);
    }, []);

    useEffect(() => {
        startQuiz();
    }, [startQuiz]);

    const handleInputChange = (e) => {
        if (isFinished) return;
        if (!sessionStartTime) setSessionStartTime(Date.now());

        setInput(e.target.value);
        setIsError(false);
    };

    // Actually, decided to clear it on input change because otherwise it looks like a persistent error.
    // Wait, if I want to "copy" it, I need it to stay.
    // Let's COMMENT OUT the clear on input change line to let it persist until they hit Enter again or get it right.
    // Actually, I'll remove the setFeedback(null) from handleInputChange completely.

    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            startQuiz();
            return;
        }

        if (e.key === 'Enter') {
            checkAnswer();
        }
    };

    const checkAnswer = () => {
        const currentQ = questions[currentIndex];
        if (input.trim() === currentQ.answer) {
            // Correct
            setCorrectCharsTotal(prev => prev + currentQ.answer.length);
            setFeedback(null); // Clear feedback

            if (currentIndex + 1 >= ROUNDS) {
                // Done
                finish();
            } else {
                // Next
                setCurrentIndex(prev => prev + 1);
                setInput('');
            }
        } else {
            // Incorrect
            setIsError(true);
            setIncorrectAttempts(prev => prev + 1);
            setFeedback(`Correct answer: ${currentQ.answer}`);
        }
    };

    const finish = () => {
        setCompletedTime(Date.now());
        setIsFinished(true);
    };

    if (isFinished) {
        // ... stats rendering ...
        const totalTimeMin = (completedTime - sessionStartTime) / 60000;
        const wpm = Math.round((correctCharsTotal / 5) / totalTimeMin) || 0;
        const totalAttempts = ROUNDS + incorrectAttempts;
        const accuracy = Math.round((ROUNDS / totalAttempts) * 100);
        return <Stats wpm={wpm} accuracy={accuracy} onRestart={startQuiz} />;
    }

    if (questions.length === 0) return <div>Loading...</div>;

    const currentQ = questions[currentIndex];

    return (
        <div className="container fade-in flex flex-col items-center justify-center" style={{ minHeight: '50vh' }}>
            <div className="quiz-card text-center">
                <p className="stat-label">Command for:</p>
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#c9d1d9' }}>{currentQ.question}</h2>
            </div>

            <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className={`w-full ${isError ? 'error-shake' : ''}`}
                style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: `2px solid ${isError ? 'var(--error-color)' : 'var(--accent-color)'}`,
                    color: 'var(--text-color)',
                    fontSize: '1.5rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '0.5rem',
                    textAlign: 'center',
                    outline: 'none',
                    maxWidth: '600px'
                }}
                placeholder="Type command..."
                autoFocus
            />

            {feedback && (
                <div className="fade-in" style={{ marginTop: '1rem', color: 'var(--error-color)', fontSize: '1rem', fontWeight: 'bold' }}>
                    {feedback}
                </div>
            )}

            <div style={{ marginTop: '2rem', color: 'var(--subtext-color)' }}>
                {currentIndex + 1} / {ROUNDS}
            </div>

            <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>Press <strong>Enter</strong> to submit, <strong>Tab</strong> to restart</p>
        </div>
    );
};

export default QuizMode;
