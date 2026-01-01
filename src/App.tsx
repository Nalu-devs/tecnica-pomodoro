import './styles/theme.css';
import './styles/global.css';

import { Container } from './components/Container';
import { Logo } from './components/Logo';
import { Menu } from './components/Menu';
import { CountDown } from './components/CountDown';
import { Input } from './components/Input';
import { Cycles } from './components/Cycles';

export function App() {
    //o tsx não retorna mais de um elemento, ele precisa estar com um elemento pai, por exemplo a div, porem pode ser <></> vazio
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
                    <button>Enviar</button>
                </div>
            </form>
        </Container>
        </>);
}
// export default App; dessa forma o nome do import no main pode ser qualquer um por isso é melhor a outra opção abaixo:
// export {App}; usuariamos assim para sites basicos com somente um export, porem é mais facil exportar logo a function