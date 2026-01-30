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
                return <TaskPage state={state} setState={setState} currentPage={currentPage} setCurrentPage={setCurrentPage} />;
            default:
                return <Home state={state} setState={setState} currentPage={currentPage} setCurrentPage={setCurrentPage} />;
        }
    };

    return (
        <div style={{ maxWidth: '100%', margin: '0 auto', padding: '0 1rem' }}>
            {renderPage()}
        </div>
    );
}