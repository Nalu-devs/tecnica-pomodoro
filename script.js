// ============================================================
// ESTADO GLOBAL DA APLICAÇÃO
// Armazena todas as variáveis que controlam o funcionamento do Pomodoro
// ============================================================

const state = {
    // Tempo restante e total do ciclo atual (em segundos)
    // 25 minutos * 60 segundos = 1500 segundos
    secondsRemaining: 25 * 60,
    totalSeconds: 25 * 60,
    
    // Controla qual ciclo está ativo (0-7, onde 8 ciclos = 1 pomodoro completo)
    currentCycle: 0,
    
    // Indica se o timer está em execução
    isRunning: false,
    
    // Armazena o ID do intervalo para poder pausar o timer
    interval: null,
    
    // Configurações de tempo (em minutos)
    config: {
        workTime: 25,        // Tempo de trabalho (pomodoro)
        shortBreakTime: 5,   // Pausa curta entre pomodoros
        longBreakTime: 15    // Pausa longa após completar 4 pomodoros
    },
    
    // Lista de tarefas carregada do localStorage (armazenamento persistente do navegador)
    tasks: JSON.parse(localStorage.getItem('pomodoroTasks')) || [],
    
    // ID da tarefa atualmente selecionada
    activeTaskId: null,
    
    // Contadores de pomodoros concluídos (persistidos no localStorage)
    pomodorosCompleted: parseInt(localStorage.getItem('pomodorosCompleted')) || 0,
    todayPomodoros: parseInt(localStorage.getItem('todayPomodoros')) || 0,
    weekPomodoros: parseInt(localStorage.getItem('weekPomodoros')) || 0,
    
    // Controle de sequência de dias (dias seguidos usando a técnica)
    lastDate: localStorage.getItem('lastDate') || new Date().toDateString(),
    streak: parseInt(localStorage.getItem('streak')) || 0,
    
    // Preferências do usuário (carregadas do localStorage)
    darkMode: localStorage.getItem('darkMode') === 'true',
    autoStart: localStorage.getItem('autoStart') !== 'false',
    skipBreaks: localStorage.getItem('skipBreaks') === 'true',
    notifications: localStorage.getItem('notifications') !== 'false'
};

// ============================================================
// DEFINIÇÃO DA ORDEM DOS CICLOS
// Um ciclo completo do Pomodoro consiste em:
// - 4x trabalho (25 min) + pausa curta (5 min)
// - 1x trabalho + pausa longa (15 min)
// Total: 8 ciclos (work, break, work, break, work, break, work, longBreak)
// ============================================================

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

// ============================================================
// REFERÊNCIAS AOS ELEMENTOS DO DOM
// Armazena referências aos elementos HTML para manipulação
// O DOM (Document Object Model) é a representação da página em memória
// ============================================================

const elements = {
    timer: document.getElementById('timer'),
    cycleType: document.getElementById('cycleType'),
    progressFill: document.getElementById('progressFill'),
    startBtn: document.getElementById('startBtn'),
    pauseBtn: document.getElementById('pauseBtn'),
    resetBtn: document.getElementById('resetBtn'),
    skipBtn: document.getElementById('skipBtn'),
    workTime: document.getElementById('workTime'),
    shortBreakTime: document.getElementById('shortBreakTime'),
    longBreakTime: document.getElementById('longBreakTime'),
    taskInput: document.getElementById('taskInput'),
    addTaskBtn: document.getElementById('addTaskBtn'),
    taskList: document.getElementById('taskList'),
    activeTask: document.getElementById('activeTask'),
    pomoCount: document.getElementById('pomoCount'),
    themeToggle: document.getElementById('themeToggle'),
    autoStart: document.getElementById('autoStart'),
    skipBreaks: document.getElementById('skipBreaks'),
    notifications: document.getElementById('notifications'),
    todayCount: document.getElementById('todayCount'),
    weekCount: document.getElementById('weekCount'),
    streakCount: document.getElementById('streakCount')
};

// ============================================================
// FUNÇÃO: Reproduz som usando Web Audio API
// Não requer arquivos de áudio externos - gera sons sintetizados
// @param {string} type - Tipo de som: 'start' (início) ou 'end' (fim)
// ============================================================

function playSound(type) {
    try {
        // Cria o contexto de áudio do navegador (permite gerar sons programaticamente)
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Cria o gerador de som (oscilador - produz ondas sonoras)
        const oscillator = audioContext.createOscillator();
        
        // Cria o nó de ganho (controla o volume do som)
        const gainNode = audioContext.createGain();
        
        // Conecta o oscilador ao controle de volume
        oscillator.connect(gainNode);
        
        // Conecta o controle de volume aos autofalantes do sistema
        gainNode.connect(audioContext.destination);
        
        // Configura o tipo de som conforme o parâmetro
        if (type === 'start') {
            // Som mais suave para início (800Hz = frequência mais baixa, onda senoidal = som suave)
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
        } else {
            // Som mais agudo para fim (1200Hz = frequência mais alta, onda quadrada = som mais forte)
            oscillator.frequency.value = 1200;
            oscillator.type = 'square';
        }
        
        // Define volume inicial em 30% (0.3 = 30%)
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        
        // Faz o volume decair exponencialmente até quase zero em 0.5 segundos
        // Cria um efeito de "fade out" (desvanecimento)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        // Inicia a reprodução do som neste momento
        oscillator.start(audioContext.currentTime);
        
        // Para o som após 0.5 segundos
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        // Silencia erros (navegador pode não suportar Web Audio API)
    }
}

// ============================================================
// FUNÇÃO: Envia notificação do sistema
// Exibe notificação nativa do sistema operacional quando ciclo termina
// @param {string} title - Título da notificação
// @param {string} body - Corpo da mensagem
// ============================================================

function sendNotification(title, body) {
    // Retorna se notificações estão desativadas ou navegador não suporta
    if (!state.notifications || !("Notification" in window)) return;
    
    // Se já temos permissão do usuário, envia a notificação diretamente
    if (Notification.permission === "granted") {
        new Notification(title, { body, icon: '🍅' });
    } 
    // Se não foi negada, pede permissão ao usuário
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            // Após usuário responder, se concedeu permissão, envia notificação
            if (permission === "granted") {
                new Notification(title, { body, icon: '🍅' });
            }
        });
    }
}

// ============================================================
// FUNÇÃO: Formata segundos para o formato MM:SS
// Converte tempo em segundos para string legível
// @param {number} seconds - Quantidade de segundos
// @returns {string} Tempo formatado (ex: "25:00")
// ============================================================

function formatTime(seconds) {
    // Divide por 60 para obter minutos inteiros (parte inteira da divisão)
    const minutes = Math.floor(seconds / 60);
    
    // Obtém o resto da divisão por 60 (segundos restantes)
    const remainingSeconds = seconds % 60;
    
    // Formata cada valor com 2 dígitos usando padStart
    // Ex: 5 minutos = "05", 9 segundos = "09"
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// ============================================================
// FUNÇÃO: Retorna duração em segundos do ciclo atual
// Verifica o tipo de ciclo e retorna o tempo configurado
// @returns {number} Duração em segundos
// ============================================================

function getCurrentCycleTime() {
    // Obtém dados do ciclo atual (type: 'work' ou 'break')
    const currentCycleData = cycleOrder[state.currentCycle];
    
    if (currentCycleData.type === 'work') {
        // Se é trabalho, retorna tempo de trabalho em segundos
        return state.config.workTime * 60;
    } else {
        // Se é pausa, verifica se é pausa longa (ciclo 7 = índice 7 = 8º ciclo)
        if (state.currentCycle === 7) {
            return state.config.longBreakTime * 60;
        }
        // Pausa curta
        return state.config.shortBreakTime * 60;
    }
}

// ============================================================
// FUNÇÃO: Verifica e atualiza estatísticas de data
// Mantém controle de dias consecutivos e reseta contadores diariamente
// ============================================================

function checkDate() {
    // Obtém a data de hoje no formato "Dia Mês DiaNum Ano" (ex: "Fri Feb 20 2026")
    const today = new Date();
    const todayStr = today.toDateString();
    
    // Se a data registrada não é hoje, precisamos atualizar as estatísticas
    if (state.lastDate !== todayStr) {
        // Calcula a data de ontem
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Se ontem teve pomodoros e foi ontem, incrementa sequência de dias
        if (state.lastDate === yesterday.toDateString() && state.todayPomodoros > 0) {
            state.streak++;
        } 
        // Se não foi ontem (pulo de dias), zera a sequência
        else if (state.lastDate !== yesterday.toDateString()) {
            state.streak = 0;
        }
        
        // Se é segunda-feira (dia 1), zera contador da semana
        const dayOfWeek = today.getDay();
        if (dayOfWeek === 1) {
            state.weekPomodoros = 0;
        }
        
        // Zera contador de hoje e atualiza a data registrada
        state.todayPomodoros = 0;
        state.lastDate = todayStr;
        
        // Salva as alterações no localStorage (persistência)
        localStorage.setItem('todayPomodoros', 0);
        localStorage.setItem('weekPomodoros', state.weekPomodoros);
        localStorage.setItem('lastDate', todayStr);
        localStorage.setItem('streak', state.streak);
    }
}

// ============================================================
// FUNÇÃO: Atualiza todos os elementos visuais do timer
// Chamada a cada segundo e em mudanças de estado
// ============================================================

function updateDisplay() {
    // Atualiza o texto do timer com o tempo restante formatado
    elements.timer.textContent = formatTime(state.secondsRemaining);
    
    // Obtém o tipo do ciclo atual e atualiza o texto descritivo
    const currentCycleData = cycleOrder[state.currentCycle];
    elements.cycleType.textContent = currentCycleData.label;
    
    // Altera a cor do timer conforme o tipo de ciclo
    if (currentCycleData.type === 'work') {
        // Vermelho (#e74c3c) para trabalho
        elements.timer.style.color = '#e74c3c';
    } else {
        // Verde (#27ae60) para pausa
        elements.timer.style.color = '#27ae60';
    }

    // Calcula e atualiza a barra de progresso
    // Progresso = (tempo decorrido / tempo total) * 100
    const elapsed = state.totalSeconds - state.secondsRemaining;
    const progress = (elapsed / state.totalSeconds) * 100;
    elements.progressFill.style.width = `${progress}%`;

    // Atualiza indicadores visuais dos ciclos (os pontinhos)
    updateCycleDots();
    
    // Atualiza estatísticas na tela
    updateStats();
}

// ============================================================
// FUNÇÃO: Atualiza os pontos indicadores de ciclo
// Cada ponto representa um dos 8 ciclos do Pomodoro
// Cores: vermelho = trabalho, verde = pausa, cinza = incompleto
// ============================================================

function updateCycleDots() {
    // Seleciona todos os elementos de ponto no HTML
    const dots = document.querySelectorAll('.cycle-dot');
    
    // Para cada ponto, atualiza as classes de estado
    dots.forEach((dot, index) => {
        // Remove todas as classes de estado primeiro
        dot.classList.remove('active', 'work', 'break');
        
        // Adiciona classe 'active' se for o ciclo atual
        if (index === state.currentCycle) {
            dot.classList.add('active');
        }
        
        // Adiciona classe de cor se o ciclo já foi completado
        if (index < state.currentCycle) {
            const cycleData = cycleOrder[index];
            dot.classList.add(cycleData.type);
        }
    });
}

// ============================================================
// FUNÇÃO: Atualiza as estatísticas exibidas na tela
// Chama checkDate primeiro para garantir dados atualizados
// ============================================================

function updateStats() {
    checkDate();
    
    // Atualiza contador no header (pomodoros de hoje e total)
    elements.pomoCount.textContent = `🍅 ${state.todayPomodoros} hoje | ${state.pomodorosCompleted} total`;
    
    // Atualiza cards de estatísticas (Hoje, Semana, Sequência)
    elements.todayCount.textContent = state.todayPomodoros;
    elements.weekCount.textContent = state.weekPomodoros;
    elements.streakCount.textContent = state.streak;
}

// ============================================================
// FUNÇÃO: Inicia o timer do Pomodoro
// O coração da aplicação - decrementa o contador a cada segundo
// ============================================================

function start() {
    // Retorna se já está em execução (evita múltiplos intervalos simultâneos)
    if (state.isRunning) return;

    // Se o timer está em 0 (início fresco), carrega o tempo do ciclo atual
    if (state.secondsRemaining === 0) {
        state.secondsRemaining = getCurrentCycleTime();
    }
    
    // Marca como em execução
    state.isRunning = true;
    
    // Alterna visibilidade dos botões (some com "Iniciar", mostra "Pausar")
    elements.startBtn.style.display = 'none';
    elements.pauseBtn.style.display = 'inline-block';
    
    // Reproduz som de início
    playSound('start');
    
    // Cria o intervalo que decrementa o timer a cada 1 segundo
    state.interval = setInterval(() => {
        // Decrementa 1 segundo do tempo restante
        state.secondsRemaining--;
        
        // Se o tempo chegou a zero ou menos
        if (state.secondsRemaining <= 0) {
            // Para o intervalo (para o timer)
            clearInterval(state.interval);
            state.isRunning = false;
            state.secondsRemaining = 0;
            
            // Alterna botões de volta (mostra "Iniciar", some com "Pausar")
            elements.startBtn.style.display = 'inline-block';
            elements.pauseBtn.style.display = 'none';
            
            // Obtém dados do ciclo que terminou
            const currentCycleData = cycleOrder[state.currentCycle];
            
            // Se foi um ciclo de trabalho (não pausa)
            if (currentCycleData.type === 'work') {
                // Incrementa todos os contadores
                state.pomodorosCompleted++;
                state.todayPomodoros++;
                state.weekPomodoros++;
                
                // Salva no localStorage (persistência mesmo após fechar navegador)
                localStorage.setItem('pomodorosCompleted', state.pomodorosCompleted);
                localStorage.setItem('todayPomodoros', state.todayPomodoros);
                localStorage.setItem('weekPomodoros', state.weekPomodoros);
                
                // Reproduz som e envia notificação
                playSound('end');
                sendNotification('🍅 Pomodoro Completo!', 'Hora de descansar.');
            } else {
                // Se foi uma pausa
                playSound('end');
                sendNotification('⏰ Pausa Terminada', 'Hora de trabalhar!');
            }
            
            // Verifica configuração de auto-início do próximo ciclo
            if (state.autoStart) {
                // Espera 1 segundo antes de iniciar próximo ciclo
                setTimeout(() => {
                    // Se deve pular pausas e terminou trabalho
                    if (state.skipBreaks && currentCycleData.type === 'work') {
                        skipToNextWork();
                    } else {
                        nextCycle();
                    }
                    // Inicia o próximo ciclo
                    start();
                }, 1000);
            } else {
                // Sem auto-início: preenche a barra completamente
                elements.progressFill.style.width = '100%';
            }
        }
        
        // Atualiza o display a cada segundo (mostra tempo atual)
        updateDisplay();
    }, 1000); // 1000ms = 1 segundo
}

// ============================================================
// FUNÇÃO: Pausa o timer
// Para o intervalo mas mantém o tempo atual (pode continuar depois)
// ============================================================

function pause() {
    state.isRunning = false;
    clearInterval(state.interval);  // Para o setInterval
    elements.startBtn.style.display = 'inline-block';
    elements.pauseBtn.style.display = 'none';
}

// ============================================================
// FUNÇÃO: Reseta o timer
// Pausa se estiver rodando e zera o progresso do ciclo atual
// ============================================================

function reset() {
    pause();  // Pausa o timer primeiro
    
    // Recarrega o tempo total do ciclo atual
    state.totalSeconds = getCurrentCycleTime();
    state.secondsRemaining = state.totalSeconds;
    
    // Zera a barra de progresso visual
    elements.progressFill.style.width = '0%';
    
    // Atualiza o display
    updateDisplay();
}

// ============================================================
// FUNÇÃO: Avança para o próximo ciclo
// Pausa, move para o próximo índice (0-7) e reseta o tempo
// ============================================================

function nextCycle() {
    pause();  // Pausa o timer primeiro
    
    // Avança para o próximo ciclo (módulo 8 volta ao início após 8)
    state.currentCycle = (state.currentCycle + 1) % 8;
    
    // Carrega o tempo do novo ciclo
    state.totalSeconds = getCurrentCycleTime();
    state.secondsRemaining = state.totalSeconds;
    
    // Zera o progresso visual
    elements.progressFill.style.width = '0%';
    
    updateDisplay();
}

// ============================================================
// FUNÇÃO: Pula diretamente para o próximo ciclo de trabalho
// Útil quando o usuário quer pular pausas e ir direto para trabalho
// ============================================================

function skipToNextWork() {
    pause();  // Pausa o timer primeiro
    
    // Avança para o próximo ciclo
    state.currentCycle = (state.currentCycle + 1) % 8;

    // Loop que continua avançando até encontrar um ciclo de trabalho
    // (pula todas as pausas)
    while (cycleOrder[state.currentCycle].type === 'break') {
        state.currentCycle = (state.currentCycle + 1) % 8;
    }
    
    // Carrega tempo do ciclo de trabalho encontrado
    state.totalSeconds = getCurrentCycleTime();
    state.secondsRemaining = state.totalSeconds;
    elements.progressFill.style.width = '0%';
    updateDisplay();
}

// ============================================================
// FUNÇÃO: Atualiza configurações
// Lê os valores dos campos de entrada e aplica as mudanças
// ============================================================

function updateConfig() {
    // Lê os valores dos inputs e converte para número
    // Usa valores padrão se o input estiver vazio ou inválido
    state.config.workTime = parseInt(elements.workTime.value) || 25;
    state.config.shortBreakTime = parseInt(elements.shortBreakTime.value) || 5;
    state.config.longBreakTime = parseInt(elements.longBreakTime.value) || 15;
    
    // Se não está rodando, atualiza o timer imediatamente com novos valores
    if (!state.isRunning) {
        state.totalSeconds = getCurrentCycleTime();
        state.secondsRemaining = state.totalSeconds;
        updateDisplay();
    }
}

// ============================================================
// FUNÇÃO: Alterna modo escuro (dark mode)
// Alterna entre tema claro e escuro da aplicação
// ============================================================

function toggleTheme() {
    state.darkMode = !state.darkMode;  // Inverte o estado
    localStorage.setItem('darkMode', state.darkMode);  // Salva preferência
    document.body.classList.toggle('dark-mode', state.darkMode);  // Aplica classe CSS
}

// ============================================================
// FUNÇÕES DE GERENCIAMENTO DE TAREFAS
// ============================================================

/**
 * Salva as tarefas no localStorage
 * Converte o array de tarefas para string JSON antes de salvar
 */
function saveTasks() {
    localStorage.setItem('pomodoroTasks', JSON.stringify(state.tasks));
}

/**
 * Adiciona uma nova tarefa
 * 
 * Fluxo:
 * 1. Obtém o texto do input
 * 2. Cria objeto de tarefa com ID único (timestamp)
 * 3. Adiciona ao array de tarefas
 * 4. Limpa o input
 * 5. Salva e renderiza
 * 6. Se nenhuma tarefa ativa e timer parado, inicia automaticamente
 */
function addTask() {
    // Obtém texto e remove espaços extras do início/fim
    const taskText = elements.taskInput.value.trim();
    if (!taskText) return; // Retorna se input vazio
    
    // Cria objeto de tarefa com ID único baseado em timestamp (milisegundos atual)
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    
    // Adiciona ao array de tarefas
    state.tasks.push(task);
    
    // Limpa o campo de input após adicionar
    elements.taskInput.value = '';
    
    // Salva no localStorage
    saveTasks();
    
    // Atualiza a lista na tela
    renderTasks();
    
    // Se nenhuma tarefa ativa e timer parado, seleciona e inicia automaticamente
    if (!state.activeTaskId && !state.isRunning) {
        selectTask(task.id);
        start();
    }
}

/**
 * Remove uma tarefa pelo ID
 * @param {number} id - ID da tarefa a remover
 */
function deleteTask(id) {
    // Filtra o array, removendo a tarefa com o ID especificado
    state.tasks = state.tasks.filter(t => t.id !== id);
    
    // Se a tarefa deletada era a ativa, limpa a seleção
    if (state.activeTaskId === id) {
        state.activeTaskId = null;
    }
    
    saveTasks();
    renderTasks();
    updateActiveTaskDisplay();
}

/**
 * Seleciona uma tarefa como ativa
 * @param {number} id - ID da tarefa a selecionar
 */
function selectTask(id) {
    state.activeTaskId = id;
    renderTasks();
    updateActiveTaskDisplay();
}

/**
 * Atualiza o display da tarefa ativa
 * Mostra ou esconde o texto da tarefa atual
 */
function updateActiveTaskDisplay() {
    if (state.activeTaskId) {
        // Encontra a tarefa no array pelo ID
        const task = state.tasks.find(t => t.id === state.activeTaskId);
        if (task) {
            elements.activeTask.textContent = `Tarefa atual: ${task.text}`;
            elements.activeTask.classList.add('show');
            return;
        }
    }
    // Se não há tarefa ativa, esconde o elemento
    elements.activeTask.classList.remove('show');
}

/**
 * Renderiza a lista
 * Cria de tarefas na tela elementos HTML para cada tarefa no array
 */
function renderTasks() {
    // Limpa a lista atual (remove todos os elementos filhos)
    elements.taskList.innerHTML = '';
    
    // Para cada tarefa no array, cria um elemento de lista
    state.tasks.forEach(task => {
        // Cria novo elemento <li>
        const li = document.createElement('li');
        li.className = 'task-item';
        
        // Adiciona classes de estado
        if (task.id === state.activeTaskId) li.classList.add('active');
        if (task.completed) li.classList.add('completed');
        
        // Define o HTML interno com texto e botão de deletar
        li.innerHTML = `
            <span>${task.text}</span>
            <button class="task-delete">×</button>
        `;
        
        // Evento de clique na tarefa (para selecionar)
        li.addEventListener('click', (e) => {
            // Se não clicou no botão de deletar
            if (!e.target.classList.contains('task-delete')) {
                selectTask(task.id);
            }
        });
        
        // Evento de clique no botão de deletar
        li.querySelector('.task-delete').addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que o clique se propague para o <li>
            deleteTask(task.id);
        });
        
        // Adiciona o elemento à lista
        elements.taskList.appendChild(li);
    });
    
    updateActiveTaskDisplay();
}

// ============================================================
// EVENT LISTENERS (CONFIGURAÇÃO DE EVENTOS)
// Associa funções aos eventos dos elementos HTML
// ============================================================

// Botões de controle do timer
elements.startBtn.addEventListener('click', start);
elements.pauseBtn.addEventListener('click', pause);
elements.resetBtn.addEventListener('click', reset);
elements.skipBtn.addEventListener('click', nextCycle);

// Inputs de configuração (tempos em minutos)
elements.workTime.addEventListener('change', updateConfig);
elements.shortBreakTime.addEventListener('change', updateConfig);
elements.longBreakTime.addEventListener('change', updateConfig);

// Eventos de tarefas
elements.addTaskBtn.addEventListener('click', addTask);
elements.taskInput.addEventListener('keypress', (e) => {
    // Permite adicionar tarefa pressionando Enter
    if (e.key === 'Enter') addTask();
});

// Botão de tema (dark mode) - verifica se existe primeiro
if (elements.themeToggle) {
    elements.themeToggle.addEventListener('click', toggleTheme);
}

// Checkbox de configurações - inicializa estado e adiciona listeners
elements.autoStart.checked = state.autoStart;
elements.autoStart.addEventListener('change', () => {
    state.autoStart = elements.autoStart.checked;
    localStorage.setItem('autoStart', state.autoStart);
});

elements.skipBreaks.checked = state.skipBreaks;
elements.skipBreaks.addEventListener('change', () => {
    state.skipBreaks = elements.skipBreaks.checked;
    localStorage.setItem('skipBreaks', state.skipBreaks);
});

elements.notifications.checked = state.notifications;
elements.notifications.addEventListener('change', () => {
    state.notifications = elements.notifications.checked;
    localStorage.setItem('notifications', state.notifications);
    // Solicita permissão se ativado e ainda não definido
    if (state.notifications && Notification.permission === "default") {
        Notification.requestPermission();
    }
});

// ============================================================
// INICIALIZAÇÃO DA APLICAÇÃO
// Código executado quando a página termina de carregar
// ============================================================

// Aplica o tema salvo (escuro ou claro) ao carregar
if (state.darkMode) {
    document.body.classList.add('dark-mode');
}

// Solicita permissão de notificações se estiver ativado e não definido ainda
if (state.notifications && Notification.permission === "default") {
    Notification.requestPermission();
}

// Renderiza tarefas salvas e exibe o estado inicial do timer
renderTasks();
updateDisplay();
