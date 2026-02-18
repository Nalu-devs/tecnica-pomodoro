const state = {
    secondsRemaining: 25 * 60,
    currentCycle: 0,
    isRunning: false,
    interval: null,
    config: {
        workTime: 25,
        shortBreakTime: 5,
        longBreakTime: 15
    },
    tasks: JSON.parse(localStorage.getItem('pomodoroTasks')) || [],
    activeTaskId: null
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
    activeTask: document.getElementById('activeTask')
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
        if (state.currentCycle === 7) {
            return state.config.longBreakTime * 60;
        }
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

function toggleTaskComplete(id) {
    const task = state.tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
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
        
         const span = document.createElement('span');
        span.textContent = task.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'task-delete';
        deleteBtn.textContent = '×';

        li.appendChild(span);
        li.appendChild(deleteBtn);

        li.addEventListener('click', () => {
            selectTask(task.id);
        });

        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTask(task.id);
        });
        
        elements.taskList.appendChild(li);
    });
    
    updateActiveTaskDisplay();
}

elements.addTaskBtn.addEventListener('click', addTask);
elements.taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

renderTasks();
updateDisplay();
