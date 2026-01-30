import styles from './styles.module.css';
import type React from "react";
type Button = {
    icon?: React.ReactNode;
    color?: 'green' | 'red';
    children?: React.ReactNode;
} & React.ComponentProps<'button'>;

export function Button({icon, color="green", children, ...rest}: Button){
    return (
        <>
            <button className={`${styles.button} ${styles[color]}`} {...rest}>
                {icon}
                {children}
            </button>
        </>
    );
}