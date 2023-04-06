import './card.css'
import ColumnCard from "./columnCard";
import {puntoColor} from "../../ressources/color";
import {useDrag} from "react-dnd";
import {dragTypes} from "../../ressources/drag-types";

function generateCard(num , color){
    color = puntoColor[color]
    const intToStringNumber = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth'];
    const diceSchema = {
        fourth: [2, 2],
        fifth: [2, 1, 2],
        sixth: [3, 3],
        seventh: [3, 1, 3],
        eighth: [3, 2, 3],
        ninth: [3, 3, 3],
    }
    const diceElement = [];
    const schema = diceSchema[intToStringNumber[num-1]]
    if (schema) {
        for(let i = 0; i < schema.length; i++) {
            diceElement.push(<ColumnCard key={`${num}-${color}-${i}`} nbrDot={schema[i]} color={color}/>)
        }
    } else {
        for(let i = 0; i < num; i++) {
            diceElement.push(<span style={{backgroundColor: color}} className="dot"></span>)
        }
    }
    return [intToStringNumber[num-1], diceElement]
}

export default function Card({num, color}) {
    const [{isDragging}, drag] = useDrag(() => ({
        type: dragTypes.CARD,
        item: {
            color,
            num
        },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }))
    const [stringNumber, dice] = generateCard(num, color)

    return (
        <div ref={drag} className={`dice ${stringNumber}-face`}>{dice}</div>
    )
}