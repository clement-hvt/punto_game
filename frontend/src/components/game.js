import Board from "./board";
import {createRoot} from "react-dom/client";
import GlobalDndContext from "./global-dnd-context";
import React from "react";
export default class Game {

    /**  @type object */
    #cardPositions;
    /** @type number */
    #gameId;

    constructor(gameId, boardArray = []) {
        this.#gameId = gameId;
        if(boardArray.length === 0) {
            this.#initCardPositions();
        }
    }

    #initCardPositions() {
        this.#cardPositions = Array(11);
        for(let i = 0; i < this.#cardPositions.length; i++) {
            this.#cardPositions[i] = Array(11);
        }
        this.#cardPositions[5][5] = {color: 'red', num: 8};
    }

    /**
     * @param number x
     * @param x
     * @param y
     */
    addCardToBoard(x, y, {color, num}) {
        this.#cardPositions[x][y] = {color, num};
    }

    canDrop(x, y, {num}) {
        const isOccupied = this.squareIsOccupied(x, y);
        const hasCardAround = this.#hasCardAround(x, y);
        return (isOccupied && isOccupied.num < num) || (!isOccupied && hasCardAround);
    }

    squareIsOccupied(x, y) {
        return this.#cardPositions?.[x]?.[y];
    }

    #hasCardAround(x, y) {
        let hasCardAround = false;
        if (x && y) {
            const bottomLeftCorner = this.#cardPositions?.[x-1]?.[y-1];
            const bottomRightCorner = this.#cardPositions?.[x+1]?.[y-1];
            const upperLeftCorner = this.#cardPositions?.[x-1]?.[y+1];
            const upperRightCorner = this.#cardPositions?.[x+1]?.[y+1];
            const toTheLeft = this.#cardPositions?.[x-1]?.[y];
            const toTheRight = this.#cardPositions?.[x+1]?.[y];
            const up = this.#cardPositions?.[x]?.[y+1];
            const down = this.#cardPositions?.[x]?.[y-1];
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
                hasCardAround = true;
            }
        }
        return hasCardAround;
    }

    /** @return object */
    get cardPositions() {
        return this.#cardPositions;
    }
    /** @return string */
    get gameId() {
        return this.#gameId;
    }
}