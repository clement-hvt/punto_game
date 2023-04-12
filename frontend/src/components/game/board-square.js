import {useDrop} from "react-dnd";
import {dragTypes} from "../../ressources/drag-types";
import {puntoColor} from "../../ressources/color";

const square = {
    height: '9.09%',
    width: '9.09%',
    position: 'relative',
    padding: '2px'
}

const styleDnd = {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    zIndex: 1,
    opacity: 0.5,
}

const droppableSquare = {
    border: '2px solid',
    borderRadius: '10%'
}
export default function BoardSquare({x, y, game, updateBoard, children}) {

    const [{ isOver, canDrop}, drop] = useDrop(() => ({
        accept: dragTypes.CARD,
        drop: (item) => {
            game.addCardToBoard(x, y, item)
            updateBoard(item)
        },
        canDrop: (item) => game.canDrop(x, y, item),
        collect: monitor => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop()
        }),
    }), [x, y])

    return (
        <div
            ref={drop}
            style={square}
        >
            {children}
            {isOver && canDrop && (
                <div
                    style={{...styleDnd, ...droppableSquare, borderColor: puntoColor.green}}
                />
            )}
            {!isOver && canDrop && (
                <div
                    style={{...styleDnd, ...droppableSquare, borderColor: puntoColor.blue}}
                />
            )}
        </div>
    )
}