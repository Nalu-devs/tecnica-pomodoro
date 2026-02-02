import styles from './styles.module.css';
import type { TaskStateModel } from '../../models/TaskStateModel';

type CountDownProps = {
    state: TaskStateModel;
    setState: React.Dispatch<React.SetStateAction<TaskStateModel>>;
    isTimerRunning?: boolean;
    onStartTimer?: () => void;
    onPauseTimer?: () => void;
    onResetTimer?: () => void;
}

export function CountDown({ 
    state, 
    setState, 
    isTimerRunning = false,
    onStartTimer = () => {},
    onPauseTimer = () => {},
    onResetTimer = () => {}
}: CountDownProps){

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
        onStartTimer();
    };

    const handlePause = () => {
        onPauseTimer();
    };

    const handleReset = () => {
        onResetTimer();
    };

    const handleNextCycle = () => {
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

    const getCycleType = () => {
        const cycleOrder: (keyof TaskStateModel['config'])[] = ['workTime', 'shortBreakTime', 'workTime', 'shortBreakTime', 'workTime', 'shortBreakTime', 'workTime', 'longBreakTime'];
        return cycleOrder[state.currentCycle] || 'workTime';
    };

    const cycleType = getCycleType();

    return(
        <div className={styles.container}>
            <div className={`${styles.timer} ${styles[cycleType]}`}>
                {state.formattedSecondsRemaining}
            </div>
            <div className={styles.cycleInfo}>
                <span className={styles.cycleLabel}>
                    {cycleType === 'workTime' ? '🍅 Foco' : cycleType === 'shortBreakTime' ? '☕ Pausa Curta' : '🌊 Pausa Longa'}
                </span>
            </div>
            <div className={styles.controls}>
                {!isTimerRunning ? (
                    <button onClick={handleStart} className={styles.button}>
                        ▶️ Iniciar
                    </button>
                ) : (
                    <button onClick={handlePause} className={styles.button}>
                        ⏸️ Pausar
                    </button>
                )}
                <button onClick={handleReset} className={styles.button}>
                    🔄 Resetar
                </button>
                <button onClick={handleNextCycle} className={styles.button}>
                    ⏭️ Próximo Ciclo
                </button>
            </div>
        </div>
    );
}