const state = {
    secondsRemaining: 25 * 60,
    currentCycle: 0,
    isRunning: false,
    interval: null,
    config: {
        workTime: 25,
        shortBreakTime: 5,
        longBreakTime: 15
    }
};

const cycleOrder = [
    { type: 'work', label: 'Tempo de Trabalho' },
    { type: 'break', label: 'Pausa Curta' },
    { type: 'work', label: 'Tempo de Trabalho' },
    { type: 'break', label: 'Pausa Curta' },
    { type: 'work', label: 'Tempo de Trabalho' },
    { type: 'break', label: 'Pausa Curta' },
    { type: 'work', label: 'Tempo de Trabalho' },
    { type: 'break', label: 'Pausa Longa' }
];

const elements = {
    timer: document.getElementById('timer'),
    cycleType: document.getElementById('cycleType'),
    cyclesIndicator: document.getElementById('cyclesIndicator'),
    startBtn: document.getElementById('startBtn'),
    pauseBtn: document.getElementById('pauseBtn'),
    resetBtn: document.getElementById('resetBtn'),
    nextBtn: document.getElementById('nextBtn'),
    workTime: document.getElementById('workTime'),
    shortBreakTime: document.getElementById('shortBreakTime'),
    longBreakTime: document.getElementById('longBreakTime')
};

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function getCurrentCycleTime() {
    const currentCycleData = cycleOrder[state.currentCycle];
    if (currentCycleData.type === 'work') {
        return state.config.workTime * 60;
    } else {
        return state.config.shortBreakTime * 60;
    }
}

function updateDisplay() {
    elements.timer.textContent = formatTime(state.secondsRemaining);
    
    const currentCycleData = cycleOrder[state.currentCycle];
    elements.cycleType.textContent = currentCycleData.label;
    
    if (currentCycleData.type === 'work') {
        elements.timer.style.color = '#e74c3c';
    } else {
        elements.timer.style.color = '#27ae60';
    }

    updateCycleDots();
}

function updateCycleDots() {
    const dots = document.querySelectorAll('.cycle-dot');
    dots.forEach((dot, index) => {
        dot.classList.remove('active', 'work', 'break');
        if (index === state.currentCycle) {
            dot.classList.add('active');
        }
        if (index < state.currentCycle) {
            const cycleData = cycleOrder[index];
            dot.classList.add(cycleData.type);
        }
    });
}

function start() {
    if (state.secondsRemaining === 0) {
        state.secondsRemaining = getCurrentCycleTime();
    }
    
    state.isRunning = true;
    elements.startBtn.style.display = 'none';
    elements.pauseBtn.style.display = 'inline-block';
    
    state.interval = setInterval(() => {
        state.secondsRemaining--;
        
        if (state.secondsRemaining <= 0) {
            clearInterval(state.interval);
            state.isRunning = false;
            state.secondsRemaining = 0;
            elements.startBtn.style.display = 'inline-block';
            elements.pauseBtn.style.display = 'none';
            alert('Ciclo completo!');
        }
        
        updateDisplay();
    }, 1000);
}

function pause() {
    state.isRunning = false;
    clearInterval(state.interval);
    elements.startBtn.style.display = 'inline-block';
    elements.pauseBtn.style.display = 'none';
}

function reset() {
    pause();
    state.secondsRemaining = getCurrentCycleTime();
    updateDisplay();
}

function nextCycle() {
    pause();
    state.currentCycle = (state.currentCycle + 1) % 8;
    state.secondsRemaining = getCurrentCycleTime();
    updateDisplay();
}

function updateConfig() {
    state.config.workTime = parseInt(elements.workTime.value) || 25;
    state.config.shortBreakTime = parseInt(elements.shortBreakTime.value) || 5;
    state.config.longBreakTime = parseInt(elements.longBreakTime.value) || 15;
    
    if (!state.isRunning) {
        state.secondsRemaining = getCurrentCycleTime();
        updateDisplay();
    }
}

elements.startBtn.addEventListener('click', start);
elements.pauseBtn.addEventListener('click', pause);
elements.resetBtn.addEventListener('click', reset);
elements.nextBtn.addEventListener('click', nextCycle);

elements.workTime.addEventListener('change', updateConfig);
elements.shortBreakTime.addEventListener('change', updateConfig);
elements.longBreakTime.addEventListener('change', updateConfig);

updateDisplay();
