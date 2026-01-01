import { HistoryIcon, HomeIcon, SettingsIcon, SunMoonIcon } from 'lucide-react';
import styles from './styles.module.css';
import { useState } from 'react';

type EscolherTema = 'dark' | 'light';

export function Menu(){

    const [theme, setTheme] = useState<EscolherTema>('dark');

    function mudarTheme(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>){
        event.preventDefault(); //impede que a pagina va para o lugar dela, nesse caso impede que va para "#"
        }

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