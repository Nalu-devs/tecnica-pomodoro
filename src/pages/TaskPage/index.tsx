import { Container } from "../../components/Container";
import { TaskRegistration } from "../../components/TaskRegistration";
import type { TaskStateModel } from "../../models/TaskStateModel";
import type { TaskModel } from "../../models/TaskModel";
import { MainTemplate } from "../../templates/MainTemplates";

type TaskPageProps = {
    state: TaskStateModel,
    setState: React.Dispatch<React.SetStateAction<TaskStateModel>>;
}

export function TaskPage({ state, setState }: TaskPageProps) {
    const handleAddTask = (newTask: Omit<TaskModel, 'id' | 'startDate' | 'completeDate' | 'interruptDate'>) => {
        const task: TaskModel = {
            ...newTask,
            id: Date.now().toString(),
            startDate: Date.now(),
            completeDate: null,
            interruptDate: null
        };

        setState(prevState => ({
            ...prevState,
            tasks: [...prevState.tasks, task]
        }));
    };

    return (
        <MainTemplate>
            <Container>
                <h2>Cadastrar Nova Tarefa</h2>
                <TaskRegistration onAddTask={handleAddTask} />
            </Container>

            <Container>
                <h3>Lista de Tarefas</h3>
                <div>
                    {state.tasks.length === 0 ? (
                        <p>Nenhuma tarefa cadastrada ainda</p>
                    ) : (
                        <ul>
                            {state.tasks.map(task => (
                                <li key={task.id}>
                                    <strong>{task.name}</strong> - {task.duration}min
                                    {task.completeDate && <span> ✅ Concluída</span>}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </Container>
        </MainTemplate>
    );
}