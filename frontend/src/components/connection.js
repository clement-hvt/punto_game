import {Form, Button, Row, Container} from 'react-bootstrap'
import {Link, useNavigate} from 'react-router-dom'
import {useState} from "react"
import { useAuth } from '../hooks/use-auth'
import '../index.css'
import Logo from "./logo";

export default function Connection() {
    const auth = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        await auth.signIn(email, password);
        navigate('/inscription');
    }
    return (
        <Container style={{background: "#131313"}}>
            <Logo />
            <Row className="h-100 align-items-center">
                <h1 className="display-6">Se connecter</h1>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className="">E-mail</Form.Label>
                        <Form.Control
                            type="email"
                            onChange={e => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Mot de passe</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            onChange={e => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={e => handleSubmit(e)}
                    >
                        Se connecter
                    </Button>
                </Form>
                <Link to="/inscription">S'inscrire</Link>
            </Row>
        </Container>
    );
}