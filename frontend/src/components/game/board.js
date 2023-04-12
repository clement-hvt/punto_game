import Card from "./card";
import BoardSquare from "./board-square";
import {useEffect, useState} from "react";
import Deck from "./deck";
import {useGame} from "../../hooks/use-game";
import {Button, Modal} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

function renderSquare(i, y, game, updateBoard) {
    const x = i % 11;
    return (
        <BoardSquare x={x} y={y} updateBoard={updateBoard} game={game} key={`${x}-${y}-${Math.floor(Math.random() * 1000)}`}>{renderCard(x, y, game)}</BoardSquare>
    )
}

function renderCard(x, y, game){
    let card = game.squareIsOccupied(x, y)
    if (card) {
        return <Card number={card.number} color={card.color}/>
    }
}
export default function Board() {
    const game = useGame()
    const navigate = useNavigate()

    const [, updateBoard] = useState([])
    const [show, setShow] = useState(false)

    useEffect(() => {
        if (game.msgEndGame.length > 0) {
            setShow(true)
        }
    }, [game.msgEndGame])

    const handleClose = () => {
        navigate('/game/signin')
    };

    const square = [];
    let y = 0
    for(let i = 0; i < 121; i++) {
        square.push(renderSquare(i, y, game, updateBoard));
        if (i % 11 === 0 && i !== 0) y++;
    }

    return (
        <div style={{height: '80vh', width: '60vw'}} id='board'>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>{game.msgEndGame}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexWrap: 'wrap'
            }}>
                {square}
            </div>
            <Deck />
        </div>
    )
}