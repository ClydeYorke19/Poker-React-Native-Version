import { Button, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import React, { useState, useRef } from 'react';
import GameModel from './GameModel';
import settingPlayerPositions from './PlayerPositionsModel';
import { useNavigation } from '@react-navigation/native'

var gModel;

export const GameViewModel = ({rS, user, gameObj, gameStarted, setGameStart, playerView, setPlayerView}) => {

    // Variables //

    const navigation = useNavigation();

    const roomSize = rS;
    const gameState = gameObj;

    let PlayerBorders = [];
    let PlayersDisplayName;
    let PlayersDisplayChips;
    let inGamePlayerPositions = settingPlayerPositions(roomSize);
    let BigBlindSelection = [];
    let WinnerSelection = [];

    let [inGameMenuActive, setInGameMenuActive] = useState(false);
    let [roundTransition, setRoundTransition] = useState(false);
    let [selectedWinner, setSelectedWinner] = useState(0);
    let [winnerChosen, setWinnerChosen] = useState(false);

    let [initLeaveGame, setInitLeaveGame] = useState(false);
    let [initInvitingPlayer, setInitInvitingPlayer] = useState(false);
    let [readyResponse, setReadyResponse] = useState(false);
    let [responseText, setResponseText] = useState('')
    let [responseStatus, setResponseStatus] = useState(0);
    let [restrictionInvitingPlayers, setRestrictionInvitingPlayers] = useState(false);
    let [restrictionReason, setRestrictionReason] = useState('');

    let [activeBBSelect, setActiveBBSelect] = useState(0);
    let [toggleBBSelect, setToggleBBSelect] = useState(false)
    let [activeSBSelect, setActiveSBSelect] = useState();
    let [firstToAct, setFirstToAct] = useState();

    let [activePot, setActivePot] = useState();
    let [activeRound, setActiveRound] = useState();
    let [gameTurn, setGameTurn] = useState();

    let usernameInviting = null;
    let usernameInvitingHolder;

    let usernameRef = useRef();

    //////////////////////////////////////////////////////////////////

    // Functions //

    const initGameStart = () => {
        user.socket.emit('initGameStarted', activeBBSelect, activeSBSelect);
        setToggleBBSelect(false)
    }

    const WinnerSubmitted = () => {
        user.socket.emit('winnerHasBeenChosen', selectedWinner)
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

    const userInivitingPlayerToGame = () => {
        setInGameMenuActive(false)
        if (roomSize > gameState.players.length) {
            setInitInvitingPlayer(true);
        } else {
            setRestrictionReason('The Game Lobby Is Full. You Currently Cannot Invite Other Players.')
            setRestrictionInvitingPlayers(true);
        }
    }

    const userXOutInvitingPlayer = () => {
        if (readyResponse) {
            
            if (responseStatus === 200) {
                setInitInvitingPlayer(false);
                setRestrictionInvitingPlayers(false);
                setInGameMenuActive(true);
            } else if (responseStatus === 400) {
                setReadyResponse(false);
                setInitInvitingPlayer(true);
            }

            usernameRef.current.clear();

        } else {
            setInitInvitingPlayer(false);
            setRestrictionInvitingPlayers(false);
            setInGameMenuActive(true);
        }
    }

    const userLeavesGame = () => {
        user.leaveGame(user.playerGameObj.turn);
        navigation.navigate('Home');
    }

    //////////////////////////////////////////////////////////////////

    // User Socket On's //

    user.socket.on('sendingBackGameStart', (info) => {
        gModel = new GameModel(gameState.desiredRoomSize, 0, 0, 0, 0, [], info, 0, 0, Number(gameState.ante), [], setActiveRound, setRoundTransition, gameState.pNickNames, gameState.pChips)
        
        setGameStart(true)
        setPlayerView(false)

        gModel.initRound(gameState)
        setGameTurn(gModel.currentTurn);
        setActivePot(gModel.pot);
        setActiveRound(gModel.currentRoundName)

        user.playerGameObj.currentGameTurn = gModel.currentTurn;

        if (gModel.bigBlind === user.playerGameObj.turn) {
            gModel.setPlayerBorders(gameState, (user.playerGameObj.chips - gModel.ante), user.playerGameObj.turn);
            user.playerGameObj.displayChipsAnte(gModel.ante, 'bb');
        }

        if (gModel.smallBlind === user.playerGameObj.turn) {
            gModel.setPlayerBorders(gameState, (user.playerGameObj.chips - (gModel.ante / 2)), user.playerGameObj.turn)
            user.playerGameObj.displayChipsAnte(gModel.ante, 'sb')
        }

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

        user.playerGameObj.currentGameTurn = gModel.currentTurn;

    })

    user.socket.on('playerCallsBet', (turn, callAmount, playerChips) => {
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
    
    user.socket.on('inviteToGameConfirmed', () => {
        setResponseText('Invite To Game Sent!');
        setReadyResponse(true);
        setResponseStatus(200);
    })

    user.socket.on('inviteToGameFailed', () => {
        setResponseText('Invite To Game Failed. Please Try Again');
        setReadyResponse(true);
        setResponseStatus(400);
    })

    user.socket.on('playerHasLeftGame', (turn) => {
        gameState.pNickNames[turn - 1] = undefined
    })

    //////////////////////////////////////////////////////////////////

    // In Game Elements //

    const PokerTable = (
        <View style={{borderWidth: 4, borderRadius: '70%', borderColor: 'black', width: 175, height: 500, backgroundColor:'papayawhip', alignSelf: 'center', justifyContent: 'center'}}>

        </View>
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
        <View style={{borderWidth: 3, borderRadius: 5, backgroundColor: 'lightgrey', display: inGameMenuActive === false && playerView === true ? 'flex' : 'none', position: 'absolute', left: -110, top: 50, height: 60, alignItems: 'center', justifyContent: 'center'}}>
            <Button 
                title='>'
                color='black'
                onPress={() => setInGameMenuActive(true)}
            />
        </View>
    )

    const InGameMenu = (
        <View style={{borderWidth: 4, borderRadius: 5, backgroundColor: 'papayawhip', width: '50%', height: '95%', left: -110, top: 50, display: inGameMenuActive === true && initLeaveGame === false ? 'flex' : 'none', position: 'absolute'}}>
            <View style={{borderWidth: 2, borderRadius: 3, backgroundColor: 'lightgrey', position: 'absolute', top:-2, left: 0, width: '100%'}}>
                <Button 
                    title='<'
                    color='black'
                    onPress={() => setInGameMenuActive(false)}
                />
            </View>
            <Text style={{borderWidth: 2, borderRadius: 3, backgroundColor: 'lightgrey', position: 'absolute', alignSelf: 'center', top: 60, marginRight: 10, marginLeft: 10}}>Game Code: {gameState.idHolder}</Text>

            <TouchableOpacity style={{borderWidth: 2, borderRadius: 3, backgroundColor: 'lightgrey', position: 'absolute', top: 150, alignSelf: 'center'}}
                onPress={() => userInivitingPlayerToGame()}
            >
                <Text style={{textAlign: 'center', marginRight: 5, marginLeft: 5, fontSize: 26}}>Invite Players</Text>
            </TouchableOpacity>


            {/* WILL GO AT BOTTOM OF MENU SO LEAVING SPACE FOR OTHER ELEMENTS */}
            <TouchableOpacity style={{borderWidth: 2, borderRadius: 5, backgroundColor: 'lightgrey', alignSelf: 'center', marginTop: 700}}
                onPress={() => setInitLeaveGame(true)}
            >
                <Text style={{textAlign: 'center', marginRight: 5, marginLeft: 5, fontSize: 26}}>Leave Game</Text>
            </TouchableOpacity>
        </View>
    )

    const LeaveGameConfirmation = (
        <View style={{borderWidth: 3, borderRadius: 5, backgroundColor: 'papayawhip', width: '85%', height: '30%', alignSelf: 'center', display: initLeaveGame === true ? 'flex' : 'none', position: 'absolute'}}>
            <Text style={{textAlign: 'center', marginTop: 20, marginBottom: 50, fontSize: 30}}>Are You Sure You Want To Leave The Game?</Text>
            <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 20}}>
                <TouchableOpacity style={{borderWidth: 3, borderRadius: 5, backgroundColor: 'lightgrey', marginRight: 20}}
                    onPress={() => userLeavesGame()}
                >
                    <Text style={{textAlign: 'center', marginRight: 5, marginLeft: 5, fontSize: 25}}>Yes</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{borderWidth: 3, borderRadius: 5, backgroundColor: 'lightgrey'}}
                    onPress={() => setInitLeaveGame(false)}
                >
                    <Text style={{textAlign: 'center', marginRight: 7, marginLeft: 7, fontSize: 25}}>No</Text>
                </TouchableOpacity>
            </View>
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
            <View key={i + 1} style={{borderWidth: 3, borderRadius: 5, backgroundColor: 'lightgrey', position: 'absolute', borderColor: toggleBBSelect === true && activeBBSelect === i + 1 ? 'blue' : gameTurn === i + 1 ? 'red' : 'black' , minWidth: 100, maxWidth: 120, top: inGamePlayerPositions[i].pTop, left: inGamePlayerPositions[i].pLeft}}>
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

    let InvitingUserToGameWindow = (
        <View style={{borderWidth: 3, borderRadius: 5, backgroundColor: 'papayawhip', alignSelf: 'center', justifyContent: 'center', width: '85%', height: '35%', display: initInvitingPlayer === true ? 'flex' : 'none', position: 'absolute'}}>
            <View style={{borderWidth: 2, borderRadius: 3, backgroundColor: 'lightgrey', position: 'absolute', top:-2, left: 0, width: '100%'}}>
                    <Button 
                        title='X'
                        color='black'
                        onPress={() => userXOutInvitingPlayer()}
                    />
            </View>
            <View style={{display: readyResponse === false ? 'flex' : 'none'}}>
                <Text style={{textAlign: 'center', fontSize: 25, position: 'absolute', alignSelf: 'center', top: -85}}>Enter Username To Invite</Text>
                <TextInput 
                    value={usernameInvitingHolder}
                    onChangeText={(username) => usernameInviting = username}
                    style={styles.inputStyle}
                    placeholder='enter here'
                    ref={usernameRef}
                />
                <View style={{borderWidth: 3, borderRadius: 5, backgroundColor: 'lightgrey', position: 'absolute', width: '60%', top: 50, alignSelf: 'center'}}>
                    <Button 
                        title='Invite'
                        color='black'
                        onPress={() => user.socket.emit('invitingPlayerToGame', usernameInviting)}
                    />
                </View>
            </View>
            <View style={{display: readyResponse === true ? 'flex' : 'none'}}>
                <Text style={{textAlign: 'center', fontSize: 20}}>{responseText}</Text>  
            </View>

        </View>
    )

    let RestrictedInvitingPlayersWindow = (
        <View style={{borderWidth: 3, borderRadius: 5, backgroundColor: 'papayawhip', alignSelf: 'center', justifyContent: 'center', width: '85%', height: '35%', display: restrictionInvitingPlayers === true ? 'flex' : 'none', position: 'absolute'}}>
            <View style={{borderWidth: 2, borderRadius: 3, backgroundColor: 'lightgrey', position: 'absolute', top:-2, left: 0, width: '100%'}}>
                    <Button 
                        title='X'
                        color='black'
                        onPress={() => userXOutInvitingPlayer()}
                    />
            </View>
            <Text style={{textAlign: 'center'}}>{restrictionReason}</Text>
        </View>
    )

    //////////////////////////////////////////////////////////////////

    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            {PokerTable}
            {PlayerBorders}
            {StartButton}
            {BigBlindSelectionWindow}
            {playerGameView}
            {GameInfo}
            {blindLegend}
            {InGameMenuButton}
            {InGameMenu}
            {nextRoundButton}
            {WinnerSelectionWindow}
            {LeaveGameConfirmation}
            {InvitingUserToGameWindow}
            {RestrictedInvitingPlayersWindow}
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
    },

    inputStyle: {
        width: '80%',
        height: 40,
        padding: 10,
        marginVertical: 10,
        backgroundColor: '#DBDBD6',
        alignSelf: 'center',
        textAlign: 'center',
        borderWidth: 2,
        position: 'absolute',
        top: -35
    },
})

