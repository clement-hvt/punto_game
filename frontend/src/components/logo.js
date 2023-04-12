import {Row} from "react-bootstrap";
import {puntoColor} from '../ressources/color'

export default function Logo() {
    return (
        <Row className='justify-content-center'>
            <div className='d-flex justify-content-around' style={{width: '50vw'}}>
                <p className='display-1' style={{color: puntoColor.red}}>P</p>
                <p className='display-1' style={{color: puntoColor.blue}}>U</p>
                <p className='display-1' style={{color: puntoColor.yellow}}>N</p>
                <p className='display-1' style={{color: puntoColor.green}}>T</p>
                <p className='display-1' style={{color: puntoColor.red}}>O</p>
            </div>
        </Row>

    );
}