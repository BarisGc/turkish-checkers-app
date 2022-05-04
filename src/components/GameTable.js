import { useState, useEffect } from 'react'
import { useSelector, useDispatch, } from 'react-redux';
import { updateCheckers, updateTurnOfUser, allowedMovesDefiner } from '../redux/turkishCheckersSlice'
import { SimpleGrid, Box } from '@chakra-ui/react'

function GameTable() {
    const dispatch = useDispatch();
    //states & Selectors
    let checkers = useSelector((state) => state.turkishCheckers.checkers);
    let table = useSelector((state) => state.turkishCheckers.table);
    let playerTurn = useSelector((state) => state.turkishCheckers.gameProcess.turnOfUser);
    // console.log("checkerList", checkers)
    console.log("playerTurn", playerTurn)

    // LocalStates
    const [currentChecker, setCurrentChecker] = useState('');
    const [nextChecker, setNextChecker] = useState('');

    console.log("currentChecker", currentChecker)
    console.log("nextChecker", nextChecker)

    const handleCheckerMove = ((clickedChecker) => {
        if (playerTurn == 'player1') {
            // Define Current Checker
            // 1.0
            if (currentChecker == '' && clickedChecker.type == 'blackChecker') {
                alert("This is player1's turn")
            }
            else if (currentChecker == '' && clickedChecker.type == 'whiteChecker') {
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

                // "player1" is forced to kill rival checker
                else if (clickedChecker.currentPosition != currentChecker.currentPosition && clickedChecker.type == 'dummyChecker') {
                    if (checkers.some((checker) =>
                        (checker.currentPosition == currentChecker.currentPosition + 1 && checker.type == 'blackChecker')
                        ||
                        (checker.currentPosition == currentChecker.currentPosition - 1 && checker.type == 'blackChecker')
                        ||
                        (checker.currentPosition == currentChecker.currentPosition - 8 && checker.type == 'blackChecker')
                    )) {
                        if (currentChecker.allowedMoves.includes(clickedChecker.currentPosition)) {
                            setNextChecker(clickedChecker)
                        } else {
                            alert('You Have to Kill Rival Checker')
                        }
                    } else {
                        setNextChecker(clickedChecker)
                    }
                }

                // "player1" is picked another owned checker 
                else if (clickedChecker.currentPosition != currentChecker.currentPosition && clickedChecker.type == 'whiteChecker') {
                    setCurrentChecker(clickedChecker)
                }
            }
        }
        else if (playerTurn == 'player2') {
            // Define Current Checker
            // 1.0
            if (currentChecker == '' && clickedChecker.type == 'whiteChecker') {
                alert("This is player2's turn")
            }
            else if (currentChecker == '' && clickedChecker.type == 'blackChecker') {
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
                else if (clickedChecker.currentPosition != currentChecker.currentPosition && clickedChecker.type == 'dummyChecker') {
                    setNextChecker(clickedChecker)
                } else if (clickedChecker.currentPosition != currentChecker.currentPosition && clickedChecker.type == 'blackChecker') {
                    setCurrentChecker(clickedChecker)
                }
            }
        }
    })


    useEffect(() => {
        let checkersNewList1 = [];
        console.log("next basmadan useeffect geld i mi?")
        //Swap Between Dummy Checker And Moving Checker
        checkers.forEach((checker) => {
            if (checker.currentPosition == currentChecker.currentPosition) {
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
        console.log("checkersNewList1", checkersNewList1)

        // Calculate "allowedMoves" again for each checker
        if (checkersNewList1 && currentChecker && nextChecker) {
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
            console.log("useeffect current ve next checker var ise", checkersNewList2)
            // comparison: nextChecker vs currentChecker.allowedMoves 
            if (currentChecker.allowedMoves.includes(nextChecker.currentPosition)) {
                dispatch(updateCheckers(checkersNewList2))
                dispatch(updateTurnOfUser(playerTurn))
                setCurrentChecker('')
                setNextChecker('')
            } else {
                setCurrentChecker('')
                setNextChecker('')
                alert('Not Able To Move')
            }
        }
        // Calculate "allowedMoves" again for each checker
        else if (checkersNewList1) {
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
            dispatch(updateCheckers(checkersNewList2))
            console.log("useeffect current ve next checker yok ise", checkersNewList2)
        }

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