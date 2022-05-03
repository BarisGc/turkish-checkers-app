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
            // Is New Position is rival checker free? If not, move 2 cells once instead of one cell once!
            if (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 1 && checker.type == 'whiteChecker'))) {
                // Move to right 2 cells once to kill whiteChecker
                return [updatedChecker.currentPosition + 2]
            }
            else if (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 8 && checker.type == 'whiteChecker'))) {
                // Move to Forward 2 cells once to kill whiteChecker
                return [updatedChecker.currentPosition + 16]
            }
            else if (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 8 && checker.type == 'blackChecker')) && checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 1 && checker.type == 'blackChecker'))) {
                // Can not move to right and forward, due to blackChecker neighbors
                return []
            }
            else if (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 8 && checker.type == 'blackChecker')) && !checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 1 && checker.type == 'blackChecker'))) {
                // Can not move to forward, due to blackChecker neighbor
                return [updatedChecker.currentPosition + 1]
            }
            else if (!checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 8 && checker.type == 'blackChecker')) && checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 1 && checker.type == 'blackChecker'))) {
                // Can not move to right, due to blackChecker neighbor
                return [updatedChecker.currentPosition + 8]
            }
            else {
                // Move to right or forward 1 cell once
                return [updatedChecker.currentPosition + 1, updatedChecker.currentPosition + 8]
            }
        }
        // Right Edged Checkers Move
        else if (((updatedChecker.currentPosition) % 8) == 0) {
            // Is New Position is rival checker free? If not, move 2 cells once instead of one cell once!
            if (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 1 && checker.type == 'whiteChecker'))) {
                // Move to left 2 cells once to kill whiteChecker
                return [updatedChecker.currentPosition - 2]
            }
            else if (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 8 && checker.type == 'whiteChecker'))) {
                // Move to Forward 2 cells once to kill whiteChecker
                return [updatedChecker.currentPosition + 16]
            }
            else if (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 8 && checker.type == 'blackChecker')) && checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 1 && checker.type == 'blackChecker'))) {
                // Can not move to left and forward, due to blackChecker neighbors
                return []
            }
            else if (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 8 && checker.type == 'blackChecker')) && !checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 1 && checker.type == 'blackChecker'))) {
                // Can not move to forward, due to blackChecker neighbor
                return [updatedChecker.currentPosition - 1]
            }
            else if (!checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 8 && checker.type == 'blackChecker')) && checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 1 && checker.type == 'blackChecker'))) {
                // Can not move to left, due to blackChecker neighbor
                return [updatedChecker.currentPosition + 8]
            }
            else {
                // Move to left or forward 1 cell once
                return [updatedChecker.currentPosition - 1, updatedChecker.currentPosition + 8]
            }
        } // Middle Checkers Move
        else {
            // Is New Position is rival checker free? If not, move 2 cells once instead of one cell once!
            let middleCheckerAllowedMovesArray = [];
            // Move to right 2 cells once to kill whiteCheckers
            if (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 1 && checker.type == 'whiteChecker'))) {
                if ((updatedChecker.currentPosition + 1) % 8 != 0) {
                    middleCheckerAllowedMovesArray.push(updatedChecker.currentPosition + 2)
                }
            } else {
                middleCheckerAllowedMovesArray.push(updatedChecker.currentPosition + 1)
            }
            // Move to left 2 cells once to kill whiteCheckers
            if (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 1 && checker.type == 'whiteChecker'))) {
                if ((updatedChecker.currentPosition - 1) % 8 != 0) {
                    middleCheckerAllowedMovesArray.push(updatedChecker.currentPosition - 2)
                }
            } else {
                middleCheckerAllowedMovesArray.push(updatedChecker.currentPosition - 1)
            }
            // Move to forward one cell or 2 cells once kill whiteCheckers
            if (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 8 && checker.type == 'whiteChecker'))) {

                if ((updatedChecker.currentPosition + 16) % 8 != 0) {
                    middleCheckerAllowedMovesArray.push(updatedChecker.currentPosition + 16)
                } else {
                    middleCheckerAllowedMovesArray.push(updatedChecker.currentPosition + 8)
                }
            } else {
                middleCheckerAllowedMovesArray.push(updatedChecker.currentPosition + 8)
            }


            if (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 8 && checker.type == 'blackChecker')) && checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 1 && checker.currentPosition == updatedChecker.currentPosition + 1 && checker.type == 'blackChecker'))) {
                // Can not move to forward or left or right, due to blackChecker neighbor
                return // Do Nothing
            }

            if (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 8 && checker.type == 'blackChecker')) && checkers.some((checker) => (!checker.currentPosition == updatedChecker.currentPosition - 1 && checker.currentPosition == updatedChecker.currentPosition + 1 && checker.type == 'blackChecker'))) {
                // Can not move to right and forward, due to blackChecker neighbor
                middleCheckerAllowedMovesArray.push(updatedChecker.currentPosition - 1)
            }

            if (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 8 && checker.type == 'blackChecker')) && checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 1 && !checker.currentPosition == updatedChecker.currentPosition + 1 && checker.type == 'blackChecker'))) {
                // Can not move to left and forward, due to blackChecker neighbor
                middleCheckerAllowedMovesArray.push(updatedChecker.currentPosition + 1)
            }

            if (checkers.some((checker) => (!checker.currentPosition == updatedChecker.currentPosition + 8 && checker.type == 'blackChecker')) && checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 1 && checker.currentPosition == updatedChecker.currentPosition + 1 && checker.type == 'blackChecker'))) {
                // Can not move to left or right, due to blackChecker neighbor
                if ((updatedChecker.currentPosition + 16) % 8 != 0) {
                    middleCheckerAllowedMovesArray.push(updatedChecker.currentPosition + 16)
                } else {
                    middleCheckerAllowedMovesArray.push(updatedChecker.currentPosition + 8)
                }
            }

            if (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 8 && checker.type == 'blackChecker')) && checkers.some((checker) => (!checker.currentPosition == updatedChecker.currentPosition - 1 && !checker.currentPosition == updatedChecker.currentPosition + 1 && checker.type == 'blackChecker'))) {
                // Can not move to forward, due to blackChecker neighbor
                middleCheckerAllowedMovesArray.push(updatedChecker.currentPosition + 1, updatedChecker.currentPosition - 1)
            }

            return middleCheckerAllowedMovesArray

        }
    }
    // White Checkers
    if (updatedChecker.type == 'whiteChecker') {
        // Left Edged Checkers Move
        if (((updatedChecker.currentPosition - 1) % 8) == 0) {
            // Is New Position is rival checker free? If not, move 2 cells once instead of one cell once!
            if (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 1 && checker.type == 'blackChecker'))) {
                // Move to right 2 cells once
                return [updatedChecker.currentPosition + 2]
            }
            else if (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 8 && checker.type == 'blackChecker'))) {
                // Move to Forward 2 cells once
                return [updatedChecker.currentPosition - 16]
            }
            else {
                // Move to right or forward 1 cell once
                return [updatedChecker.currentPosition + 1, updatedChecker.currentPosition - 8]
            }
        }
        // Right Edged Checkers Move
        else if (((updatedChecker.currentPosition) % 8) == 0) {
            // Is New Position is rival checker free? If not, move 2 cells once instead of one cell once!
            if (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 1 && checker.type == 'blackChecker'))) {
                // Move to left 2 cells once
                return [updatedChecker.currentPosition - 2]
            }
            else if (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 8 && checker.type == 'blackChecker'))) {
                // Move to Forward 2 cells once
                return [updatedChecker.currentPosition - 16]
            }
            else {
                // Move to left or forward 1 cell once
                return [updatedChecker.currentPosition - 1, updatedChecker.currentPosition - 8]
            }
        } // Middle Checkers Move
        else {
            // Is New Position is rival checker free? If not, move 2 cells once instead of one cell once!
            let middleCheckerAllowedMovesArray = [];
            // Move to right 2 cells once
            if (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition + 1 && checker.type == 'blackChecker'))) {
                if ((updatedChecker.currentPosition + 1) % 8 != 0) {
                    middleCheckerAllowedMovesArray.push(updatedChecker.currentPosition + 2)
                }
            }
            // Move to left 2 cells once
            if (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 1 && checker.type == 'blackChecker'))) {
                if ((updatedChecker.currentPosition - 1) % 8 != 0) {
                    middleCheckerAllowedMovesArray.push(updatedChecker.currentPosition - 2)
                }
            }
            // Move to forward one cell or 2 cells once
            if (checkers.some((checker) => (checker.currentPosition == updatedChecker.currentPosition - 8 && checker.type == 'blackChecker'))) {

                if ((updatedChecker.currentPosition + 16) % 8 != 0) {
                    middleCheckerAllowedMovesArray.push(updatedChecker.currentPosition - 16)
                } else {
                    middleCheckerAllowedMovesArray.push(updatedChecker.currentPosition - 8)
                }
            }

            return middleCheckerAllowedMovesArray

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
        updateGameProcess: (state, action) => {
            state.checkers = action.payload;
            state.gameProcess.turnOfUser = state.gameProcess.turnOfUser == 'player1' ? 'player2' : 'player1'
        },

    },
    extraReducers: {
    }
});

export const { updateGameProcess } = turkishCheckersSlice.actions;
export default turkishCheckersSlice.reducer;