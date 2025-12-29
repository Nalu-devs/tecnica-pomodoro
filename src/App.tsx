import './styles/theme.css';
import './styles/global.css';
import { Heading } from './components/Heading';
import { TimerIcon } from 'lucide-react';

export function App() {
    console.log("Hello word");
    //o tsx não retorna mais de um elemento, ele precisa estar com um elemento pai, por exemplo a div, porem pode ser <></> vazio
    return (
        <>
            <Heading>
                Ola mundo 1
                <button>
                    <TimerIcon/>
                </button>
            </Heading>
            <p>Sejam bem vindos ao meu primeiro app pelo react</p>
        </>);
}
// export default App; dessa forma o nome do import no main pode ser qualquer um por isso é melhor a outra opção abaixo:
// export {App}; usuariamos assim para sites basicos com somente um export, porem é mais facil exportar logo a function