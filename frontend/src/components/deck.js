import Card from "./card";

export default function Deck() {
    const square = document.querySelectorAll('#board div')[1]
    const dynamicWidth = square?.offsetWidth ?? 50
    const dynamicHeight = square?.offsetHeight ?? 60

    return (
        <div style={{width: `${dynamicWidth}px`, height: `${dynamicHeight}px`}}>
            <Card num={9} color={'red'}/>
        </div>
    )
}