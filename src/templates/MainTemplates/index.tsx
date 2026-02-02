import { Container } from "../../components/Container";
import { Footer } from "../../components/Footer";
import { Logo } from "../../components/Logo";
import { Menu } from "../../components/Menu";

type MainTemplateProps = {
    children: React.ReactNode;
    currentPage?: 'home' | 'tasks';
    setCurrentPage?: (page: 'home' | 'tasks') => void;
}

export function MainTemplate({children, currentPage = 'home', setCurrentPage = () => {}}: MainTemplateProps) {
    return (
        <>
        <Container>
            <Logo/>
        </Container>

        <Container>
            <Menu currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </Container>

        {children}

        <Container>
            <Footer/>
        </Container>
        </>);
}