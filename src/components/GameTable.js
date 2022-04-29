import { useState } from 'react'
import { useSelector, useDispatch, } from 'react-redux';
import { getCheckerMove } from '../redux/turkishCheckersSlice'
import { SimpleGrid, Box } from '@chakra-ui/react'
function GameTable() {
    const dispatch = useDispatch();
    //States & Selectors
    let checkers = useSelector((state) => state.turkishCheckers.checkers);
    let user1Settings = useSelector((state) => state.turkishCheckers.user1Settings);
    let user2Settings = useSelector((state) => state.turkishCheckers.user2Settings);
    let gameSettings = useSelector((state) => state.turkishCheckers.gameSettings);
    let gameProcess = useSelector((state) => state.turkishCheckers.gameProcess);

    let clickedCheckerData = gameProcess.data
    let clickedCheckerLocations = {
        previousLocation: gameProcess.previousLocation,
        currentLocation: gameProcess.currentLocation,
    }
    // LocalStates
    const [clickedChecker, setClickedChecker] = useState(null)

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

        console.log("checker", checker)
        console.log("checkedCurrentPosition", checker.currentPosition)

        // Comparison, the checker if it is picked or moved?
        if (clickedChecker == null) {
            setClickedChecker(checker)
            console.log(checker.currentPosition, "is picked")
        } else if (clickedChecker.currentPosition != checker.currentPosition) {
            setClickedChecker(checker)
            //Comparison, the checker if it is white or black?
            if (checker.type == 'blackChecker') {
                if (((checker.currentPosition - 1) % 8) == 0) {
                    dispatch(getCheckerMove({
                        clickedChecker: clickedChecker,
                        newAllowedMoves: [checker.currentPosition + 1, checker.currentPosition + 8]
                    }))
                } else if (checker.currentPosition % 8 == 0) {
                    dispatch(getCheckerMove({
                        clickedChecker: clickedChecker,
                        newAllowedMoves: [checker.currentPosition - 1, checker.currentPosition + 8]
                    }))
                } else {
                    dispatch(getCheckerMove({
                        clickedChecker: clickedChecker,
                        newAllowedMoves: [checker.currentPosition - 1, checker.currentPosition + 1, checker.currentPosition + 8]
                    }))
                }
            } else if (checker.type == 'whiteChecker') {
                if (((checker.currentPosition - 1) % 8) == 0) {
                    dispatch(getCheckerMove({
                        clickedChecker: clickedChecker,
                        newAllowedMoves: [checker.currentPosition + 1, checker.currentPosition - 8]
                    }))
                } else if (checker.currentPosition % 8 == 0) {
                    dispatch(getCheckerMove({
                        clickedChecker: clickedChecker,
                        newAllowedMoves: [checker.currentPosition - 1, checker.currentPosition - 8]
                    }))
                } else {
                    dispatch(getCheckerMove({
                        clickedChecker: clickedChecker,
                        newAllowedMoves: [checker.currentPosition - 1, checker.currentPosition + 1, checker.currentPosition - 8]
                    }))
                }
            }
            setClickedChecker(null)
            console.log("checker is moved to ", checker.currentPosition)
        } else if (clickedChecker.currentPosition == checker.currentPosition) {
            setClickedChecker(null)
        }
    })
    console.log("clickedChecker", clickedChecker)
    return (
        <>
            <SimpleGrid mt={16} columns={8} spacing={0} className='checkersTable' boxShadow='dark-lg' p='6' rounded='md' bg='white'>
                {checkers.map((checker, index) => (
                    <Box key={index} border='1px' borderColor='Gray.900' borderStyle='groove'
                        className={`cell ${clickedChecker == checker ? "pickedCell" : ""}`} onClick={() => handleCheckerMove(checker)} >
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