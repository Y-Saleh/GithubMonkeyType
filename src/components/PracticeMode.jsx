import React, { useState, useEffect, useCallback, useRef } from 'react';
import { practiceCommands } from '../data/commands';
import Stats from './Stats';

const COUNT = 15; // Number of commands to type

const PracticeMode = () => {
    const [targetText, setTargetText] = useState('');
    const [userInput, setUserInput] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [isFinished, setIsFinished] = useState(false);
    const [stats, setStats] = useState({ wpm: 0, accuracy: 0 });
    const [errorIndex, setErrorIndex] = useState(null); // Track first error

    const inputRef = useRef(null);

    const [targetCommands, setTargetCommands] = useState([]);
    const [currTime, setCurrTime] = useState(0);

    const generateText = useCallback(() => {
        let commands = [];
        for (let i = 0; i < COUNT; i++) {
            const randomCmdObj = practiceCommands[Math.floor(Math.random() * practiceCommands.length)];
            commands.push(randomCmdObj);
        }
        setTargetCommands(commands);
        return commands.map(c => c.cmd).join('\n');
    }, []);

    const restart = useCallback(() => {
        setTargetText(generateText());
        setUserInput('');
        setStartTime(null);
        setEndTime(null);
        setCurrTime(0);
        setIsFinished(false);
        setErrorIndex(null);
        // Focus input
        setTimeout(() => inputRef.current?.focus(), 10);
    }, [generateText]);

    useEffect(() => {
        restart();
    }, [restart]);

    useEffect(() => {
        let interval = null;
        if (startTime && !isFinished) {
            interval = setInterval(() => {
                setCurrTime((Date.now() - startTime) / 1000);
            }, 100);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [startTime, isFinished]);

    // Handle Input
    const handleKeyDown = (e) => {
        if (isFinished) {
            if (e.key === 'Tab') {
                e.preventDefault();
                restart();
            }
            return;
        }

        if (e.key === 'Tab') {
            e.preventDefault();
            restart();
            return;
        }

        // Prevent premature Enter which causes scrolling desync
        if (e.key === 'Enter') {
            const nextChar = targetText[userInput.length];
            if (nextChar !== '\n') {
                e.preventDefault();
                return;
            }
        }

        // Timer start
        if (!startTime && userInput.length === 0 && e.key.length === 1) {
            setStartTime(Date.now());
        }

        // Input focus is handled by hidden input, onChange updates state
    };

    const handleChange = (e) => {
        const val = e.target.value;
        if (isFinished) return;

        // Timer start (fallback if handleKeyDown didn't catch it?)
        if (!startTime && val.length === 1) {
            setStartTime(Date.now());
        }

        setUserInput(val);

        if (val.length === targetText.length) {
            finish(val);
        }
    };

    const finish = (finalInput) => {
        const end = Date.now();
        setEndTime(end);
        setIsFinished(true);

        const timeInMinutes = (end - (startTime || Date.now())) / 60000;
        const words = finalInput.length / 5;
        const wpm = Math.round(words / timeInMinutes) || 0;

        // Accuracy
        let correct = 0;
        for (let i = 0; i < finalInput.length; i++) {
            if (finalInput[i] === targetText[i]) correct++;
        }
        // Simple accuracy: chars correct / total chars typed (assuming no backspace over-counting for now, 
        // real MonkeyType tracks total keypresses vs correct ones. Here we just compare final string)
        // To be more precise we could track total keystrokes, but simple string comparison is okay for v1.
        const accuracy = Math.round((correct / finalInput.length) * 100);

        setStats({ wpm, accuracy });
    };

    // Render text
    // Render text
    const renderText = () => {
        const currentLineIndex = (userInput.match(/\n/g) || []).length;
        const startLine = currentLineIndex;
        const endLine = startLine + 5;

        // We need to track the global index across all commands to correctly map user input
        let globalCharIndex = 0;
        const rows = [];

        targetCommands.forEach((cmdObj, lineIndex) => {
            const cmdStr = cmdObj.cmd;
            const isVisible = lineIndex >= startLine && lineIndex < endLine;

            // If a line is skipped, we still need to advance the globalCharIndex
            // counting characters + newline (if not last line)
            if (!isVisible) {
                globalCharIndex += cmdStr.length + (lineIndex < targetCommands.length - 1 ? 1 : 0);
                return;
            }

            const lineElements = [];

            // 1. Render Characters of the command
            for (let i = 0; i < cmdStr.length; i++) {
                const char = cmdStr[i];
                const index = globalCharIndex + i; // absolute index

                let className = 'char';
                const userChar = userInput[index];

                // Space handling
                const isSpace = char === ' ';
                const style = isSpace ? { whiteSpace: 'pre', width: '0.6em', display: 'inline-block' } : {};

                if (userChar === undefined) {
                    if (index === userInput.length) {
                        lineElements.push(<span key={index} className="char caret" style={style}>{char}</span>);
                    } else {
                        lineElements.push(<span key={index} className="char" style={style}>{char}</span>);
                    }
                } else {
                    if (userChar === char) {
                        className += ' correct';
                    } else {
                        className += ' incorrect';
                    }
                    lineElements.push(<span key={index} className={className} style={style}>{char}</span>);
                }
            }

            // 2. Render Newline (or End Description)
            // If strictly inside the list (has a following command), render newline logic
            if (lineIndex < targetCommands.length - 1) {
                const char = '\n';
                const index = globalCharIndex + cmdStr.length;
                const userChar = userInput[index];
                const isCurrent = index === userInput.length;
                // Note: userChar might be undefined if not typed yet
                // If typed, it should be '\n'

                const baseClass = `char ${isCurrent ? 'caret' : ''} ${userChar === char ? 'correct' : (userChar !== undefined ? 'incorrect' : '')}`;

                const currentDesc = cmdObj.desc;

                lineElements.push(
                    <span key={index} className={baseClass} style={{ flexGrow: 1, textAlign: 'left', margin: '0.2em 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: '20px' }}>
                        <span>
                            <span style={{ opacity: 0.3, fontSize: '0.8em', marginRight: '1rem' }}>↵</span>
                        </span>
                        <span style={{ fontSize: '0.8em', color: '#6e7681', fontStyle: 'italic', marginRight: '2rem' }}>
                            {currentDesc}
                        </span>
                    </span>
                );
            } else {
                // Last line: append description differently since no \n char exists in targetText
                const lastDesc = cmdObj.desc;
                // Just append a div to the end of the line elements
                lineElements.push(
                    <div key={`desc-${lineIndex}`} style={{ flexGrow: 1, textAlign: 'right', display: 'flex', justifyContent: 'flex-end', marginLeft: '1rem' }}>
                        <span style={{ fontSize: '0.8em', color: '#6e7681', fontStyle: 'italic', marginRight: '2rem' }}>
                            {lastDesc}
                        </span>
                    </div>
                );
            }

            // Wrap the line
            rows.push(
                <div key={lineIndex} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
                    {lineElements}
                </div>
            );

            // Advance index
            globalCharIndex += cmdStr.length + (lineIndex < targetCommands.length - 1 ? 1 : 0);
        });

        return rows;
    };

    if (isFinished) {
        return <Stats wpm={stats.wpm} accuracy={stats.accuracy} onRestart={restart} />;
    }

    return (
        <div className="container fade-in flex flex-col items-center" onClick={() => inputRef.current?.focus()}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', color: 'var(--accent-color)', fontSize: '1.2rem', fontFamily: 'monospace' }}>
                {currTime.toFixed(1)}s
            </div>
            <div className="typing-area" style={{ marginBottom: '1rem', flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'flex-start', textAlign: 'left' }}>
                {renderText()}
            </div>
            <textarea
                ref={inputRef}
                className="hidden-input"
                value={userInput}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                autoFocus
                autoComplete="off"
                id="hidden-input"
            />
            <p>Type the commands above. Press <strong>Enter</strong> for new line, <strong>Tab</strong> to restart.</p>
        </div>
    );
};

export default PracticeMode;
