import { useEffect, useState } from "react";
import { useSelector, useDispatch, } from 'react-redux';
import { shuffleCards } from '../redux/memoryCardsSlice'
import { Row, Col } from 'react-bootstrap';

function ScoreBar() {
    const dispatch = useDispatch();

    //Selectors
    let points = useSelector((state) => state.memoryCards.points);
    const cards = useSelector((state) => state.memoryCards.items);

    //States
    const [isShuffle, setIsShuffle] = useState(false);

    // Game Status
    let isCompleted = cards.every((card) => (card.isOpen === true))
    let numberOFUnOpenCards = cards.filter((card) => (card.isOpen === false)).length

    // Shuffle Cards
    useEffect(() => {
        dispatch(shuffleCards(isShuffle))
    }, [isShuffle, dispatch])


    return (
        <Row xs={1} md={3} className='scoreBar justify-content-center align-items-center mt-0 mb-2 py-2 h-100 '>
            <Col className='score text-center '>{isCompleted ? 'Game Completed' : 'Playing'}</Col>
            <Col className='score text-center'>{points ? points : 0} Points</Col>
            {isCompleted ? <Col className='score text-center btn' onClick={() => setIsShuffle(!isShuffle ? true : false)}>New Game</Col> : <Col className='score text-center '>{`${numberOFUnOpenCards} Cards Left`}</Col>}
        </Row>
    )
}

export default ScoreBar