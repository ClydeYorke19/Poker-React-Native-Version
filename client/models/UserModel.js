class User {
    id;
    status;
    socket;
    loggedIn;
    accountInfo;
    inGame;
    playerGameObject;
    gameObjHolder;
    currentPage;
    socket;
    gameId;
    friendRequests = [];
    friendsList = [];
    groups = {}
    groupNames = []
    groupRequests = [];
    alerts = [];

    constructor(id, status, loggedIn, accountInfo, inGame, playerGameObject, socket) {
        this.id = id
        this.status = status
        this.loggedIn = loggedIn
        this.inGame = inGame
        this.accountInfo = accountInfo
        this.playerGameObject = playerGameObject
        this.socket = socket
    }

    changeCurrentPage(newPosition) {
        this.currentPage = newPosition;
    }

    addAlert(type, sender, aInfo) {


        if (type === 'friend_request') {

            if (!this.friendRequests.includes(sender) && !this.friendsList.includes(sender)) {
                this.alerts.push({'type': 'friend_request', 'sender': sender})
                this.friendRequests.push(sender);
            }

        } else if (type === 'group_request') {
            if (!this.groupRequests.includes(sender) && !this.groupNames.includes(aInfo)) {
                this.alerts.push({'type': 'group_request', 'sender': sender, 'groupName': aInfo})
                this.groupRequests.push(sender);
            }

        }

    }

    removeAlert(alertInfo, index) {
        if (alertInfo.type === 'friend_request') {

            for (let i = 0; i < this.friendRequests.length; i++) {
                if (this.friendRequests[i] === alertInfo.sender) {
                    this.friendRequests.splice(i, 1);
                }
            }


        } else if (alertInfo.type === 'group_request') {

            for (let i = 0; i < this.groupRequests.length; i++) {
                if (this.groupRequests[i] === alertInfo.sender) {
                    this.groupRequests.splice(i, 1);
                }
            }

        }

        this.alerts.splice(index, 1);
    }

    addFriendToList(friendUsername) {
        if (!this.friendsList.includes(friendUsername)) {
            this.friendsList.push(friendUsername);
        }
    }

    addGroup(groupInfo) {
        if (!this.groupNames.includes(groupInfo.name)) {
            this.groups[groupInfo.name] = groupInfo;
            this.groupNames.push(groupInfo.name)
        }

    }

    updateGroupInfo(groupInfo) {
        this.groups[groupInfo.name] = groupInfo;
    }

    resetUserInfo() {
        // used when a user signs out or something else
    }



    
}

export default User;