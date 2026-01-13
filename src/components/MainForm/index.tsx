import { PlayCircleIcon } from "lucide-react";
import { Button } from "../Button";
import { Cycles } from "../Cycles";
import { Input } from "../Input";

export function MainForm(){
    return(
        <form action="" className='form'>
                <div className='formRow'>
                    {/* <Input id="meuInput" type="text" labelText={numero.toString()} placeholder='Digite algo'/> */}
                    <Input id="meuInput" type="text" labelText="Task" placeholder='Digite algo'/>
                </div>

                <div className='formRow'>
                    <p>Lorem ipsum dolor sit amet.</p>
                </div>

                <div className='formRow'>
                    <Cycles/>
                </div>

                <div className='formRow'>
                    <Button icon={<PlayCircleIcon/>}/>
                </div>
            </form>
    );
}