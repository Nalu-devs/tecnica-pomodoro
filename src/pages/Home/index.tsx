import { Container } from "../../components/Container";
import { CountDown } from "../../components/CountDown";
import { MainForm } from "../../components/MainForm";
import { TaskRegistration } from "../../components/TaskRegistration";
import type { TaskStateModel } from "../../models/TaskStateModel";
import type { TaskModel } from "../../models/TaskModel";
import { MainTemplate } from "../../templates/MainTemplates";

type HomeProps = {
    state: TaskStateModel,
    setState: React.Dispatch<React.SetStateAction<TaskStateModel>>;
}

export function Home({ setState }: HomeProps) {
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
                <CountDown />
            </Container>

            <Container>
                <TaskRegistration onAddTask={handleAddTask} />
            </Container>

            <Container>
                <MainForm />
            </Container>
        </MainTemplate>
    );
}