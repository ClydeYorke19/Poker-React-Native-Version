class User {
    id;
    status;
    socket;
    loggedIn;
    accountInfo;
    inGame;
    playerGameObject;
    socket;
    gameId;
    friendRequests = [];
    friendsList = [];

    constructor(id, status, loggedIn, accountInfo, inGame, playerGameObject, socket) {
        this.id = id
        this.status = status
        this.loggedIn = loggedIn
        this.accountInfo = accountInfo
        this.playerGameObject = playerGameObject
        this.socket = socket
    }

    addFriendToList(friendUsername) {
        if (!this.friendsList.includes(friendUsername)) {
            this.friendsList.push(friendUsername);
        }
    }



    
}

export default User;