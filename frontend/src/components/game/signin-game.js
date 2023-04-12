import {
    ToggleButton,
    ToggleButtonGroup,
    Card,
    Button,
    Row,
    Alert
} from "react-bootstrap"
import {useEffect, useState} from "react"
import axiosConfig from "../../axiosConfig"
import {useAuth} from "../../hooks/use-auth"
import {useNavigate} from "react-router-dom"
import {useGame} from "../../hooks/use-game"

export default function SignInGame() {
    const auth = useAuth()
    const game = useGame()
    const navigate = useNavigate()

    const [nbPlayers, setNbPlayers] = useState(2)
    const [error, setError] = useState('')

    const searchAvailableGame = () => {
        axiosConfig.post('/games/subscribe', {
            userId: auth.userId,
            nbPlayers
        })
            .then(({data}) => {
                game.setGameId(data.success.gameId)
                navigate('/game/waitingroom')
            })
            .catch(({error}) => {
                setError(error)
            })
    }

    useEffect(() => {
        if (error?.length > 0) {
            document.getElementById('errorOnSignInGame').style.display = 'block';
        }
    }, [error])

    return (
        <Row>
            <Alert id='errorOnSignInGame' key={"danger"} variant={"danger"} style={{display: 'none'}}>
                {error}
            </Alert>
            <Card>
                <Card.Header>Préparation de la partie</Card.Header>
                <Card.Body>
                    <Row>
                        <p>Nombre de joueurs dans la partie:</p>
                        <ToggleButtonGroup type="radio" name="nbPlayers" defaultValue={2}>
                            <ToggleButton onChange={e => setNbPlayers(e.target.value)} id='2-players' value={2}>2</ToggleButton>
                            <ToggleButton onChange={e => setNbPlayers(e.target.value)} id='3-players' value={3}>3</ToggleButton>
                            <ToggleButton onChange={e => setNbPlayers(e.target.value)} id='4-players' value={4}>4</ToggleButton>
                        </ToggleButtonGroup>
                    </Row>
                    <Button className="mt-1" variant="primary" onClick={searchAvailableGame}>Lancer la recherche</Button>
                </Card.Body>
            </Card>
        </Row>
    )
}