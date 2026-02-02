import { Home } from './pages/Home';
import { TaskPage } from './pages/TaskPage';

import './styles/theme.css';
import './styles/global.css';
import { useState, useEffect, useRef } from 'react';
import type { TaskStateModel } from './models/TaskStateModel';

const initialState: TaskStateModel = {
    tasks: [],
    secondsRemaining: 0,
    formattedSecondsRemaining: '00:00',
    activeTask: null,
    currentCycle: 0, 
    config:{
        workTime: 25,
        shortBreakTime: 5,
        longBreakTime: 10,
    },
};

export function App() {
    const [state, setState] = useState(initialState);
    const [currentPage, setCurrentPage] = useState<'home' | 'tasks'>('home');
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const intervalRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);

    // Carregar estado salvo do localStorage
    useEffect(() => {
        const savedState = localStorage.getItem('pomodoroState');
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                setState(parsed);
            } catch (e) {
                console.error('Erro ao carregar estado salvo:', e);
            }
        }
    }, []);

    // Salvar estado no localStorage quando mudar
    useEffect(() => {
        localStorage.setItem('pomodoroState', JSON.stringify(state));
    }, [state]);

    // Lógica do timer que funciona em background
    useEffect(() => {
        if (isTimerRunning && state.secondsRemaining > 0) {
            if (!intervalRef.current) {
                startTimeRef.current = Date.now() - ((state.config.workTime * 60) - state.secondsRemaining) * 1000;
            }

            intervalRef.current = window.setInterval(() => {
                const elapsed = Math.floor((Date.now() - (startTimeRef.current || 0)) / 1000);
                const totalSeconds = state.config.workTime * 60;
                const remaining = Math.max(0, totalSeconds - elapsed);

                if (remaining === 0) {
                    setIsTimerRunning(false);
                    intervalRef.current = null;
                    playNotificationSound();
                }

                setState(prevState => ({
                    ...prevState,
                    secondsRemaining: remaining,
                    formattedSecondsRemaining: formatTime(remaining)
                }));
            }, 100);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isTimerRunning, state.secondsRemaining, state.config.workTime]);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const playNotificationSound = () => {
        // Criar som de notificação
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    };

    const startTimer = () => {
        setIsTimerRunning(true);
    };

    const pauseTimer = () => {
        setIsTimerRunning(false);
    };

    const resetTimer = () => {
        setIsTimerRunning(false);
        setState(prevState => ({
            ...prevState,
            secondsRemaining: 0,
            formattedSecondsRemaining: '00:00'
        }));
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'tasks':
                return <TaskPage state={state} setState={setState} currentPage={currentPage} setCurrentPage={setCurrentPage} />;
            default:
                return (
                    <Home 
                        state={state} 
                        setState={setState} 
                        currentPage={currentPage} 
                        setCurrentPage={setCurrentPage}
                        isTimerRunning={isTimerRunning}
                        onStartTimer={startTimer}
                        onPauseTimer={pauseTimer}
                        onResetTimer={resetTimer}
                    />
                );
        }
    };

    return (
        <div style={{ maxWidth: '100%', margin: '0 auto', padding: '0 1rem' }}>
            {renderPage()}
        </div>
    );
}