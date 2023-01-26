import {ToggleButton, ToggleButtonGroup, Card, Button, Row, Container, Col, InputGroup, Form} from "react-bootstrap";
import {useState} from "react";
import Logo from "./logo";

export default function SignInGame() {
    const [nbPlayers, setNbPlayers] = useState(2)
    const [pseudo, setPseudo] = useState("")

    return (
        <Container>
            <Logo />
            <Card>
                <Card.Header>Préparation de la partie</Card.Header>
                <Card.Body>
                    <Row className='align-items-center'>
                        <Col>
                            <InputGroup className="mb-3">
                                <InputGroup.Text id="basic-addon1">Pseudo</InputGroup.Text>
                                <Form.Control
                                    placeholder="Pseudo"
                                    onChange={e => setPseudo(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                        <Col>
                            <Row>
                                <p>Nombre de joueurs dans la partie:</p>
                                <ToggleButtonGroup type="radio" name="nbPlayers" defaultValue={2}>
                                    <ToggleButton onChange={e => setNbPlayers(e.target.value)} id='2-players' value={2}>2</ToggleButton>
                                    <ToggleButton onChange={e => setNbPlayers(e.target.value)} id='3-players' value={3}>3</ToggleButton>
                                    <ToggleButton onChange={e => setNbPlayers(e.target.value)} id='4-players' value={4}>4</ToggleButton>
                                </ToggleButtonGroup>
                            </Row>
                        </Col>
                    </Row>
                    <Button variant="primary">Lancer la recherche</Button>
                </Card.Body>
            </Card>
        </Container>


    )
}