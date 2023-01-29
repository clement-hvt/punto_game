import {DndProvider, useDragDropManager} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function GlobalDndContext({children}){
    return (
        <DndProvider backend={HTML5Backend} key={1}>{children}</DndProvider>
    )
}