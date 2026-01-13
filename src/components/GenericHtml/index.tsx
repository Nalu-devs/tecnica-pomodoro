import styles from './styles.module.css';

type GenericHtmlProps = {
    children: React.ReactNode;
}

export default function GenericHtml({children}: GenericHtmlProps){
    return <div className={styles.genericHtml}>
        {children}
    </div>
}