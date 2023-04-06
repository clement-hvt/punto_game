import {createContext, useContext, useEffect, useRef, useState} from "react";
import {useAuth} from "./use-auth";
import axiosConfig from "../axiosConfig";

const gameContext = createContext()

export default function ProvideGame({children}) {
    const game = useProvideGame()
    return <gameContext.Provider value={game}>{children}</gameContext.Provider>
}

export const useGame = () => {
    return useContext(gameContext)
}

function useProvideGame() {

    const auth = useAuth()

    const [cardPositions, setCardPositions] = useState([])
    const [gameId, setGameId] = useState(null)
    const [socketIo, setSocketIo] = useState(null)
    const [isStart, setIsStart] = useState(false)
    const [currentCard, setCurrentCard] = useState({})

    /**
     * @param number x
     * @param x
     * @param y
     * @param color
     * @param _id
     */
    const addCardToBoard = async (x, y, {color, number, _id}) => {
        await axiosConfig.post('/gameMoves', {
            posX: x,
            posY: y,
            gameId,
            cardId: _id
        })
            .then(({data}) => {
                setCardPositions((previousCardPositions) => {
                    previousCardPositions[x][y] = {color, number}
                    setCardPositions(previousCardPositions)
                })
                setCurrentCard({})
            })
            .catch(({error}) => {
                console.error('impossible to place the card here')
            })
    }
    const hasCardAround = (x, y) => {
        let hasCardAround = false;
        if (x && y) {
            const bottomLeftCorner = cardPositions?.[x-1]?.[y-1]
            const bottomRightCorner = cardPositions?.[x+1]?.[y-1]
            const upperLeftCorner = cardPositions?.[x-1]?.[y+1]
            const upperRightCorner = cardPositions?.[x+1]?.[y+1]
            const toTheLeft = cardPositions?.[x-1]?.[y]
            const toTheRight = cardPositions?.[x+1]?.[y]
            const up = cardPositions?.[x]?.[y+1]
            const down = cardPositions?.[x]?.[y-1]
            if (
                bottomLeftCorner ||
                bottomRightCorner ||
                upperLeftCorner ||
                upperRightCorner ||
                toTheLeft ||
                toTheRight ||
                up ||
                down
            ) {
                hasCardAround = true
            }
        }
        return hasCardAround
    }
    const canDrop = (x, y, {num}) => {
        const isOccupied = squareIsOccupied(x, y)
        return (isOccupied && isOccupied.number < num) || (!isOccupied && hasCardAround(x, y))
    }

    const squareIsOccupied = (x, y) => {
        return cardPositions?.[x]?.[y]
    }

    useEffect(() => {
        if(socketIo && !isStart) {
            socketIo.emit('join-game', {userId: auth.userId, gameId}, ({status, msg, isStart}) => {
                if (status === 'success') {
                    console.log(msg)

                    if (isStart) {
                        setIsStart(true)
                    } else {
                        socketIo.on('start-game', ({error}) => {
                            if (error) {
                                console.error(error)
                            } else {
                                setIsStart(true)
                            }
                        })
                    }
                } else {
                    console.error('You have not been added to the room')
                }
            })
        }
    }, [auth.userId, gameId, isStart, socketIo])

    const calledOnce = useRef(false)
    const isFirstCard = useRef(true)
    useEffect(() => {
        if (!isStart || calledOnce.current) return

        if (cardPositions.length === 0) {
            let cardPositionsTmp = Array(11)
            for(let i = 0; i < cardPositionsTmp.length; i++) {
                cardPositionsTmp[i] = Array(11)
            }
            setCardPositions(cardPositionsTmp)
        }

        socketIo.on('next-card', ({card}) => {
            console.log(card)
            setCurrentCard(card)
            if(isFirstCard) {
                addCardToBoard(5, 5, card)
                isFirstCard.current = false
            }
        })

        calledOnce.current = true;
    }, [cardPositions, isStart, socketIo])

    return {
        cardPositions,
        gameId,
        socketIo,
        isStart,
        currentCard,
        setSocketIo,
        setGameId,
        addCardToBoard,
        canDrop,
        squareIsOccupied,
    }
}