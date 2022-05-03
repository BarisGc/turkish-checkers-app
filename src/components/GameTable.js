import { useState, useEffect } from 'react'
import { useSelector, useDispatch, } from 'react-redux';
import { updateGameProcess, allowedMovesDefiner } from '../redux/turkishCheckersSlice'
import { SimpleGrid, Box, Icon } from '@chakra-ui/react'

function GameTable() {
    const dispatch = useDispatch();
    //states & Selectors
    let checkers = useSelector((state) => state.turkishCheckers.checkers);
    let table = useSelector((state) => state.turkishCheckers.table);
    let playerTurn = useSelector((state) => state.turkishCheckers.gameProcess.turnOfUser);
    console.log("checkerList", checkers)
    console.log("playerTurn", playerTurn)

    // LocalStates
    const [currentChecker, setCurrentChecker] = useState('');
    const [nextChecker, setNextChecker] = useState('');

    console.log("currentChecker", currentChecker)
    console.log("nextChecker", nextChecker)

    const handleCheckerMove = ((clickedChecker) => {
        console.log("handlecheckermove_içindeki_clickedChecker", clickedChecker)
        // Define Current Checker
        // 1.0
        if (currentChecker == '') {
            setCurrentChecker(clickedChecker)
        }
        // 2.0
        else if (currentChecker == '' && clickedChecker.type == 'dummyChecker') {
            /*  Do Nothing! */
        }
        // 3.0
        else if (currentChecker != '') {
            // 3.0.0
            if (clickedChecker.currentPosition == currentChecker.currentPosition) {
                setCurrentChecker('')
            }
            // 3.0.1 Checker Moves if it is able to, depended on various situations 
            else if (clickedChecker.currentPosition != currentChecker.currentPosition && clickedChecker.type != currentChecker.type) {
                setNextChecker(clickedChecker)
            } else if (clickedChecker.currentPosition != currentChecker.currentPosition && clickedChecker.type == currentChecker.type) {
                setCurrentChecker(clickedChecker)
            }
        }
    })


    useEffect(() => {
        console.log("useeffectif")
        let checkersNewList1 = [];

        //Swap Between Dummy Checker And Moving Checker
        checkers.forEach((checker) => {
            if (checker.currentPosition == currentChecker.currentPosition) {
                console.log("1.if")
                checkersNewList1.push({
                    ...checker,
                    currentPosition: nextChecker.currentPosition,
                    allowedMoves: allowedMovesDefiner(
                        //Checkers List
                        checkers,
                        //updatedChecker
                        {
                            ...currentChecker,
                            currentPosition: nextChecker.currentPosition
                        }),
                })
            } else if (checker.currentPosition == nextChecker.currentPosition) {
                console.log("2.if")

                checkersNewList1.push({
                    ...checker,
                    currentPosition: currentChecker.currentPosition,
                    allowedMoves: 'dummyChecker',
                })
            }
            else {
                checkersNewList1.push({
                    ...checker,
                })
            }
        })

        // Calculate "allowedMoves" for each cheacker
        let checkersNewList2 = []
        checkersNewList1.forEach((checker) => {
            checkersNewList2.push({
                ...checker,
                allowedMoves: allowedMovesDefiner(
                    //Checkers List
                    checkers,
                    //updatedChecker
                    checker)
            })
        })
        console.log("checkersNewList2", checkersNewList2)

        // console.log("checkersNewList", checkersNewList)
        // console.log("allowedMovesDefinerÇalışıyor mu?", allowedMovesDefiner({
        //     ...currentChecker,
        //     currentPosition: nextChecker.currentPosition
        // }))

        dispatch(updateGameProcess(checkersNewList2))
        setCurrentChecker('')
        setNextChecker('')
    }, [nextChecker])

    // Locate Checkers on Table
    // define checkerLocations
    const checkerLocater = (index) => {

        let checkersLocated = []
        let clickedChecker = checkers.find((checker) => (checker.currentPosition == index))
        if (clickedChecker) {
            if (clickedChecker.type == "whiteChecker") {
                checkersLocated.push(<svg key={index} className='checkerIcons whiteIcon'
                    onClick={() => handleCheckerMove(clickedChecker)}
                >
                    <circle cx="50%" cy="50%" r="40%" stroke="black" strokeWidth="1" fill="currentColor" />
                </svg>)
            } else if (clickedChecker.type == "blackChecker") {
                checkersLocated.push(<svg key={index} className='checkerIcons blackIcon'
                    onClick={() => handleCheckerMove(clickedChecker)}
                >
                    <circle cx="50%" cy="50%" r="40%" stroke="black" strokeWidth="1" fill="currentColor" />
                </svg>)
            } else {
                checkersLocated.push(
                    <div key={index + 500} className={`${currentChecker == '' ? 'unClickableDummyIcon' : 'dummyIcon'}`} onClick={() => handleCheckerMove(clickedChecker)}>
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
                        ${index + 1 == currentChecker.currentPosition && currentChecker.type != 'dummyChecker' ? 'pickedCell' : ''}`} >

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