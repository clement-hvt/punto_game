export default function ColumnCard({nbrDot, color}) {
    return (
        <div className='column'>
            {
                [...Array(nbrDot)].map((x, i) =>
                    <span style={{backgroundColor: color}} className="dot" key={i}></span>
                )
            }
        </div>
    )
}