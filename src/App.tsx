import './styles/theme.css';
import './styles/global.css';

export function App() {
    console.log("Hello word");
    //o tsx não retorna mais de um elemento, ele precisa estar com um elemento pai, por exemplo a div, porem pode ser <></> vazio
    return (
        <>
            <h1>Olá mundo!</h1>
            <p>Sejam bem vindos ao meu primeiro app pelo react</p>
        </>);
}
// export default App; dessa forma o nome do import no main pode ser qualquer um por isso é melhor a outra opção abaixo:

// export {App}; usuariamos assim para sites basicos com somente um export, porem é mais facil exportar logo a function