import { PlayCircleIcon } from "lucide-react";
import { Button } from "../Button";
import { Cycles } from "../Cycles";
import { Input } from "../Input";
import type { TaskStateModel } from "../../models/TaskStateModel";

type MainFormProps = {
    state: TaskStateModel;
}

export function MainForm({ state }: MainFormProps){
    return(
        <form action="" className='form'>
                <div className='formRow'>
                    {/* <Input id="meuInput" type="text" labelText={numero.toString()} placeholder='Digite algo'/> */}
                    <Input id="meuInput" type="text" labelText="Task" placeholder='Digite algo'/>
                </div>

                <div className='formRow'>
                    <p>Tarefa atual: {state.activeTask?.name || 'Nenhuma tarefa ativa'}</p>
                </div>

                <div className='formRow'>
                    <Cycles currentCycle={state.currentCycle}/>
                </div>

                <div className='formRow'>
                    <Button icon={<PlayCircleIcon/>}/>
                </div>
            </form>
    );
}