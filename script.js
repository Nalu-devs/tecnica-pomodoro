const state = {
    secondsRemaining: 25 * 60,
    currentCycle: 0,
    isRunning: false,
    interval: null,
    autoStart: true,
    config: {
        workTime: 25,
        shortBreakTime: 5,
        longBreakTime: 15
    },
    tasks: JSON.parse(localStorage.getItem('pomodoroTasks')) || [],
    activeTaskId: null,
    pomodorosCompleted: parseInt(localStorage.getItem('pomodorosCompleted')) || 0,
    todayPomodoros: parseInt(localStorage.getItem('todayPomodoros')) || 0,
    lastDate: localStorage.getItem('lastDate') || new Date().toDateString(),
    darkMode: localStorage.getItem('darkMode') === 'true'
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
    longBreakTime: document.getElementById('longBreakTime'),
    taskInput: document.getElementById('taskInput'),
    addTaskBtn: document.getElementById('addTaskBtn'),
    taskList: document.getElementById('taskList'),
    activeTask: document.getElementById('activeTask'),
    pomoCount: document.getElementById('pomoCount'),
    themeToggle: document.getElementById('themeToggle')
};

function playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'start') {
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
    } else {
        oscillator.frequency.value = 1200;
        oscillator.type = 'square';
    }
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

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
        if (state.currentCycle === 7) {
            return state.config.longBreakTime * 60;
        }
        return state.config.shortBreakTime * 60;
    }
}

function checkDate() {
    const today = new Date().toDateString();
    if (state.lastDate !== today) {
        state.todayPomodoros = 0;
        state.lastDate = today;
        localStorage.setItem('todayPomodoros', 0);
        localStorage.setItem('lastDate', today);
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
    updatePomodoroCount();
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

function updatePomodoroCount() {
    checkDate();
    elements.pomoCount.textContent = `🍅 ${state.todayPomodoros} hoje | ${state.pomodorosCompleted} total`;
}

function start() {
    if (state.secondsRemaining === 0) {
        state.secondsRemaining = getCurrentCycleTime();
    }
    
    state.isRunning = true;
    elements.startBtn.style.display = 'none';
    elements.pauseBtn.style.display = 'inline-block';
    
    playSound('start');
    
    state.interval = setInterval(() => {
        state.secondsRemaining--;
        
        if (state.secondsRemaining <= 0) {
            clearInterval(state.interval);
            state.isRunning = false;
            state.secondsRemaining = 0;
            elements.startBtn.style.display = 'inline-block';
            elements.pauseBtn.style.display = 'none';
            
            const currentCycleData = cycleOrder[state.currentCycle];
            if (currentCycleData.type === 'work') {
                state.pomodorosCompleted++;
                state.todayPomodoros++;
                localStorage.setItem('pomodorosCompleted', state.pomodorosCompleted);
                localStorage.setItem('todayPomodoros', state.todayPomodoros);
            }
            
            playSound('end');
            
            if (state.autoStart) {
                nextCycle();
                setTimeout(start, 1000);
            } else {
                alert(currentCycleData.type === 'work' ? '🍅 Pomodoro completo! Hora de descansar.' : '⏰ Pausa terminada! Hora de trabalhar.');
            }
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

function toggleTheme() {
    state.darkMode = !state.darkMode;
    localStorage.setItem('darkMode', state.darkMode);
    document.body.classList.toggle('dark-mode', state.darkMode);
}

function saveTasks() {
    localStorage.setItem('pomodoroTasks', JSON.stringify(state.tasks));
}

function addTask() {
    const taskText = elements.taskInput.value.trim();
    if (!taskText) return;
    
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    
    state.tasks.push(task);
    elements.taskInput.value = '';
    saveTasks();
    renderTasks();
    
    if (!state.activeTaskId && !state.isRunning) {
        selectTask(task.id);
        start();
    }
}

function deleteTask(id) {
    state.tasks = state.tasks.filter(t => t.id !== id);
    if (state.activeTaskId === id) {
        state.activeTaskId = null;
    }
    saveTasks();
    renderTasks();
    updateActiveTaskDisplay();
}

function selectTask(id) {
    state.activeTaskId = id;
    renderTasks();
    updateActiveTaskDisplay();
}

function updateActiveTaskDisplay() {
    if (state.activeTaskId) {
        const task = state.tasks.find(t => t.id === state.activeTaskId);
        if (task) {
            elements.activeTask.textContent = `Tarefa atual: ${task.text}`;
            elements.activeTask.classList.add('show');
            return;
        }
    }
    elements.activeTask.classList.remove('show');
}

function renderTasks() {
    elements.taskList.innerHTML = '';
    
    state.tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (task.id === state.activeTaskId) li.classList.add('active');
        if (task.completed) li.classList.add('completed');
        
        li.innerHTML = `
            <span>${task.text}</span>
            <button class="task-delete">×</button>
        `;
        
        li.addEventListener('click', (e) => {
            if (!e.target.classList.contains('task-delete')) {
                selectTask(task.id);
            }
        });
        
        li.querySelector('.task-delete').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTask(task.id);
        });
        
        elements.taskList.appendChild(li);
    });
    
    updateActiveTaskDisplay();
}

elements.startBtn.addEventListener('click', start);
elements.pauseBtn.addEventListener('click', pause);
elements.resetBtn.addEventListener('click', reset);
elements.nextBtn.addEventListener('click', nextCycle);

elements.workTime.addEventListener('change', updateConfig);
elements.shortBreakTime.addEventListener('change', updateConfig);
elements.longBreakTime.addEventListener('change', updateConfig);

elements.addTaskBtn.addEventListener('click', addTask);
elements.taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

if (elements.themeToggle) {
    elements.themeToggle.addEventListener('click', toggleTheme);
}

if (state.darkMode) {
    document.body.classList.add('dark-mode');
}

renderTasks();
updateDisplay();
