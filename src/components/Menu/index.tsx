import { HistoryIcon, HomeIcon, SettingsIcon, SunMoonIcon } from 'lucide-react';
import styles from './styles.module.css';
import { useState, useEffect } from 'react';

type EscolherTema = 'dark' | 'light';

export function Menu(){

    const [theme, setTheme] = useState<EscolherTema>('dark');

    function mudarTheme(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>){
        event.preventDefault(); //impede que a pagina va para o lugar dela, nesse caso impede que va para "#"
        
        setTheme( prevTheme => {
            const proximoTheme = prevTheme === 'dark' ? 'light' : 'dark'
            return proximoTheme;
        } 
    )

    // document.documentElement.setAttribute('data-theme',theme); isso causa um efeito colateral na pagina e deve ser evitado usando outro Use, o useEffect
        }

    // useEffect(() => {
    //     console.log('useEffect sem dependencias (array)', Date.now());
    // }) Ele executa quando a tela atualiza, fazendo assim todo esse componente index.tsx recarregar de novo na tela. Nesse caso toda vez que apertamos no link de tema ele executa

    // useEffect(() => {
    //     console.log('useEffect com array sem dependencias', Date.now());
    // }, []) Ele executa somente quando a pagina carrega, se apertar no link de tema não executa

    useEffect(() => {
        console.log('Thema mudou', theme ,Date.now());
        document.documentElement.setAttribute('data-theme',theme);
    }, [theme]) //Ele só executa quando o valor da dependencia mudar

    return(
        <nav className={styles.menu}>
            <a href="#" aria-label='Ir para a home' title="Ir para a home" className={styles.menuLink}>
                <HomeIcon/>
            </a>
            
            <a href="#" aria-label='Hitórico de navegação' title="Hitórico de navegação" className={styles.menuLink}>
                <HistoryIcon/>
            </a>
            
            <a href="#" aria-label='Configurações' title='Configurações' className={styles.menuLink}>
                <SettingsIcon/>
            </a>
            
            <a onClick={mudarTheme} href="#" aria-label='Mudar tema' title='Mudar tema' className={styles.menuLink}>
                <SunMoonIcon/>
            </a>
        </nav>
    );
}