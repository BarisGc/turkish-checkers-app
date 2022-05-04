import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from 'nanoid'


// General Settings & Data
const user1Settings = [{
    color: 'white', // white or black
    isSentOffer: 'no', // newRoundWithLoss, resetRound, resetAllRounds, draw 
    isGotAnyOffer: 'no', // newRoundWithLoss, resetRound, resetAllRounds, draw 
}];

const user2Settings = [{
    color: 'black', // white or black
    isSentOffer: 'no', // newRoundWithLoss, resetRound, resetAllRounds, draw 
    isGotAnyOffer: 'no', // newRoundWithLoss, resetRound, resetAllRounds, draw 
}];

const gameSettings = [{
    gameStatus: 'Playing', // newGame or Playing or Completed
    player1Color: 'white',
    player2Color: 'black',
    currentRount: 0,
    maxRount: 5,
    playersScore: {
        player1: 0,
        player2: 0,
    }
}];
const gameProcess = {
    turnOfUser: 'player1', // player1 or player2
    checker: {
        isPicked: false,
        data: [],
        previousPosition: 0,
        currentPosition: 0,
        newAllowedMoves: [],
    }
};

// {
//     id: counter,
//     type: 'blackChecker',
//     imageUrl: '/assets/blackStone_on_whiteArea.png',
//     currentPosition: counter,
//     allowedMoves: [],
//     isWeak: false,
//     isForcedToKill: false,
//     isRemoved: false,
//     isSuperChecker: false
// }

// Building the Table & Initial Checkers
// Preparing Initial Table
const table = [];
for (let i = 1; i < 9; i++) {
    for (let j = 1; j < 9; j++) {

        if (i % 2 !== 0 && j % 2 !== 0) table.push("white")
        else if (i % 2 !== 0 && j % 2 === 0) table.push("gray")
        else if (i % 2 === 0 && j % 2 !== 0) table.push('gray')
        else if (i % 2 === 0 && j % 2 === 0) table.push('white')
    }
}
// Preparing Initial Checkers
const checkers = [];
let counter = 1;
for (let i = 1; i < 9; i++) {
    for (let j = 1; j < 9; j++) {
        if ((counter > 8 && counter < 25)) {
            if (i % 2 !== 0 && j % 2 !== 0) checkers.push(
                {
                    id: counter,
                    type: 'blackChecker',
                    currentPosition: counter,
                    allowedMoves: [],
                    isWeak: false,
                    isForcedToKill: false,
                    isRemoved: false,
                    isSuperChecker: false
                })
            else if (i % 2 !== 0 && j % 2 === 0) checkers.push(
                {
                    id: counter,
                    type: 'blackChecker',
                    currentPosition: counter,
                    allowedMoves: [],
                    isWeak: false,
                    isForcedToKill: false,
                    isRemoved: false,
                    isSuperChecker: false
                }
            )
            else if (i % 2 === 0 && j % 2 !== 0) checkers.push({
                id: counter,
                type: 'blackChecker',
                currentPosition: counter,
                allowedMoves: [],
                isWeak: false,
                isForcedToKill: false,
                isRemoved: false,
                isSuperChecker: false
            })
            else if (i % 2 === 0 && j % 2 === 0) checkers.push({
                id: counter,
                type: 'blackChecker',
                currentPosition: counter,
                allowedMoves: [],
                isWeak: false,
                isForcedToKill: false,
                isRemoved: false,
                isSuperChecker: false
            })
        } else if ((counter > 40 && counter < 57)) {

            if (i % 2 !== 0 && j % 2 !== 0) checkers.push(
                {
                    id: counter,
                    type: 'whiteChecker',
                    currentPosition: counter,
                    allowedMoves: [],
                    isWeak: false,
                    isForcedToKill: false,
                    isRemoved: false,
                    isSuperChecker: false
                }
            )
            else if (i % 2 !== 0 && j % 2 === 0) checkers.push(
                {
                    id: counter,
                    type: 'whiteChecker',
                    currentPosition: counter,
                    allowedMoves: [],
                    isWeak: false,
                    isForcedToKill: false,
                    isRemoved: false,
                    isSuperChecker: false
                }
            )
            else if (i % 2 === 0 && j % 2 !== 0) checkers.push({
                id: counter,
                type: 'whiteChecker',
                currentPosition: counter,
                allowedMoves: [],
                isWeak: false,
                isForcedToKill: false,
                isRemoved: false,
                isSuperChecker: false
            })
            else if (i % 2 === 0 && j % 2 === 0) checkers.push({
                id: counter,
                type: 'whiteChecker',
                currentPosition: counter,
                allowedMoves: [],
                isWeak: false,
                isForcedToKill: false,
                isRemoved: false,
                isSuperChecker: false
            })
        } else {
            checkers.push({
                id: counter,
                type: 'dummyChecker',
                currentPosition: counter,
                allowedMoves: [],
                isWeak: false,
                isForcedToKill: false,
                isRemoved: false,
                isSuperChecker: false
            })
        }
        counter++;
    }
}
// Preparing Initial "AllowedMoves" of Checkers
export let allowedMovesDefiner = (checkers, updatedChecker) => {
    // Black Checkers
    if (updatedChecker.type == 'blackChecker') {
        // Left Edged Checkers Move
        if (((updatedChecker.currentPosition - 1) % 8) == 0) {
            // Force left edged blackCheckers to kill whiteCheckers
            let leftEdgedCheckersAllowedArray = [];
            if
                (
                (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 1 && checker.type == 'whiteChecker'))
                    &&
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 2 && checker.type == 'dummyChecker'))
                )
                ||
                (
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 8 && checker.type == 'whiteChecker'))
                    &&
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 16 && checker.type == 'dummyChecker'))
                    &&
                    (updatedChecker.currentPosition + 16) < 65
                )
            ) {
                if
                    // Move to right 2 cells once to kill whiteCheckers
                    (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 1 && checker.type == 'whiteChecker'))
                    &&
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 2 && checker.type == 'dummyChecker'))) {
                    if ((updatedChecker.currentPosition - 1) % 8 != 0) {
                        leftEdgedCheckersAllowedArray.push(updatedChecker.currentPosition + 2)
                    }
                }
                if
                    // Move to forward 2 cells once kill whiteCheckers
                    (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 8 && checker.type == 'whiteChecker'))
                    &&
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 16 && checker.type == 'dummyChecker'))
                    &&
                    (updatedChecker.currentPosition + 16) < 65) {
                    leftEdgedCheckersAllowedArray.push(updatedChecker.currentPosition + 16)
                }
            }
            // Move to free cells if the checker is not forced to kill rival checker
            else {
                // Move to right 1 cell once if the cell is free
                if
                    (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 1 && checker.type == 'dummyChecker'))) {
                    leftEdgedCheckersAllowedArray.push(updatedChecker.currentPosition + 1)
                }
                // Move to forward 1 cell once if the cell is free
                if
                    (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 8 && checker.type == 'dummyChecker'))) {
                    leftEdgedCheckersAllowedArray.push(updatedChecker.currentPosition + 8)
                }
            }
            return leftEdgedCheckersAllowedArray
        }
        // Right Edged Checkers Move
        else if (((updatedChecker.currentPosition) % 8) == 0) {
            // Force right edged blackCheckers to kill whiteCheckers
            let rightEdgedCheckersAllowedArray = [];
            if
                (
                (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 1 && checker.type == 'whiteChecker'))
                    &&
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 2 && checker.type == 'dummyChecker'))
                )
                ||
                (
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 8 && checker.type == 'whiteChecker'))
                    &&
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 16 && checker.type == 'dummyChecker'))
                    &&
                    (updatedChecker.currentPosition + 16) < 65
                )
            ) {
                if
                    // Move to left 2 cells once to kill whiteCheckers
                    (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 1 && checker.type == 'whiteChecker'))
                    &&
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 2 && checker.type == 'dummyChecker'))) {
                    if ((updatedChecker.currentPosition - 1) % 8 != 0) {
                        rightEdgedCheckersAllowedArray.push(updatedChecker.currentPosition - 2)
                    }
                }
                if
                    // Move to forward 2 cells once kill whiteCheckers
                    (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 8 && checker.type == 'whiteChecker'))
                    &&
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 16 && checker.type == 'dummyChecker'))
                    &&
                    (updatedChecker.currentPosition + 16) < 65) {
                    rightEdgedCheckersAllowedArray.push(updatedChecker.currentPosition + 16)
                }
            }
            // Move to free cells if the checker is not forced to kill rival checker
            else {
                // Move to left 1 cell once if the cell is free
                if
                    (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 1 && checker.type == 'dummyChecker'))) {
                    rightEdgedCheckersAllowedArray.push(updatedChecker.currentPosition - 1)
                }
                // Move to forward 1 cell once if the cell is free
                if
                    (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 8 && checker.type == 'dummyChecker'))) {
                    rightEdgedCheckersAllowedArray.push(updatedChecker.currentPosition + 8)
                }
            }
            return rightEdgedCheckersAllowedArray
        }
        // Middle Checkers Move
        else {
            // Force middle blackCheckers to kill whiteCheckers
            let middleCheckersAllowedArray = [];
            if
                (
                (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 1 && checker.type == 'whiteChecker'))
                    &&
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 2 && checker.type == 'dummyChecker'))
                )
                ||
                (
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 8 && checker.type == 'whiteChecker'))
                    &&
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 16 && checker.type == 'dummyChecker'))
                    &&
                    (updatedChecker.currentPosition + 16) < 65
                )
                ||
                (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 1 && checker.type == 'whiteChecker'))
                    &&
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 2 && checker.type == 'dummyChecker'))
                )
            ) {
                if
                    // Move to left 2 cells once to kill whiteCheckers
                    (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 1 && checker.type == 'whiteChecker'))
                    &&
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 2 && checker.type == 'dummyChecker'))) {
                    if ((updatedChecker.currentPosition - 1) % 8 != 0) {
                        middleCheckersAllowedArray.push(updatedChecker.currentPosition - 2)
                    }
                }
                if
                    // Move to right 2 cells once to kill whiteCheckers
                    (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 1 && checker.type == 'whiteChecker'))
                    &&
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 2 && checker.type == 'dummyChecker'))) {
                    if ((updatedChecker.currentPosition + 1) % 8 != 0) {
                        middleCheckersAllowedArray.push(updatedChecker.currentPosition + 2)
                    }
                }
                if
                    // Move to forward 2 cells once kill whiteCheckers
                    (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 8 && checker.type == 'whiteChecker'))
                    &&
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 16 && checker.type == 'dummyChecker'))
                    &&
                    (updatedChecker.currentPosition + 16) < 65) {
                    middleCheckersAllowedArray.push(updatedChecker.currentPosition + 16)
                }
            }
            // Move to free cells if the checker is not forced to kill rival checker
            else {
                // Move to left 1 cell once if the cell is free
                if
                    (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 1 && checker.type == 'dummyChecker'))) {
                    middleCheckersAllowedArray.push(updatedChecker.currentPosition - 1)
                }
                // Move to right 1 cell once if the cell is free
                if
                    (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 1 && checker.type == 'dummyChecker'))) {
                    middleCheckersAllowedArray.push(updatedChecker.currentPosition + 1)
                }
                // Move to forward 1 cell once if the cell is free
                if
                    (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 8 && checker.type == 'dummyChecker'))) {
                    middleCheckersAllowedArray.push(updatedChecker.currentPosition + 8)
                }
            }
            return middleCheckersAllowedArray
        }
    }
    // White Checkers
    if (updatedChecker.type == 'whiteChecker') {
        // Left Edged Checkers Move
        if (((updatedChecker.currentPosition - 1) % 8) == 0) {
            // Force left edged whiteCheckers to kill blackCheckers
            let leftEdgedCheckersAllowedArray = [];
            if
                (
                (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 1 && checker.type == 'blackChecker'))
                    &&
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 2 && checker.type == 'dummyChecker'))
                )
                ||
                (
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 8 && checker.type == 'blackChecker'))
                    &&
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 16 && checker.type == 'dummyChecker'))
                    &&
                    (updatedChecker.currentPosition - 16) > 0
                )
            ) {
                if
                    // Move to right 2 cells once to kill blackCheckers
                    (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 1 && checker.type == 'blackChecker'))
                    &&
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 2 && checker.type == 'dummyChecker'))) {
                    if ((updatedChecker.currentPosition - 1) % 8 != 0) {
                        leftEdgedCheckersAllowedArray.push(updatedChecker.currentPosition + 2)
                    }
                }
                if
                    // Move to forward 2 cells once kill blackCheckers
                    (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 8 && checker.type == 'blackChecker'))
                    &&
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 16 && checker.type == 'dummyChecker'))
                    &&
                    (updatedChecker.currentPosition - 16) > 0) {
                    leftEdgedCheckersAllowedArray.push(updatedChecker.currentPosition - 16)
                }
            }
            // Move to free cells if the checker is not forced to kill rival checker
            else {
                // Move to right 1 cell once if the cell is free
                if
                    (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 1 && checker.type == 'dummyChecker'))) {
                    leftEdgedCheckersAllowedArray.push(updatedChecker.currentPosition + 1)
                }
                // Move to forward 1 cell once if the cell is free
                if
                    (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 8 && checker.type == 'dummyChecker'))) {
                    leftEdgedCheckersAllowedArray.push(updatedChecker.currentPosition - 8)
                }
            }
            return leftEdgedCheckersAllowedArray
        }
        // Right Edged Checkers Move
        else if (((updatedChecker.currentPosition) % 8) == 0) {
            // Force right edged whiteCheckers to kill blackCheckers
            let rightEdgedCheckersAllowedArray = [];
            if
                (
                (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 1 && checker.type == 'blackChecker'))
                    &&
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 2 && checker.type == 'dummyChecker'))
                )
                ||
                (
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 8 && checker.type == 'blackChecker'))
                    &&
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 16 && checker.type == 'dummyChecker'))
                    &&
                    (updatedChecker.currentPosition - 16) > 0
                )
            ) {
                if
                    // Move to left 2 cells once to kill blackCheckers
                    (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 1 && checker.type == 'blackChecker'))
                    &&
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 2 && checker.type == 'dummyChecker'))) {
                    if ((updatedChecker.currentPosition - 1) % 8 != 0) {
                        rightEdgedCheckersAllowedArray.push(updatedChecker.currentPosition - 2)
                    }
                }
                if
                    // Move to forward 2 cells once kill blackCheckers
                    (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 8 && checker.type == 'blackChecker'))
                    &&
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 16 && checker.type == 'dummyChecker'))
                    &&
                    (updatedChecker.currentPosition - 16) > 0) {
                    rightEdgedCheckersAllowedArray.push(updatedChecker.currentPosition - 16)
                }
            }
            // Move to free cells if the checker is not forced to kill rival checker
            else {
                // Move to left 1 cell once if the cell is free
                if
                    (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 1 && checker.type == 'dummyChecker'))) {
                    rightEdgedCheckersAllowedArray.push(updatedChecker.currentPosition - 1)
                }
                // Move to forward 1 cell once if the cell is free
                if
                    (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 8 && checker.type == 'dummyChecker'))) {
                    rightEdgedCheckersAllowedArray.push(updatedChecker.currentPosition - 8)
                }
            }
            return rightEdgedCheckersAllowedArray
        }
        // Middle Checkers Move
        else {
            // Force middle whiteCheckers to kill blackCheckers
            let middleCheckersAllowedArray = [];
            if
                (
                (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 1 && checker.type == 'blackChecker'))
                    &&
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 2 && checker.type == 'dummyChecker'))
                )
                ||
                (
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 8 && checker.type == 'blackChecker'))
                    &&
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 16 && checker.type == 'dummyChecker'))
                    &&
                    (updatedChecker.currentPosition - 16) > 0
                )
                ||
                (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 1 && checker.type == 'blackChecker'))
                    &&
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 2 && checker.type == 'dummyChecker'))
                )
            ) {
                if
                    // Move to left 2 cells once to kill whiteCheckers
                    (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 1 && checker.type == 'blackChecker'))
                    &&
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 2 && checker.type == 'dummyChecker'))) {
                    if ((updatedChecker.currentPosition - 1) % 8 != 0) {
                        middleCheckersAllowedArray.push(updatedChecker.currentPosition - 2)
                    }
                }
                if
                    // Move to right 2 cells once to kill whiteCheckers
                    (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 1 && checker.type == 'blackChecker'))
                    &&
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 2 && checker.type == 'dummyChecker'))) {
                    if ((updatedChecker.currentPosition + 1) % 8 != 0) {
                        middleCheckersAllowedArray.push(updatedChecker.currentPosition + 2)
                    }
                }
                if
                    // Move to forward 2 cells once kill whiteCheckers
                    (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 8 && checker.type == 'blackChecker'))
                    &&
                    checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 16 && checker.type == 'dummyChecker'))
                    &&
                    (updatedChecker.currentPosition - 16) > 0) {
                    middleCheckersAllowedArray.push(updatedChecker.currentPosition - 16)
                }
            }
            // Move to free cells if the checker is not forced to kill rival checker
            else {
                // Move to left 1 cell once if the cell is free
                if
                    (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 1 && checker.type == 'dummyChecker'))) {
                    middleCheckersAllowedArray.push(updatedChecker.currentPosition - 1)
                }
                // Move to right 1 cell once if the cell is free
                if
                    (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 1 && checker.type == 'dummyChecker'))) {
                    middleCheckersAllowedArray.push(updatedChecker.currentPosition + 1)
                }
                // Move to forward 1 cell once if the cell is free
                if
                    (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 8 && checker.type == 'dummyChecker'))) {
                    middleCheckersAllowedArray.push(updatedChecker.currentPosition - 8)
                }
            }
            return middleCheckersAllowedArray
        }
    }
    // Dummy Checkers
    else {
        return ['dummyChecker']
    }
}

for (let checker of checkers) {
    checker.allowedMoves = allowedMovesDefiner(checkers, checker)
}
// turkishCheckersSlice
export const turkishCheckersSlice = createSlice({
    name: 'turkishCheckers',
    initialState: {
        checkers: checkers,
        table: table,
        user1Settings: user1Settings,
        user2Settings: user2Settings,
        gameSettings: gameSettings,
        gameProcess: gameProcess,
    },
    reducers: {
        updateCheckers: (state, action) => {
            state.checkers = action.payload;
        },
        updateTurnOfUser: (state, action) => {
            state.gameProcess.turnOfUser = state.gameProcess.turnOfUser == 'player1' ? 'player2' : 'player1'
        },

    },
    extraReducers: {
    }
});

export const { updateCheckers, updateTurnOfUser } = turkishCheckersSlice.actions;
export default turkishCheckersSlice.reducer;