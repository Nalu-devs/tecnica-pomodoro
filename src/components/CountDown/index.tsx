import styles from './styles.module.css';
import { useEffect, useState } from 'react';
import type { TaskStateModel } from '../../models/TaskStateModel';

type CountDownProps = {
    state: TaskStateModel;
    setState: React.Dispatch<React.SetStateAction<TaskStateModel>>;
}

export function CountDown({ state, setState }: CountDownProps){
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval: number | null = null;

        if (isRunning && state.secondsRemaining > 0) {
            interval = setInterval(() => {
                setState(prevState => {
                    const newSeconds = prevState.secondsRemaining - 1;
                    
                    if (newSeconds === 0) {
                        setIsRunning(false);
                        return {
                            ...prevState,
                            secondsRemaining: newSeconds,
                            formattedSecondsRemaining: formatTime(newSeconds)
                        };
                    }

                    return {
                        ...prevState,
                        secondsRemaining: newSeconds,
                        formattedSecondsRemaining: formatTime(newSeconds)
                    };
                });
            }, 1000);
        } else if (state.secondsRemaining === 0) {
            setIsRunning(false);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, state.secondsRemaining, setState]);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getCurrentTimeMinutes = (): number => {
        const cycleOrder: (keyof TaskStateModel['config'])[] = ['workTime', 'shortBreakTime', 'workTime', 'shortBreakTime', 'workTime', 'shortBreakTime', 'workTime', 'longBreakTime'];
        const currentType = cycleOrder[state.currentCycle] || 'workTime';
        return state.config[currentType];
    };

    const handleStart = () => {
        if (state.secondsRemaining === 0) {
            const totalSeconds = getCurrentTimeMinutes() * 60;
            setState(prevState => ({
                ...prevState,
                secondsRemaining: totalSeconds,
                formattedSecondsRemaining: formatTime(totalSeconds)
            }));
        }
        setIsRunning(true);
    };

    const handlePause = () => {
        setIsRunning(false);
    };

    const handleReset = () => {
        setIsRunning(false);
        setState(prevState => ({
            ...prevState,
            secondsRemaining: 0,
            formattedSecondsRemaining: '00:00'
        }));
    };

    const handleNextCycle = () => {
        setIsRunning(false);
        const nextCycle = (state.currentCycle + 1) % 8;
        const cycleOrder: (keyof TaskStateModel['config'])[] = ['workTime', 'shortBreakTime', 'workTime', 'shortBreakTime', 'workTime', 'shortBreakTime', 'workTime', 'longBreakTime'];
        const nextType = cycleOrder[nextCycle];
        const totalSeconds = state.config[nextType] * 60;
        
        setState(prevState => ({
            ...prevState,
            currentCycle: nextCycle,
            secondsRemaining: totalSeconds,
            formattedSecondsRemaining: formatTime(totalSeconds)
        }));
    };

    return(
        <div className={styles.container}>
            <div className={styles.timer}>
                {state.formattedSecondsRemaining}
            </div>
            <div className={styles.controls}>
                {!isRunning ? (
                    <button onClick={handleStart} className={styles.button}>
                        Iniciar
                    </button>
                ) : (
                    <button onClick={handlePause} className={styles.button}>
                        Pausar
                    </button>
                )}
                <button onClick={handleReset} className={styles.button}>
                    Resetar
                </button>
                <button onClick={handleNextCycle} className={styles.button}>
                    Próximo Ciclo
                </button>
            </div>
        </div>
    );
}