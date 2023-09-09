class Player {
    displayName;
    chips;
    turn;
    betAmount;
    totalBet;
    folded;
    roomId;
    socket;
    setterChips;
    currentGameTurn;
    betToCall

    constructor(displayName, chips, turn, betAmount, folded, roomId, socket) {
        this.displayName = displayName;
        this.chips = chips;
        this.turn = turn;
        this.betAmount = betAmount;
        this.folded = folded;
        this.roomId = roomId;
        this.socket = socket;
    }

    checks() {
        if (this.currentGameTurn === this.turn) {
            this.socket.emit('pChecks', this.turn)   
        }
    }

    bets(arg) {
        if (this.currentGameTurn === this.turn) {
            this.chips -= arg
            this.socket.emit('pSubmitsBet', this.turn, arg, this.chips)
        }
    }

    displayBet() {
        this.setterChips(this.chips)
    }

    calls() {
        if (this.currentGameTurn === this.turn) {
            this.chips -= this.betToCall
            this.socket.emit('pCallsBet', this.turn, this.betToCall, this.chips)
        }
    }

    displayCall() {

    }

    folds() {
        if (this.currentGameTurn === this.turn) {
            this.socket.emit('pFolds', this.turn)
        }
    }

    isABlind(arg) {
        this.chips -= arg;
    }

    winnerOfRound(chipsWon) {
        // this.chips += chipsWon;
        this.setterChips(this.chips + chipsWon);
    }

}

export default Player