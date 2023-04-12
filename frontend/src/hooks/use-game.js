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

    const [cardPositions, setCardPositions] = useState([]) // an array with the positions of the card placed in the game board
    const [gameId, setGameId] = useState(null) // store the current game id
    const [socketIo, setSocketIo] = useState(null) // the socket io connection for emit and receive msg
    const [isStart, setIsStart] = useState(false) // set if the game is start or not
    const [currentCard, setCurrentCard] = useState({}) // set the current card in the deck
    const [msgEndGame, setMsgEndGame] = useState("") // the endgame message if there is a winner
    const isFirstCard = useRef(true)

    /**
     * Add card to the game board, verification is process in backend
     *
     * @param number x
     * @param x
     * @param y
     * @param color
     * @param _id
     */
    const addCardToBoard = async (x, y, {color, number, cardId}) => {
        await axiosConfig.post('/gameMoves', {
            posX: x,
            posY: y,
            gameId,
            cardId
        })
            .then(({data}) => {
                // refresh the game board
                setCardPositions((previousCardPositions) => {
                    previousCardPositions[x][y] = {color, number}
                    return previousCardPositions
                })
                if (isFirstCard.current) {
                    isFirstCard.current = false
                }
                setCurrentCard({})
            })
            .catch(({error}) => {
                console.error('impossible to place the card here')
            })
    }

    /**
     * Refresh board if a player placed a card
     *
     * @param x
     * @param y
     * @param color
     * @param number
     */
    const addCardFromOtherPlayer = (x, y, {color, number}) => {
        setCardPositions((previousCardPositions) => {
            previousCardPositions[x][y] = {color, number}
            return previousCardPositions
        })
        if (isFirstCard.current) {
            isFirstCard.current = false
        }
    }

    /**
     * check if the placed card has a card around it
     *
     * @param x
     * @param y
     * @return {boolean}
     */
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
                down ||
                (isFirstCard && x === 5 && y === 5)
            ) {
                hasCardAround = true
            }
        }
        return hasCardAround
    }

    /**
     * check if the card can be dropped
     * @param x
     * @param y
     * @param number
     * @return {boolean}
     */
    const canDrop = (x, y, {number}) => {
        const isOccupied = squareIsOccupied(x, y)
        return (isOccupied && isOccupied.number < number) || (!isOccupied && hasCardAround(x, y))
    }

    const squareIsOccupied = (x, y) => {
        return cardPositions?.[x]?.[y]
    }

    useEffect(() => {
        if(socketIo && !isStart) {

            // intercept socket with 'join-game' event and check if the game is started or not
            socketIo.emit('join-game', {userId: auth.userId, gameId}, ({status, msg, isStart}) => {
                if (status === 'success') {
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

    // add socket event listener if a game is run
    const calledOnce = useRef(false)
    useEffect(() => {
        if (!isStart || calledOnce.current) return

        if (cardPositions.length === 0) {
            let cardPositionsTmp = Array(11)
            for(let i = 0; i < cardPositionsTmp.length; i++) {
                cardPositionsTmp[i] = Array(11)
            }
            setCardPositions(cardPositionsTmp)
        }

        // listen if the next card is placed and refresh the deck
        socketIo.on('next-card', ({card}) => {
            setCurrentCard(card)
        })

        // listen if a player placed a card
        socketIo.on('card-placed', ({move, card}) => {
            addCardFromOtherPlayer(move.posX, move.posY, card)
        })

        // listen if the game is finished
        socketIo.on('finished', ({playerId}) => {
            if (playerId === auth.userId) {
                setMsgEndGame('Congratulations you have won the game.')
            } else {
                setMsgEndGame(`Player ${playerId} won.`)
            }
        })

        calledOnce.current = true;
    }, [cardPositions, isStart, socketIo, auth])

    return {
        cardPositions,
        gameId,
        socketIo,
        isStart,
        currentCard,
        msgEndGame,
        setSocketIo,
        setGameId,
        addCardToBoard,
        canDrop,
        squareIsOccupied,
    }
}