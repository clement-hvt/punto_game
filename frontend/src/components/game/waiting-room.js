import {Row, Spinner} from "react-bootstrap"
import {useNavigate} from "react-router-dom"
import {io} from "socket.io-client"
import {useGame} from "../../hooks/use-game"
import {useEffect, useRef} from "react"

export default function WaitingRoom() {
    const navigate = useNavigate()
    const game = useGame()

    useEffect(() => {
        if (!game.gameId) {
            navigate('/game/signin', {state: {error: `Une erreur s'est produite veuillez vous réinscrire.`}})
        }
    }, [game.gameId, navigate])

    const calledOnce = useRef(false)
    useEffect(() => {
        if (calledOnce.current) {
            return;
        }
        const socketIo = io('ws://localhost:3000', {transports: ["websocket"]})
        game.setSocketIo(socketIo)

        calledOnce.current = true
    }, [game])

    useEffect(() => {
        if (game.isStart) {
            navigate('/game/board')
        }
    }, [game.isStart, navigate])

    return (
        <Row className='justify-content-center'>
            <Spinner animation="border" role="status"  variant="white">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
            <div>
                <p className='text-center text-white'>En attente du lancement de la partie ...</p>
            </div>
        </Row>
    )
}