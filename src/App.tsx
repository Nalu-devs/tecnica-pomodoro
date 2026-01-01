import './styles/theme.css';
import './styles/global.css';

import { Container } from './components/Container';
import { Logo } from './components/Logo';
import { Menu } from './components/Menu';
import { CountDown } from './components/CountDown';
import { Input } from './components/Input';
import { Cycles } from './components/Cycles';
import { Button } from './components/Button';
import { PlayCircleIcon } from 'lucide-react';
import { Footer } from './components/Footer';

export function App() {
    //o tsx não retorna mais de um elemento, ele precisa estar com um elemento pai, por exemplo a div, porem pode ser <></> vazio
    // O useStates serve para criar uma função que quando for alterada e os campos tiverem essa função todos eles mudem, isso evita que o programa tenha um efeito colateral
    return (
        <>
        <Container>
            <Logo/>
        </Container>

        <Container>
            <Menu/>
        </Container>

        <Container>
            <CountDown/>
        </Container>

        <Container>
            <form action="" className='form'>
                <div className='formRow'>
                    <Input id="meuInput" type="text" labelText='Task' placeholder='Digite algo'/>
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
        </Container>

        <Container>
            <Footer/>
        </Container>
        </>);
}
// export default App; dessa forma o nome do import no main pode ser qualquer um por isso é melhor a outra opção abaixo:
// export {App}; usuariamos assim para sites basicos com somente um export, porem é mais facil exportar logo a function