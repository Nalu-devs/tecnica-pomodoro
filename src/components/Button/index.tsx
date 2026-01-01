import styles from './styles.module.css';
import type React from "react";

type Button = {
    icon: React.ReactNode;
    color?: 'green' | 'red';
} & React.ComponentProps<'button'>;


export function Button({icon, color="green" ,...rest}: Button){
    return (
        <>
            <button className={`${styles.button} ${styles[color]}`} {...rest}>{icon}</button>
        </>
    );
}