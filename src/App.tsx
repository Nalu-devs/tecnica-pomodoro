import './styles/theme.css';
import './styles/global.css';

export function App() {
    //o tsx não retorna mais de um elemento, ele precisa estar com um elemento pai, por exemplo a div, porem pode ser <></> vazio
    return (
        <>
        <div className='container'>
            <div className='content'>
                <section>LOGO</section>
            </div>
        </div>

        <div className='container'>
            <div className='content'>
                <section>MENU</section>
            </div>
        </div>

        <div className='container'>
            <div className='content'>
                <section>FORM</section>
            </div>
        </div>

        <div className='container'>
            <div className='content'>
                <section>FOOTER</section>
            </div>
        </div>
        </>);
}
// export default App; dessa forma o nome do import no main pode ser qualquer um por isso é melhor a outra opção abaixo:
// export {App}; usuariamos assim para sites basicos com somente um export, porem é mais facil exportar logo a function