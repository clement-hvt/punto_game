import Card from "./card";
import BoardSquare from "./board-square";
import {useState} from "react";
import Deck from "./deck";

function renderSquare(i, y, game, updateBoard) {
    const x = i % 11;
    return (
        <BoardSquare x={x} y={y} updateBoard={updateBoard} game={game} key={`${x}-${y}-${Math.floor(Math.random() * 1000)}`}>{renderCard(x, y, game)}</BoardSquare>
    )
}

function renderCard(x, y, game){
    let card = game.squareIsOccupied(x, y)
    if (card) {
        return <Card num={card.num} color={card.color}/>
    }
}
export default function Board({game}) {
    const [board, updateBoard] = useState([]);

    const square = [];
    let y = 0
    for(let i = 0; i < 121; i++) {
        square.push(renderSquare(i, y, game, updateBoard));
        if (i % 11 === 0 && i !== 0) y++;
    }

    return (
            <div style={{height: '80vh', width: '60vw'}} id='board'>
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