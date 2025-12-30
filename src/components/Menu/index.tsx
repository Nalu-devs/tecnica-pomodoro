import { HistoryIcon, HomeIcon, SettingsIcon, SunMoonIcon } from 'lucide-react';
import styles from './styles.module.css';

export function Menu(){
    return(
        <nav className={styles.menu}>
            <a href="#" className={styles.menuLink}>
                <HomeIcon/>
            </a>
            
            <a href="#" className={styles.menuLink}>
                <HistoryIcon/>
            </a>
            
            <a href="#" className={styles.menuLink}>
                <SettingsIcon/>
            </a>
            
            <a href="#" className={styles.menuLink}>
                <SunMoonIcon/>
            </a>
        </nav>
    );
}