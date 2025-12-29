import styles from './Heading.module.css';

// usamos props como propriedades do elemento

export function Heading(props){
    return <h1 className={styles.heading}>{props.children}</h1>
}