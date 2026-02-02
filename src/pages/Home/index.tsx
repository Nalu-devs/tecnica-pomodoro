import { Container } from "../../components/Container";
import { CountDown } from "../../components/CountDown";
import { Cycles } from "../../components/Cycles";
import type { TaskStateModel } from "../../models/TaskStateModel";
import { MainTemplate } from "../../templates/MainTemplates";

type HomeProps = {
    state: TaskStateModel,
    setState: React.Dispatch<React.SetStateAction<TaskStateModel>>;
    currentPage?: 'home' | 'tasks';
    setCurrentPage?: (page: 'home' | 'tasks') => void;
}

export function Home({ state, setState, currentPage = 'home', setCurrentPage = () => {} }: HomeProps) {
    return (
        <MainTemplate currentPage={currentPage} setCurrentPage={setCurrentPage}>
            <Container>
                <CountDown state={state} setState={setState} />
            </Container>

            <Container>
                <Cycles currentCycle={state.currentCycle} />
            </Container>

            {state.activeTask && (
                <Container>
                    <h3>Tarefa Atual</h3>
                    <p><strong>{state.activeTask.name}</strong></p>
                </Container>
            )}
        </MainTemplate>
    );
}