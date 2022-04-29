import { useState, useEffect } from 'react'
import { useSelector, useDispatch, } from 'react-redux';
import { updateGameProcess } from '../redux/turkishCheckersSlice'
import { SimpleGrid, Box } from '@chakra-ui/react'

function GameTable() {
    const dispatch = useDispatch();
    //states & Selectors
    let checkers = useSelector((state) => state.turkishCheckers.checkers);
    let user1Settings = useSelector((state) => state.turkishCheckers.user1Settings);
    let user2Settings = useSelector((state) => state.turkishCheckers.user2Settings);
    let gameSettings = useSelector((state) => state.turkishCheckers.gameSettings);
    let gameProcess = useSelector((state) => state.turkishCheckers.gameProcess);

    // LocalStates
    const [currentChecker, setCurrentChecker] = useState('')
    const [nextChecker, setNextChecker] = useState({
        checker: [],
        newAllowedMoves: [],
    })

    useEffect(() => {
        dispatch(updateGameProcess({
            currentChecker,
            nextChecker
        }))
    }, [currentChecker, dispatch, nextChecker])

    // {
    //     id: counter,
    //     type: 'blackChecker',
    //     imageUrl: '/assets/blackStone_on_whiteArea.png',
    //     startingPosition: counter,
    //     currentPosition: counter,
    //     allowedMoves: [],
    //     isWeak: false,
    //     isForcedToKill: false,
    //     isRemoved: false,
    //     isSuperChecker: false
    // }
    const handleCheckerMove = ((checker) => {

        if (currentChecker == '') {
            setCurrentChecker(checker)
        } else if (currentChecker.type == checker.type) {
            setCurrentChecker(checker)
        }
        else if ((currentChecker.currentPosition != checker.currentPosition)) {

            //Comparison, the checker if it is white or black or dummy & Define "newAllowedMoves"
            if (checker.type == 'blackChecker') {
                if (((checker.currentPosition - 1) % 8) == 0) {
                    setNextChecker({
                        checkerData: checker,
                        newAllowedMoves: [checker.currentPosition + 1, checker.currentPosition + 8]
                    })
                } else if (checker.currentPosition % 8 == 0) {
                    setNextChecker(({
                        checkerData: checker,
                        newAllowedMoves: [checker.currentPosition - 1, checker.currentPosition + 8]
                    }))
                } else {
                    setNextChecker(({
                        checkerData: checker,
                        newAllowedMoves: [checker.currentPosition - 1, checker.currentPosition + 1, checker.currentPosition + 8]
                    }))
                }
            } else if (checker.type == 'whiteChecker') {
                if (((checker.currentPosition - 1) % 8) == 0) {
                    setNextChecker(({
                        checkerData: checker,
                        newAllowedMoves: [checker.currentPosition + 1, checker.currentPosition - 8]
                    }))
                } else if (checker.currentPosition % 8 == 0) {
                    setNextChecker(({
                        checkerData: checker,
                        newAllowedMoves: [checker.currentPosition - 1, checker.currentPosition - 8]
                    }))
                } else {
                    setNextChecker(({
                        checkerData: checker,
                        newAllowedMoves: [checker.currentPosition - 1, checker.currentPosition + 1, checker.currentPosition - 8]
                    }))
                }
            } else {
                setNextChecker(({
                    checkerData: checker,
                    newAllowedMoves: []
                }))
            }
        } else if (currentChecker.currentPosition == checker.currentPosition) {
            setCurrentChecker('')
        }
    })

    return (
        <>
            <SimpleGrid mt={16} columns={8} spacing={0} className='checkersTable' boxShadow='dark-lg' p='6' rounded='md' bg='white'>
                {checkers.map((checker, index) => (
                    <Box key={index} border='1px' borderColor='Gray.900' borderStyle='groove'
                        className={`cell ${currentChecker == checker ? "pickedCell" : ""}`} onClick={() => handleCheckerMove(checker)} >
                        <img alt='checkerImage' className='checkersImage' id={checker.id} src={checker.imageUrl} />

                        <span href="#" className="checkerNumber" >
                            {index + 1}
                        </span>
                    </Box>
                ))}
            </SimpleGrid>
        </>
    )
}

export default GameTable