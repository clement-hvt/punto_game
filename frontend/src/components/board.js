export default function Board() {
    const squareCss = {
        minWidth: '5vw',
        height: '5vw',
        border: 'pink 1px',
        marginLeft: '5px',
        backgroundColor: 'pink'
    }

    const board = {
        maxHeight:'75vh',
        height:'75vh',
        maxWidth: '75vw',
        touchAction: 'manipulation',
        overflow: 'scroll'
    }
    const square = [];
    for(let i = 0; i < 50; i++) {
        square.push(<div style={squareCss}></div>)
    }
    return (
        <div style={board} className='bg-secondary border border-primary d-flex' onClick={e => e.preventDefault()}>
            {square}
        </div>
    )
}