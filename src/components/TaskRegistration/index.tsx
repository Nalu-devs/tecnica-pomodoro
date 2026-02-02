import { PlusCircleIcon } from "lucide-react";
import { Button } from "../Button";
import { Input } from "../Input";
import { useState } from "react";
import type { TaskModel } from "../../models/TaskModel";

type TaskRegistrationProps = {
    onAddTask: (task: Omit<TaskModel, 'id' | 'startDate' | 'completeDate' | 'interruptDate'>) => void;
}

export function TaskRegistration({ onAddTask }: TaskRegistrationProps) {
    const [taskName, setTaskName] = useState('');
    const [taskDuration, setTaskDuration] = useState(25);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!taskName.trim()) return;

        onAddTask({
            name: taskName,
            duration: taskDuration,
            type: 'workTime'
        });

        setTaskName('');
        setTaskDuration(25);
    };

    return (
        <form onSubmit={handleSubmit} className='form'>
            <div className='formRow'>
                <Input 
                    id="taskName" 
                    type="text" 
                    labelText="Nome da Tarefa" 
                    placeholder='Digite o nome da tarefa'
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    required
                />
            </div>

            <div className='formRow'>
                <Input 
                    id="taskDuration" 
                    type="number" 
                    labelText="Duração (minutos)" 
                    placeholder='25'
                    value={taskDuration}
                    onChange={(e) => setTaskDuration(Number(e.target.value))}
                    min={1}
                    max={60}
                    required
                />
            </div>

            <div className='formRow'>
                <Button 
                    type="submit"
                    icon={<PlusCircleIcon />}
                />
            </div>
        </form>
    );
}