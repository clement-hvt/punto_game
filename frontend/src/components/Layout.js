import {Container} from "react-bootstrap";
import Logo from "./logo";

export default function Layout({children}) {
    return (
        <Container fluid style={{background: "#131313"}}>
            <Logo/>
            {children}
        </Container>
    )
}