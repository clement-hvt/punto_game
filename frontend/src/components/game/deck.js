import Card from "./card";
import {useGame} from "../../hooks/use-game";
import {useEffect, useState} from "react";

export default function Deck() {
    const game = useGame()
    const [card, setCard] = useState({})

    useEffect(() => {
        setCard(game.currentCard)
    }, [game.currentCard])

    const square = document.querySelectorAll('#board div')[1]
    const dynamicWidth = square?.offsetWidth ?? 50
    const dynamicHeight = square?.offsetHeight ?? 60

    return (
        <div style={{width: `${dynamicWidth}px`, height: `${dynamicHeight}px`}}>
            {
                Object.keys(card).length !== 0 ?
                    <Card number={card.number} color={card.color} cardId={card._id} isDraggable={true}/> :
                    null
            }
        </div>
    )
}