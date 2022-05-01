import { useState, useEffect } from 'react'
import { useSelector, useDispatch, } from 'react-redux';
import { updateGameProcess, allowedMovesDefiner } from '../redux/turkishCheckersSlice'
import { SimpleGrid, Box, Icon } from '@chakra-ui/react'

function GameTable() {
    const dispatch = useDispatch();
    //states & Selectors
    let checkers = useSelector((state) => state.turkishCheckers.checkers);
    let table = useSelector((state) => state.turkishCheckers.table);
    console.log("checkerList", checkers)

    // LocalStates
    const [currentChecker, setCurrentChecker] = useState('')
    const [currentCheckerUpdatedData, setCurrentCheckerUpdatedData] = useState({
        nextPosition: '',
        newAllowedMoves: '',
    })

    console.log("currentChecker", currentChecker)
    console.log("currentCheckerUpdatedData", currentCheckerUpdatedData)

    const handleCheckerMove = ((newChecker, clickedCellNumber) => {
        console.log("handlecheckermovenewchecker", newChecker)
        if (currentChecker == '') {
            setCurrentChecker(newChecker)
        } else if (currentChecker.type == newChecker.type) {
            setCurrentChecker(newChecker)
        } else if ((currentChecker.currentPosition != newChecker.currentPosition)) {
            //Comparison, the newChecker if it is white or black or dummy & Define "newAllowedMoves"
            if (newChecker.type == 'blackChecker') {
                if (((newChecker.currentPosition - 1) % 8) == 0) {
                    setCurrentCheckerUpdatedData({
                        nextPosition: clickedCellNumber,
                        newAllowedMoves: [newChecker.currentPosition + 1, newChecker.currentPosition + 8]
                    })
                } else if (newChecker.currentPosition % 8 == 0) {
                    setCurrentCheckerUpdatedData(({
                        nextPosition: clickedCellNumber,
                        newAllowedMoves: [newChecker.currentPosition - 1, newChecker.currentPosition + 8]
                    }))
                } else {
                    setCurrentCheckerUpdatedData(({
                        nextPosition: clickedCellNumber,
                        newAllowedMoves: [newChecker.currentPosition - 1, newChecker.currentPosition + 1, newChecker.currentPosition + 8]
                    }))
                }
            } else if (newChecker.type == 'whiteChecker') {
                if (((newChecker.currentPosition - 1) % 8) == 0) {
                    setCurrentCheckerUpdatedData(({
                        nextPosition: clickedCellNumber,
                        newAllowedMoves: [newChecker.currentPosition + 1, newChecker.currentPosition - 8]
                    }))
                } else if (newChecker.currentPosition % 8 == 0) {
                    setCurrentCheckerUpdatedData(({
                        nextPosition: clickedCellNumber,
                        newAllowedMoves: [newChecker.currentPosition - 1, newChecker.currentPosition - 8]
                    }))
                } else {
                    setCurrentCheckerUpdatedData(({
                        nextPosition: clickedCellNumber,
                        newAllowedMoves: [newChecker.currentPosition - 1, newChecker.currentPosition + 1, newChecker.currentPosition - 8]
                    }))
                }
            }
            else if (newChecker.type == 'dummyChecker' && currentChecker.type == 'blackChecker') {
                setCurrentCheckerUpdatedData(({
                    nextPosition: clickedCellNumber,
                    newAllowedMoves: allowedMovesDefiner({ ...newChecker, type: "blackChecker" })
                }))
            } else if (newChecker.type == 'dummyChecker' && currentChecker.type == 'whiteChecker') {
                setCurrentCheckerUpdatedData(({
                    nextPosition: clickedCellNumber,
                    newAllowedMoves: allowedMovesDefiner({ ...newChecker, type: "whiteChecker" })
                }))
            }
        } else if (currentChecker.currentPosition == newChecker.currentPosition) {
            setCurrentChecker('')
        }
    })


    useEffect(() => {
        if (currentChecker.currentPosition) {
            let updatedsCheckers = [];
            checkers.forEach((checker) => {
                if (checker.currentPosition == currentChecker.currentPosition) {
                    updatedsCheckers.push({
                        ...checker,
                        currentPosition: currentCheckerUpdatedData.nextPosition,
                        newAllowedMoves: currentCheckerUpdatedData.newAllowedMoves,
                    })
                } else {
                    updatedsCheckers.push(checker)
                }
            })

            // console.log("updatedsCheckers", updatedsCheckers)
            let newCell = checkers.find((checker) => (checker.currentPosition == currentCheckerUpdatedData.nextPosition))
            allowedMovesDefiner({
                ...currentChecker,
                currentPosition: newCell.currentPosition
            })
            dispatch(updateGameProcess(updatedsCheckers))
            setCurrentChecker('')
            console.log("useeffect çalıştı mı?")
        }
    }, [dispatch, currentCheckerUpdatedData])

    // Locate Checkers on Table
    // define checkerLocations
    const checkerLocater = (index) => {

        let checkersLocated = []
        let newChecker = checkers.find((checker) => (checker.currentPosition == index))

        if (newChecker) {
            if (newChecker.type == "whiteChecker") {
                checkersLocated.push(<svg key={index} className='checkerIcons whiteIcon'
                    onClick={() => handleCheckerMove(newChecker, index)}
                >
                    <circle cx="50%" cy="50%" r="40%" stroke="black" strokeWidth="1" fill="currentColor" />
                </svg>)
            } else if (newChecker.type == "blackChecker") {
                checkersLocated.push(<svg key={index} className='checkerIcons blackIcon'
                    onClick={() => handleCheckerMove(newChecker, index)}
                >
                    <circle cx="50%" cy="50%" r="40%" stroke="black" strokeWidth="1" fill="currentColor" />
                </svg>)
            } else if (newChecker.type == 'dummyChecker') {
                checkersLocated.push(
                    <div key={index} className='dummyIcon' onClick={() => handleCheckerMove(newChecker, index)}>
                        test
                    </div >)
            }
            // <Icon as={BsCircle} key={index} className='checkerIcons whiteIcon' /> :
            // <Icon as={BsCircleFill} key={index} className='checkerIcons' />
            return checkersLocated
        }
    }

    return (
        <>
            <SimpleGrid mt={16} columns={8} spacing={0} className='checkersTable' boxShadow='dark-lg' p='6' rounded='md' bg='white'>
                {table.map((area, index) => (
                    <Box key={index} border='1px' borderColor='Gray.900' borderStyle='groove'
                        className={`cell ${area == 'gray' ? 'backgroundGray' : 'backgroundWhite'} 
                        ${index + 1 == currentChecker.currentPosition ? 'pickedCell' : ''}`} >

                        {checkerLocater(index + 1)}

                        <div href="#" className="checkerNumber" >
                            {index + 1}
                        </div>

                    </Box>
                ))}
            </SimpleGrid>
        </>
    )
}

export default GameTable