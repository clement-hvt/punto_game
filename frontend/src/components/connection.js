import {Form, Button, Row} from 'react-bootstrap'
import {Link, useNavigate} from 'react-router-dom'
import {useState} from "react"
import {useAuth} from '../hooks/use-auth'
import '../index.css'

export default function Connection() {
    const auth = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        await auth.signIn(email, password);
        navigate('/game/signin');
    }
    return (
        <Row className="h-100 align-items-center">
            <h1 className="display-6 text-light">Se connecter</h1>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label  className='text-light'>E-mail</Form.Label>
                    <Form.Control
                        type="email"
                        onChange={e => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label className='text-light'>Mot de passe</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        onChange={e => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button
                    variant="secondary"
                    type="submit"
                    onClick={e => handleSubmit(e)}
                >
                    Se connecter
                </Button>
            </Form>
            <Link to="/inscription">S'inscrire</Link>
        </Row>
    );
}