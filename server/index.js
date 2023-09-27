require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIO = require('socket.io');

const app = express();

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

function makeId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

var possibleAccounts = {};
var globalState = {};
var gameSettingsObj;

const io = socketIO(server);

io.on('connection', (socket) => {

    let userBEI = {
        "guest": true,
        "id": null,
        "roomLabel": null,
        "loggedIn": false,
        "accountUsername": null
    };

    //////////////////////////////////////////////////////////////////

    ////// USER CONNECTING LISTENERS ////// 

    socket.emit('userConnects');

    socket.on('confirmedUserConnects', (id) => {
        userBEI.id = id;
    })

    //////////////////////////////////////////////////////////////////

    ////// USER CREATE ACCOUNT / LOG In LISTENERS //////

    socket.on('userCreatesAccount', (createdAccount) => {
        if (!possibleAccounts[createdAccount.chosenUN]) {
            possibleAccounts[createdAccount.chosenUN] = {username: createdAccount.chosenUN, password: createdAccount.chosenP, idHolder: userBEI.id, pendingAlerts: [], friendRequests: [], friendsList: [], groups: {}, groupNames: []}
            socket.emit('userAccountValid');
        } else {
            socket.emit('userAccountInvalid')
        }
    })

    socket.on('userLogsIn', (loggedInAccount) => {
        if (possibleAccounts[loggedInAccount.username]) {
            if (loggedInAccount.password === possibleAccounts[loggedInAccount.username].password) {
                possibleAccounts[loggedInAccount.username].idHolder = userBEI.id;
                userBEI.accountUsername = loggedInAccount.username
                socket.emit('logInSuccessful', possibleAccounts[loggedInAccount.username])
            } else {
                socket.emit('logInFailed')
            }
        } else {
            socket.emit('logInFailed')
        }
    }) 

    //////////////////////////////////////////////////////////////////

    ////// SOCIALS LISTENERS //////

    // Friend Listeners //

    socket.on('userSendsFriendRequest', (friendUsername) => {
        if (possibleAccounts[friendUsername]) {
            possibleAccounts[friendUsername].pendingAlerts.push({'type': 'friend_request', 'sender': userBEI.accountUsername});
            possibleAccounts[friendUsername].friendRequests.push(userBEI.accountUsername);
            io.to(possibleAccounts[friendUsername].idHolder).emit('sendingFriendRequestToReciever', userBEI.accountUsername)
            socket.emit('friendRequestCleared');
        } else {
            socket.emit('friendRequestFailed');
        }
    })

    socket.on('friendRequestAccepted', (alertInfo, index) => {
        possibleAccounts[userBEI.accountUsername].friendsList.push(alertInfo.sender)
        possibleAccounts[alertInfo.sender].friendsList.push(userBEI.accountUsername);
        socket.emit('friendRequestAcceptedConfirmed', alertInfo, index);
        io.to(possibleAccounts[alertInfo.sender].idHolder).emit('userAcceptedFriendRequest', userBEI.accountUsername);
    })

    // Groups Listeners //

    socket.on('groupCreated', (groupName) => {
        possibleAccounts[userBEI.accountUsername].groups[groupName] = {'host': userBEI.accountUsername, members: [userBEI.accountUsername], name: groupName, totalMembers: 1}
        possibleAccounts[userBEI.accountUsername].groupNames.push(groupName);
        socket.emit('groupCreationCleared', possibleAccounts[userBEI.accountUsername].groups[groupName]); 
    })

    socket.on('groupInviteSent', (username, groupName) => {
        if (possibleAccounts[username]) {
            possibleAccounts[username].pendingAlerts.push({'type': 'group_invite', 'sender': userBEI.accountUsername, 'groupName': groupName})

            io.to(possibleAccounts[username].idHolder).emit('sendingGroupInvite', userBEI.accountUsername, groupName);
            socket.emit('groupInviteConfirmed');
            
        } else {
            socket.emit('groupInviteFailed');
        }
    })

    socket.on('groupRequestAccepted', (alertInfo, index) => {
        possibleAccounts[alertInfo.sender].groups[alertInfo.groupName].members.push(userBEI.accountUsername);
        possibleAccounts[alertInfo.sender].groups[alertInfo.groupName].totalMembers++;
        possibleAccounts[userBEI.accountUsername].groups[alertInfo.groupName] = possibleAccounts[alertInfo.sender].groups[alertInfo.groupName];

        io.to(possibleAccounts[alertInfo.sender].idHolder).emit('groupInviteHasBeenAccepted', possibleAccounts[userBEI.accountUsername].groups[alertInfo.groupName])
        socket.emit('sendingGroupInfoAfterInviteAccepted', possibleAccounts[userBEI.accountUsername].groups[alertInfo.groupName], alertInfo, index)

    })

    socket.on('requestDeclined', (alertInfo, index) => {
        socket.emit('sendingBackRequestDecline', alertInfo, index)
    })

    socket.on('invitingPlayerToGame', (username) => {
        if (possibleAccounts[username]) {
            io.to(possibleAccounts[username].idHolder).emit('sendingGameInvite', {'type': 'game_invite', 'sender': userBEI.accountUsername, 'gameCode': userBEI.roomLabel});
            socket.emit('inviteToGameConfirmed');
        } else {
            socket.emit('inviteToGameFailed');
        }
    })

    socket.on('gameInviteAccepted', (alertInfo, index) => {
        userBEI.roomLabel = alertInfo.gameCode;
        socket.join(alertInfo.gameCode);
        socket.emit('sendingUserToGameAfterAccept', alertInfo, index);
    })

    //////////////////////////////////////////////////////////////////

    ////// GAME LISTENERS //////

    // Pre Game Listeners //

    socket.on('newGame', (rS, ante, timer, progressiveBlinds, gameStyle, bbMinRange, bbMaxRange, chipUnits) => {
        var roomName
        if (rS === 0 && ante === 0) {
            console.log('hi');
        } else if (rS != 0 && ante != 0) {

            roomName = makeId(5);

            userBEI['roomLabel'] = roomName;

            socket.join(roomName);

            gameSettingsObj = {
                active: true,
                players: [],
                idHolder: roomName,
                pNickNames: [],
                pChips: [],
                gameStarted: false,
                updatedPChips: [],
                desiredRoomSize: rS,
                ante: ante,
                timer: timer,
                gameStyle: gameStyle,
                progressiveBlinds: progressiveBlinds,
                minBuyIn: (bbMinRange * ante),
                maxBuyIn: (bbMaxRange * ante),
                chipUnits: chipUnits,
            };

            globalState[roomName.toString()] = gameSettingsObj;

            socket.emit('gameStateCreated');

        }
    })

    socket.on('playerEntersGameCode', (gameCode) => {
        if (globalState[gameCode]) {
            userBEI.roomLabel = gameCode;
            socket.join(gameCode)
            socket.emit('userIsClearedToJoinGame')
        } else {
            socket.emit('gameCodeDoesNotExist');
        }
    })

    socket.on('playerSubmitsInGameDisplayInfo', (displayObj) => {
        if (globalState[userBEI.roomLabel]) {
            globalState[userBEI.roomLabel].pNickNames.push(displayObj.enteredDisplayName)
            globalState[userBEI.roomLabel].pChips.push(Number(displayObj.enteredDisplayBuyIn))
            globalState[userBEI.roomLabel].players.push(userBEI.id)

            io.to(userBEI.roomLabel).emit('sendingUserToGamePage', userBEI.roomLabel, globalState[userBEI.roomLabel]);
        }
    })

    socket.on('initGameStarted', (info, info2) => {
        io.to(userBEI.roomLabel).emit('sendingBackGameStart', info)
    })    

    // In Game Listeners //

    socket.on('winnerHasBeenChosen', (winner) => {
        console.log(winner);
        io.to(userBEI.roomLabel).emit('sendingBackWinnerOfRound', winner)
    })

    socket.on('initNextRound', () => {
        io.to(userBEI.roomLabel).emit('sendingBackInitNextRound');
    })

    socket.on('userLeavesGame', (turn) => {
        globalState[userBEI.roomLabel].players[turn - 1] = '';
        globalState[userBEI.roomLabel].pNickNames[turn - 1] = '';
        globalState[userBEI.roomLabel].pChips[turn - 1] = '';

        io.to(userBEI.roomLabel).emit('playerHasLeftGame', turn);

        userBEI.roomLabel = null;
    })

    // PLAYER IN GAME LISTENERS //

    socket.on('pSubmitsBet', (turn, betAmount, playerChips) => {
        io.to(userBEI.roomLabel).emit('playerSubmitsBet', turn, betAmount, playerChips)
    })

    socket.on('pCallsBet', (turn, callAmount, playerChips) => {
        io.to(userBEI.roomLabel).emit('playerCallsBet', turn, callAmount, playerChips);
    })

    socket.on('pFolds', (turn) => {
        io.to(userBEI.roomLabel).emit('playerFolds', turn)
    })

    socket.on('pChecks', (turn) => {
        io.to(userBEI.roomLabel).emit('playerChecks', turn)
    })

    

});



server.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`));







// setInterval(() => {
//     io.emit('ping', { data: (new Date()) / 1 });
// }, 1000);