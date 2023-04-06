import {
    Route,
    Routes
} from "react-router-dom";
import SignInGame from "./signin-game";
import Board from "./board";
import WaitingRoom from "./waiting-room";
import ProvideGame from "../../hooks/use-game";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";
export default function GameRoutes() {

    return (
        <ProvideGame>
            <Routes>
                <Route path='/signin' element={<SignInGame />}/>
                <Route path='/board' element={
                    <DndProvider backend={HTML5Backend} key={1}>
                        <Board/>
                    </DndProvider>
                }/>
                <Route path='/waitingroom' element={<WaitingRoom/>} />
            </Routes>
        </ProvideGame>
    );
}