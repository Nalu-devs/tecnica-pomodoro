import styles from './styles.module.css';

type CyclesProps = {
    currentCycle: number;
}

export function Cycles({ currentCycle }: CyclesProps){
    return(
        <div className={styles.cycles}>
            <span>Ciclos:</span>
            <div className={styles.cycleDots}>
                <div className={`${styles.cycleDot} ${styles.workTime} ${currentCycle === 0 ? styles.active : ''}`}></div>
                <div className={`${styles.cycleDot} ${styles.shortBreakTime} ${currentCycle === 1 ? styles.active : ''}`}></div>
                <div className={`${styles.cycleDot} ${styles.workTime} ${currentCycle === 2 ? styles.active : ''}`}></div>
                <div className={`${styles.cycleDot} ${styles.shortBreakTime} ${currentCycle === 3 ? styles.active : ''}`}></div>
                <div className={`${styles.cycleDot} ${styles.workTime} ${currentCycle === 4 ? styles.active : ''}`}></div>
                <div className={`${styles.cycleDot} ${styles.shortBreakTime} ${currentCycle === 5 ? styles.active : ''}`}></div>
                <div className={`${styles.cycleDot} ${styles.workTime} ${currentCycle === 6 ? styles.active : ''}`}></div>
                <div className={`${styles.cycleDot} ${styles.longBreakTime} ${currentCycle === 7 ? styles.active : ''}`}></div>
            </div>
        </div>
    );
}