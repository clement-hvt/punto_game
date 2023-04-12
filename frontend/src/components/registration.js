import {Form, Button, Row, Container, Col} from 'react-bootstrap'
import {Link, useNavigate} from 'react-router-dom'
import {useState} from "react"
import {useAuth} from '../hooks/use-auth'
import Logo from "./logo";

export default function Registration() {
    const auth = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const handleSubmit = async (event) => {
        event.preventDefault();
        await auth.signup({email, password, confirmPassword});
        navigate("/game/signin");
    }
    return (
        <Row className="align-items-center justify-content-center">
            <h1 className="display-6 text-light">S'inscrire</h1>
            <Form method="POST">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className='text-light'>E-mail</Form.Label>
                    <Form.Control
                        type="email"
                        onChange={e => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label className='text-light'>Mot de passe</Form.Label>
                            <Form.Control
                                type="password"
                                onChange={e => setPassword(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="formBasicPasswordConfirm">
                            <Form.Label className='text-light'>Confirmer le mot de passe</Form.Label>
                            <Form.Control
                                type="password"
                                onChange={e => setConfirmPassword(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Button
                    variant="secondary"
                    type="submit"
                    onClick={e => handleSubmit(e)}
                >S'inscrire</Button>
            </Form>
            <Link to="/connexion">Se connecter</Link>
        </Row>
    );
}