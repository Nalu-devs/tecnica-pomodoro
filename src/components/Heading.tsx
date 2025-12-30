import styles from '../styles/Heading.module.css';

type HeadingProps = {
    children: React.ReactNode
}

// usamos props como propriedades do elemento

//usamos o children quando desustruração, usado em js

export function Heading({children}: HeadingProps){
    return <h1 className={styles.heading}>{children}</h1>
}