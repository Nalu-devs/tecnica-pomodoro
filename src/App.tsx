import { Home } from './pages/Home';
import { TaskPage } from './pages/TaskPage';

import './styles/theme.css';
import './styles/global.css';
import { useState } from 'react';
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

    const renderPage = () => {
        switch (currentPage) {
            case 'tasks':
                return <TaskPage state={state} setState={setState} />;
            default:
                return <Home state={state} setState={setState} />;
        }
    };

    return (
        <div>
            <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', marginBottom: '2rem' }}>
                <button onClick={() => setCurrentPage('home')} style={{ marginRight: '1rem', padding: '0.5rem 1rem' }}>
                    🏠 Pomodoro
                </button>
                <button onClick={() => setCurrentPage('tasks')} style={{ padding: '0.5rem 1rem' }}>
                    📝 Tarefas
                </button>
            </nav>
            {renderPage()}
        </div>
    );
}