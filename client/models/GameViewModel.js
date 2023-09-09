import { SafeAreaView, Button, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import React, { useState } from 'react';

import { PlayerGameView } from './PlayerViewModel';
import GameModel from './GameModel';

var gModel;

export const GameViewModel = ({rS, user, args, gameObj, gameStarted, setGameStart, playerView, setPlayerView}) => {

    const roomSize = rS;
    const gameState = gameObj;
    let [playerDisplayNames, setPlayerDisplayNames] = useState([]);
    let [playerChips, setPlayerChips] = useState([]);

    let TableView;
    let PlayerBorders = [];
    let PlayersDisplayName;
    let PlayersDisplayChips;
    let inGamePlayerPositions = [];
    let BigBlindSelection = [];
    let WinnerSelection = [];
    let test;

    let [inGameMenuActive, setInGameMenuActive] = useState(false);
    let [roundTransition, setRoundTransition] = useState(false);
    let [selectedWinner, setSelectedWinner] = useState(0);
    let [winnerChosen, setWinnerChosen] = useState(false);
    let [promptedForNextRound, setPromptedForNextRound] = useState(false);

    let [activeBBSelect, setActiveBBSelect] = useState(0);
    let [toggleBBSelect, setToggleBBSelect] = useState(false)
    let [activeSBSelect, setActiveSBSelect] = useState();
    let [firstToAct, setFirstToAct] = useState();

    let [activePot, setActivePot] = useState();
    let [activeRound, setActiveRound] = useState();
    let [roundNumber, setRoundNumber] = useState(0)
    let [gameTurn, setGameTurn] = useState();
    let [rTransition, setRTransition] = useState(false);

    const initGameStart = () => {
        user.socket.emit('initGameStarted', activeBBSelect, activeSBSelect);
        setToggleBBSelect(false)


    }

    const WinnerSubmitted = () => {
        user.socket.emit('WinnerHasBeenChosen', selectedWinner)
        setWinnerChosen(true)
    }

    const userSettingBigBlind = (turn) => {
        setActiveBBSelect(turn);
        if (turn === 1) {
            setActiveSBSelect(2)
            setFirstToAct(3)
        } else if (turn === 2) {
            setActiveSBSelect(4)
            setFirstToAct(1)
        } else if (turn === 3) {
            setActiveSBSelect(1)
            setFirstToAct(4)
        } else if (turn === 4) {
            setActiveSBSelect(3)
            setFirstToAct(2)
        }
    }

    user.socket.on('sendingBackGameStart', (info) => {
        gModel = new GameModel(gameState.desiredRoomSize, 0, 0, 0, 0, [], info, 0, 0, Number(gameState.ante), [], setActiveRound, setRoundTransition, gameState.pNickNames, gameState.pChips)
        
        setGameStart(true)
        setPlayerView(false)

        gModel.initRound(gameState)
        setGameTurn(gModel.currentTurn);
        setActivePot(gModel.pot);
        setActiveRound(gModel.currentRoundName)

        user.playerGameObj.currentGameTurn = gModel.currentTurn;

    })

    user.socket.on('playerSubmitsBet', (turn, betAmount, pBettingChips) => {
        user.playerGameObj.displayBet();

        gModel.pot += betAmount;
        activePot += betAmount;
        setActivePot(activePot);

        gModel.setNextTurn(turn, 'bet');
        setGameTurn(gModel.currentTurn);

        user.playerGameObj.currentGameTurn = gModel.currentTurn;
        user.playerGameObj.betToCall = betAmount;

        gModel.lastBet = betAmount;
        gModel.currentBettor = turn;

        gModel.setPlayerBorders(gameState, pBettingChips, turn);
        
    })

    user.socket.on('playerFolds', (turn) => {
        gModel.addPlayer2FoldedArr(turn);

        gModel.setNextTurn(turn, 'fold');
        setGameTurn(gModel.currentTurn);

        gModel.handleFold(turn);

        user.playerGameObj.currentGameTurn = gModel.currentTurn;
    })

    user.socket.on('playerChecks', (turn) => {
        gModel.setNextTurn(turn, 'check');
        setGameTurn(gModel.currentTurn);

        gModel.setNextTurn(turn, 'check');
        setGameTurn(gModel.currentTurn);

        user.playerGameObj.currentGameTurn = gModel.currentTurn;

    })

    user.socket.on('playerCallsBet', (turn, callAmount, playerChips) => {
        // user.playerGameObj.displayCall(gModel.lastBet);

        gModel.pot += callAmount
        activePot += callAmount;
        setActivePot(activePot);

        gModel.setNextTurn(turn, 'call');
        setGameTurn(gModel.currentTurn);

        gModel.setPlayerBorders(gameState, playerChips, turn)

        user.playerGameObj.currentGameTurn = gModel.currentTurn; 

    })

    user.socket.on('sendingBackWinnerOfRound', (winner) => {
        if (winner === user.playerGameObj.turn) {
            user.playerGameObj.winnerOfRound(gModel.pot);
        }
    })

    user.socket.on('sendingBackInitNextRound', () => {
        setWinnerChosen(false);
        setRoundTransition(false);
        setPlayerView(false);

        gModel.startNextRound();

        setActiveBBSelect(gModel.bigBlind)

        gModel.initRound();

        setGameTurn(gModel.currentTurn);

        setActivePot(gModel.pot)

        setActiveRound(gModel.currentRoundName);

        user.playerGameObj.currentGameTurn = gModel.currentTurn;
    })

    ////// Player Positions Based On Room Size //////
    if (rS === 2) {
        let p1 = {
            pTop: 652,
            pLeft: 38
        }
        let p2 = {
            pTop: 135,
            pLeft: 38
        }

        inGamePlayerPositions.push(p1, p2)
    } else if (rS === 3) {
        let p1 = {
            pTop: 652,
            pLeft: 38
        }
        let p2 = {
            pTop: 390,
            pLeft: 140
        }
        let p3 = {
            pTop: 390,
            pLeft: -60
        }

        inGamePlayerPositions.push(p1, p2, p3)
    } else if (rS === 4) {
        let p1 = {
            pTop: 652,
            pLeft: 38
        }
        let p2 = {
            pTop: 390,
            pLeft: -60
        }
        let p3 = {
            pTop: 135,
            pLeft: 38
        }
        let p4 = {
            pTop: 390,
            pLeft: -60
        }

        inGamePlayerPositions.push(p1, p2, p3, p4)
    } else if (rS === 5) {

        let p1 = {
            pTop: 652,
            pLeft: 38
        }

        let p2 = {
            pTop: 470,
            pLeft: -60
        }

        let p3 = {
            pTop: 270,
            pLeft: -60
        }

        let p4 = {
            pTop: 270,
            pLeft: 140
        }

        let p5 = {
            pTop: 470,
            pLeft: 140
        }


        inGamePlayerPositions.push(p1, p2, p3, p4, p5)
    } else if (rS === 6) {

        let p1 = {
            pTop: 652,
            pLeft: 38
        }

        let p2 = {
            pTop: 500,
            pLeft: -60
        }

        let p3 = {
            pTop: 300,
            pLeft: -60
        }

        let p4 = {
            pTop: 135,
            pLeft: 38
        }

        let p5 = {
            pTop: 300,
            pLeft: 140
        }

        let p6 = {
            pTop: 500,
            pLeft: 140
        }

        inGamePlayerPositions.push(p1, p2, p3, p4, p5, p6)
    } else if (rS === 7) {

        let p1 = {
            pTop: 652,
            pLeft: 38
        }

        let p2 = {
            pTop: 500,
            pLeft: -60
        }

        let p3 = {
            pTop: 350,
            pLeft: -60
        }

        let p4 = {
            pTop: 170,
            pLeft: -50
        }

        let p5 = {
            pTop: 170,
            pLeft: 130
        }

        let p6 = {
            pTop: 350,
            pLeft: 140
        }

        let p7 = {
            pTop: 500,
            pLeft: 140
        }

        inGamePlayerPositions.push(p1, p2, p3, p4, p5, p6, p7)
    } else if (rS === 8) {
        
        let p1 = {
            pTop: 652,
            pLeft: 38
        }

        let p2 = {
            pTop: 550,
            pLeft: -60
        }

        let p3 = {
            pTop: 400,
            pLeft: -60
        }

        let p4 = {
            pTop: 250,
            pLeft: -60
        }

        let p5 = {
            pTop: 135,
            pLeft: 38        
        }

        let p6 = {
            pTop: 250,
            pLeft: 140
        }

        let p7 = {
            pTop: 400,
            pLeft: 140
        }

        let p8 = {
            pTop: 550,
            pLeft: 140
        }

        inGamePlayerPositions.push(p1, p2, p3, p4, p5, p6, p7, p8)

    } else if (rS === 9) {
        
        let p1 = {
            pTop: 652,
            pLeft: 38
        }

        let p2 = {
            pTop: 550,
            pLeft: -60
        }

        let p3 = {
            pTop: 420,
            pLeft: -60
        }

        let p4 = {
            pTop: 290,
            pLeft: -60
        }

        let p5 = {
            pTop: 155,
            pLeft: -50
        }

        let p6 = {
            pTop: 155,
            pLeft: 130
        }

        let p7 = {
            pTop: 290,
            pLeft: 140
        }

        let p8 = {
            pTop: 420,
            pLeft: 140
        }

        let p9 = {
            pTop: 550,
            pLeft: 140
        }

        inGamePlayerPositions.push(p1, p2, p3, p4, p5, p6, p7, p8, p9)

    }

    const PokerTable = (
        <View style={{borderWidth: 4, borderRadius: '70%', borderColor: 'black', width: 175, height: 500, backgroundColor:'papayawhip', alignSelf: 'center', justifyContent: 'center'}}>

        </View>
    )

    const GameCode = (
        <Text style={{fontSize: 25, textAlign: 'center', position: 'absolute', top: 70}}>Room Code: {gameState.idHolder}</Text>
    )

    const StartButton = (
        <View style={{justifyContent: 'center', position: 'absolute', borderWidth: 2, borderRadius: 5, borderColor: 'black', backgroundColor: 'lightgrey', display: gameStarted === false && user.playerGameObj.turn === 1 ? 'flex' : 'none'}}>
            <Button 
                title='Start'
                color='black'
                onPress={() => setToggleBBSelect(true)}
            />
        </View>
    )

    const InGameMenuButton = (
        <View style={{borderWidth: 2, borderRadius: 5, backgroundColor: 'lightgrey', display: inGameMenuActive === true ? 'none' : 'flex', position: 'absolute', left: -75, top: 50, height: 36, alignItems: 'center'}}>
            <Button 
                title='II'
                color='black'
                onPress={() => setInGameMenuActive(true)}
            />
        </View>
    )

    const InGameMenu = (
        <View style={{borderWidth: 4, borderRadius: 5, backgroundColor: 'papayawhip', width: '50%', height: '95%', left: -100, top: 40, display: inGameMenuActive === true ? 'flex' : 'none', position: 'absolute'}}>
            <View style={{borderWidth: 2, borderRadius: 3, backgroundColor: 'lightgrey', position: 'absolute', top:-2, left: 0, width: '100%'}}>
                <Button 
                    title='x'
                    color='black'
                    onPress={() => setInGameMenuActive(false)}
                />
            </View>
            <Text style={{borderWidth: 2, borderRadius: 3, backgroundColor: 'lightgrey', position: 'absolute', alignSelf: 'center', top: 60}}>Game Code: {gameState.idHolder}</Text>
        </View>
    )
    
    const GameInfo = (
        <View style={{borderWidth: 2, borderRadius: 5, backgroundColor: 'lightgrey', width: '25%', alignSelf: 'center', position: 'absolute', top: '55%', display: gameStarted === true && winnerChosen === false ? 'flex' : 'none'}}>
            <Text style={{textAlign: 'center'}}>Pot: {activePot}</Text>
            <Text style={{textAlign: 'center'}}>{activeRound}</Text>
        </View>
    )

    for (let i = 0; i < roomSize; i++) {
        if (gameState.pNickNames[i] != undefined ) {
            PlayersDisplayName = () => 
            <Text style={{textAlign: 'center'}}>{gameState.pNickNames[i]}</Text>;
            PlayersDisplayChips = () => 
            <Text style={{textAlign: 'center'}}>{gameState.pChips[i]}</Text>
        } else {
            PlayersDisplayName = () => 
            <Text style={{textAlign: 'center'}}>+</Text>;
            PlayersDisplayChips = () => 
            <Text style={{textAlign: 'center'}}></Text>
        }
        PlayerBorders.push(
            <View key={i + 1} style={{borderWidth: 3, borderRadius: 5, backgroundColor: 'lightgrey', position: 'absolute', borderColor: gameTurn === i + 1 ? 'red' : 'black' , minWidth: 100, maxWidth: 120, top: inGamePlayerPositions[i].pTop, left: inGamePlayerPositions[i].pLeft}}>
                <PlayersDisplayName />
                <PlayersDisplayChips />
            </View>
        )
        BigBlindSelection.push(
            <View key={i + 1} style={{borderWidth: 2, borderRadius: 5, backgroundColor: activeBBSelect === i + 1 ? 'lightcoral' : 'lightgrey'}}>
                <Button 
                    title={`p${i + 1}`}
                    color='black'
                    onPress={() => userSettingBigBlind(i + 1)}
                />
            </View>
        )
        WinnerSelection.push(
            <View key={i + 1} style={{borderWidth: 2, borderRadius: 5, backgroundColor: selectedWinner === i + 1 ? 'lightcoral' : 'lightgrey'}}>
                <Button 
                    title={`p${i + 1}`}
                    color='black'
                    onPress={() => setSelectedWinner(i + 1)}
                />
            </View>
        )

    }

    let blindLegend = (
        <View style={{borderWidth: 3, borderRadius: 5, backgroundColor: 'papayawhip', width: '30%', height: '10%', position: 'absolute', top: 240, alignSelf: 'center', display: toggleBBSelect === true ? 'flex' : 'none'}}>
            <Text style={{textAlign: 'center', fontSize: 10}}>If Applicable</Text>
            <View style={{width: '15%', height: '15%', backgroundColor: 'blue', position: 'absolute', left: 15, marginTop: 20, borderWidth: 1, borderRadius: 2}}>

            </View>
            <View style={{width: '15%', height: '15%', backgroundColor: 'lightcoral', position: 'absolute', left: 15, marginTop: 40, borderWidth: 1, borderRadius: 2}}>

            </View>
            <View style={{width: '15%', height: '15%', backgroundColor: 'purple', position: 'absolute', left: 15, marginTop: 60, borderWidth: 1, borderRadius: 2}}>

            </View>
            <Text style={{fontSize: 10, position: 'absolute', marginTop: 20, left: 35}}>= Big Blind</Text>
            <Text style={{fontSize: 10, position: 'absolute', marginTop: 40, left: 35}}>= Small Blind</Text>
            <Text style={{fontSize: 10, position: 'absolute', marginTop: 60, left: 35}}>= 1st To Act</Text>
        </View>
    )

    let beginButton = (
        <View style={{borderWidth: 2, borderRadius: 5, backgroundColor: 'lightgrey', width: '35%', marginTop: 10, alignSelf: 'center'}}>
            <Button 
                title='Begin'
                color='black'
                onPress={() => initGameStart()}
            />
        </View>
    )

    let submitWinnerButton = (
        <View style={{borderWidth: 2, borderRadius: 5, backgroundColor: 'lightgrey', width: '55%', marginTop: 10, alignSelf: 'center'}}>
            <Button 
                title='Submit'
                color='black'
                onPress={() => WinnerSubmitted()}
            />
        </View>
    )

    let nextRoundButton = (
        <View style={{borderWidth: 2, borderRadius: 5, backgroundColor: 'lightgrey', width: '35%', top: '55%', alignSelf: 'center', display: roundTransition === true && winnerChosen === true ? 'flex' : 'none', position: 'absolute'}}>
            <Button 
                title='Next Round'
                color='black'
                onPress={() => user.socket.emit('initNextRound')}
            />
        </View>
    )

    let playerGameView = (
        <View style={{borderWidth: 2, borderRadius: 5, backgroundColor: 'lightgrey', display: gameStarted === true && playerView === true ? 'flex' : 'none', position: 'absolute', top: 300}}>
            <Button 
                title='Game View'
                color='black'
                onPress={() => setPlayerView(false)}
            />
        </View>
    )

    let BigBlindSelectionWindow = (
        <View style={{borderWidth: 4, borderRadius: 5, backgroundColor: 'papayawhip', width: '60%', height: '20%', position: 'absolute', display: toggleBBSelect === true ? 'flex' : 'none'}}>
            <Text style={{fontSize: 20, textAlign: 'center', marginTop: 15, marginBottom: 10}}>Choose The Big Blind</Text>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                {BigBlindSelection}
            </View>
            {beginButton}
        </View>
    )

    let WinnerSelectionWindow = (
        <View style={{borderWidth: 4, borderRadius: 5, backgroundColor: 'papayawhip', width: '60%', height: '20%', position: 'absolute', display: roundTransition === true && winnerChosen === false && user.playerGameObj.turn === 1 ? 'flex' : 'none'}}>
            <Text style={{fontSize: 20, textAlign: 'center', marginTop: 15, marginBottom: 10}}>Choose The Winner</Text>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                {WinnerSelection}
            </View>
            {submitWinnerButton}
        </View>
    )

    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            {PokerTable}
            {/* {TableView} */}
            {GameCode}
            {PlayerBorders}
            {StartButton}
            {BigBlindSelectionWindow}
            {playerGameView}
            {GameInfo}
            {blindLegend}
            {/* {InGameMenuButton} */}
            {InGameMenu}
            {nextRoundButton}
            {WinnerSelectionWindow}
        </View>
    )

}

const styles = StyleSheet.create({
    inputStyle: {
        width: '80%',
        height: 40,
        padding: 10,
        marginVertical: 10,
        backgroundColor: '#DBDBD6'
    },

    bigBlind: {
        borderColor: 'blue'
    },

    smallBlind: {
        borderColor: 'lightcoral'
    },

    firstToAct: {
        borderColor: 'purple'
    }
})

