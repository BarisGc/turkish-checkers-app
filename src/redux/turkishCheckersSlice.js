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
    turnOfUser: 'Player2', // Player1 or Player2
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
export let allowedMovesDefiner = (checker) => {
    if (checker.type == 'blackChecker') {
        if (((checker.currentPosition - 1) % 8) == 0) {
            return [checker.currentPosition + 1, checker.currentPosition + 8]
        } else if (checker.currentPosition % 8 == 0) {
            return [checker.currentPosition - 1, checker.currentPosition + 8]
        } else {
            return [checker.currentPosition - 1, checker.currentPosition + 1, checker.currentPosition + 8]
        }
    } else if (checker.type == 'whiteChecker') {
        if (((checker.currentPosition - 1) % 8) == 0) {
            return [checker.currentPosition + 1, checker.currentPosition - 8]
        } else if (checker.currentPosition % 8 == 0) {
            return [checker.currentPosition - 1, checker.currentPosition - 8]
        } else {
            return [checker.currentPosition - 1, checker.currentPosition + 1, checker.currentPosition - 8]
        }
    } else {
        return ['dummyChecker']
    }
}
for (let checker of checkers) {
    checker.allowedMoves = allowedMovesDefiner(checker)
}

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
        },
    },
    extraReducers: {
    }
});

export const { updateGameProcess } = turkishCheckersSlice.actions;
export default turkishCheckersSlice.reducer;