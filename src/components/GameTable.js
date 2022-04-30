import { useState, useEffect } from 'react'
import { useSelector, useDispatch, } from 'react-redux';
import { updateGameProcess } from '../redux/turkishCheckersSlice'
import { SimpleGrid, Box, Icon } from '@chakra-ui/react'

import { BsCircleFill, BsCircle } from 'react-icons/bs';

function GameTable() {
    const dispatch = useDispatch();
    //states & Selectors
    let checkers = useSelector((state) => state.turkishCheckers.checkers);
    let table = useSelector((state) => state.turkishCheckers.table);


    // LocalStates
    const [currentChecker, setCurrentChecker] = useState('')
    const [currentCheckerUpdatedData, setCurrentCheckerUpdatedData] = useState({
        nextPosition: '',
        newAllowedMoves: '',
    })

    console.log("currentCheckerGameProcess", currentChecker)
    console.log("newCheckerDataGameProcess", currentCheckerUpdatedData)


    const handleCheckerMove = ((newChecker, clickedCellNumber) => {

        if (currentChecker == '') {
            setCurrentChecker(newChecker)
        } else if (currentChecker.type == newChecker.type) {
            setCurrentChecker(newChecker)
        }
        else if ((currentChecker.currentPosition != newChecker.currentPosition)) {

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
            } else {
                setCurrentCheckerUpdatedData(({
                    nextPosition: clickedCellNumber,
                    newAllowedMoves: []
                }))
            }
        } else if (currentChecker.currentPosition == newChecker.currentPosition) {
            setCurrentChecker('')
        }
    })

    useEffect(() => {
        if (currentCheckerUpdatedData.checker) {
            dispatch(updateGameProcess({
                currentChecker,
                currentCheckerUpdatedData,
            }))

        }
    }, [dispatch, currentCheckerUpdatedData])








    // Locate Checkers on Table
    let checkersLocated = []
    const checkerLocater = (index) => {
        console.log("checkerLocater")
        if (checkers.find((checker) => (checker.currentPosition == index)) != undefined) {
            checkersLocated = []
            let newChecker = (checkers.find((checker) => (checker.currentPosition == index)))
            checkersLocated.push(
                (newChecker.type) == "whiteChecker" ?
                    <svg key={index} className='checkerIcons whiteIcon'
                        onClick={() => handleCheckerMove(newChecker, index)}
                    >
                        <circle cx="50%" cy="50%" r="40%" stroke="black" strokeWidth="1" fill="currentColor" />
                    </svg> : (newChecker.type) == "blackChecker" ?
                        <svg key={index} className='checkerIcons blackIcon'
                            onClick={() => handleCheckerMove(newChecker, index)}
                        >
                            <circle cx="50%" cy="50%" r="40%" stroke="black" strokeWidth="1" fill="currentColor" />
                        </svg> :
                        <div className='dummyIcon' onClick={() => handleCheckerMove({
                            id: index,
                            type: 'blackChecker',
                            imageUrl: '/assets/blackStone_on_whiteArea.png',
                            startingPosition: index,
                            currentPosition: index,
                            allowedMoves: [],
                            isWeak: false,
                            isForcedToKill: false,
                            isRemoved: false,
                            isSuperChecker: false
                        }, index)}>
                            test
                        </div >
                // <Icon as={BsCircle} key={index} className='checkerIcons whiteIcon' /> :
                // <Icon as={BsCircleFill} key={index} className='checkerIcons' />
            )
            return checkersLocated
        }
    }


    console.log("checkerList", checkers)
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