# Gráfico de Barras Semanal - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Adicionar gráfico de barras mostrando pomodoros concluídos por dia da semana.

**Architecture:** Adicionar Chart.js via CDN no HTML, criar elemento canvas, implementar lógica de dados para últimos 7 dias, integrar com tema existente.

**Tech Stack:** Chart.js (via CDN), JavaScript, HTML, CSS

---

### Task 1: Adicionar Chart.js ao HTML

**Files:**
- Modify: `index.html:6-7`

**Step 1: Adicionar CDN do Chart.js**

Adicionar antes do link do CSS:
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

**Step 2: Commit**
```bash
git add index.html
git commit -m "feat: add Chart.js CDN"
```

---

### Task 2: Adicionar elemento canvas ao HTML

**Files:**
- Modify: `index.html:76-92`

**Step 1: Adicionar seção de gráfico**

Após a div `stats-section`, adicionar:
```html
<div class="chart-section">
    <h3>📈 Produtividade Semanal</h3>
    <div class="chart-container">
        <canvas id="weeklyChart"></canvas>
    </div>
</div>
```

**Step 2: Commit**
```bash
git add index.html
git commit -m "feat: add chart section HTML"
```

---

### Task 3: Adicionar estilos CSS para o gráfico

**Files:**
- Modify: `style.css` (append)

**Step 1: Adicionar estilos**

```css
.chart-section {
    background: var(--card-bg);
    border-radius: 12px;
    padding: 20px;
    margin: 20px 0;
}

.chart-section h3 {
    margin-bottom: 15px;
    color: var(--text-color);
}

.chart-container {
    position: relative;
    height: 250px;
    width: 100%;
}
```

**Step 2: Commit**
```bash
git add style.css
git commit -m "feat: add chart styles"
```

---

### Task 4: Modificar estrutura de dados para armazenar histórico diário

**Files:**
- Modify: `script.js:34-41`

**Step 1: Adicionar novo estado para histórico**

Substituir:
```javascript
// Contadores de pomodoros concluídos (persistidos no localStorage)
pomodorosCompleted: parseInt(localStorage.getItem('pomodorosCompleted')) || 0,
todayPomodoros: parseInt(localStorage.getItem('todayPomodoros')) || 0,
weekPomodoros: parseInt(localStorage.getItem('weekPomodoros')) || 0,
```

Por:
```javascript
// Contadores de pomodoros concluídos (persistidos no localStorage)
pomodorosCompleted: parseInt(localStorage.getItem('pomodorosCompleted')) || 0,
todayPomodoros: parseInt(localStorage.getItem('todayPomodoros')) || 0,
weekPomodoros: parseInt(localStorage.getItem('weekPomodoros')) || 0,

// Histórico de pomodoros por dia (objeto com data como chave)
dailyHistory: JSON.parse(localStorage.getItem('dailyHistory')) || {},
```

**Step 2: Commit**
```bash
git add script.js
git commit -m "feat: add daily history data structure"
```

---

### Task 5: Criar função para atualizar histórico ao completar pomodoro

**Files:**
- Modify: `script.js` (找到完成pomodoro的函数，约在line 390-400)

**Step 1: Encontrar função que completa pomodoro**

Procurar por `completePomodoro` ou onde `todayPomodoros` é incrementado.

**Step 2: Adicionar atualização do histórico**

Após incrementar todayPomodoros, adicionar:
```javascript
const today = new Date().toDateString();
if (!state.dailyHistory[today]) {
    state.dailyHistory[today] = 0;
}
state.dailyHistory[today]++;
localStorage.setItem('dailyHistory', JSON.stringify(state.dailyHistory));
```

**Step 3: Commit**
```bash
git add script.js
git commit -m "feat: update daily history on pomodoro complete"
```

---

### Task 6: Criar função para obter dados dos últimos 7 dias

**Files:**
- Modify: `script.js` (append, before init or at end)

**Step 1: Adicionar função getWeeklyData**

```javascript
function getWeeklyData() {
    const days = [];
    const counts = [];
    const today = new Date();
    
    // Get Monday of current week
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    
    const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        const dateStr = date.toDateString();
        
        days.push(dayNames[i]);
        counts.push(state.dailyHistory[dateStr] || 0);
    }
    
    return { days, counts };
}
```

**Step 2: Commit**
```bash
git add script.js
git commit -m "feat: add getWeeklyData function"
```

---

### Task 7: Criar função para renderizar o gráfico

**Files:**
- Modify: `script.js` (append)

**Step 1: Adicionar função renderChart**

```javascript
let weeklyChart = null;

function renderWeeklyChart() {
    const ctx = document.getElementById('weeklyChart');
    if (!ctx) return;
    
    const { days, counts } = getWeeklyData();
    const isDark = state.darkMode;
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    const todayIndex = Math.floor((today - monday) / (1000 * 60 * 60 * 24));
    
    const bgColors = days.map((_, i) => 
        i === todayIndex ? '#e74c3c' : (isDark ? '#3498db' : '#2ecc71')
    );
    
    if (weeklyChart) {
        weeklyChart.destroy();
    }
    
    weeklyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: days,
            datasets: [{
                label: 'Pomodoros',
                data: counts,
                backgroundColor: bgColors,
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `${ctx.raw} pomodoro${ctx.raw !== 1 ? 's' : ''}`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 },
                    grid: { color: isDark ? '#444' : '#eee' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}
```

**Step 2: Commit**
```bash
git add script.js
git commit -m "feat: add renderWeeklyChart function"
```

---

### Task 8: Integrar gráfico com tema e inicialização

**Files:**
- Modify: `script.js` (找到themeToggle函数和init函数)

**Step 1: Atualizar renderChart ao trocar tema**

No toggleTheme, adicionar ao final:
```javascript
renderWeeklyChart();
```

**Step 2: Chamar renderChart na inicialização**

No init ouDOMContentLoaded, adicionar:
```javascript
renderWeeklyChart();
```

**Step 3: Atualizar gráfico ao completar pomodoro**

Na função que completa pomodoro, adicionar:
```javascript
renderWeeklyChart();
```

**Step 4: Commit**
```bash
git add script.js
git commit -m "feat: integrate chart with theme and init"
```

---

### Task 9: Testar e verificar

**Step 1: Abrir index.html no navegador**

Verificar se:
- Gráfico aparece abaixo das estatísticas
- Barras mostram valores corretos
- Tema alterna corretamente
- Gráfico atualiza ao completar pomodoro

**Step 2: Commit**
```bash
git add .
git commit -m "feat: add weekly productivity bar chart"
```
