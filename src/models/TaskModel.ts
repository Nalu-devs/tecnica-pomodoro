import type { TaskStateModel } from "./TaskStateModel";

export type TaskModel = {
    id: string;
    name: string;
    duration: number;
    startDate: number;
    completeDate: number | null; //quando o time chega no final
    interruptDate: number | null; //qunado a taks for interrompida
    // type: 'workTime' | 'shortBreakTime' | 'longBreakTime';
    type: keyof TaskStateModel['config'];
}