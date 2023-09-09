import { inGameLogic4Players } from "./InGameLogic";

const pF =[];

export const setPf = (data) => {
    for (let i = 0; i < data.length; i++) {
        pF.push(data[i]);
    }
}

export const player1 = {

    bets: (socket, chips) => {
        socket.emit('p1SubmitsBet', chips)
    },
    displayBet: (rS, setCbCB, setTurnCB, socket) => {
        setCbCB(1);

        if (rS === 4) {
            inGameLogic4Players.pBettingOrRaising4(setTurnCB, socket, 3, pF[2], 4, pF[3], 2);
        }
    },

    checks: (socket) => {
        socket.emit('p1Checks');
    },
    displayCheck: (rS, bB, cR, setTurnCB, socket) => {
        if (rS === 4) {
            if (bB === 1) {                                       // 
                inGameLogic4Players.pChecking4(3, setTurnCB, cR, socket, 2, pF[1], 1, 3, pF[2], 4, pF[3], 2);
            }
            if (bB === 2) {
                inGameLogic4Players.pChecking4(2, setTurnCB, cR, socket, 3, pF[2], 4, pF[3], 2);
            }
            if (bB === 3) {
                inGameLogic4Players.pChecking4(0, setTurnCB, cR, socket, 3, pF[2], 4, pF[3], 2);
            }
            if (bB === 4) {
                inGameLogic4Players.pChecking4(1, setTurnCB, cR, socket, 3, pF[2], 4, pF[3], 2);
            }

        }
    },

    calls: (socket, chips) => {
        socket.emit('p1CallsBets', chips);
    },
    displayCall: (rS, bB, cB, setTurnCB, socket) => {

        if (rS === 4) {
            if (bB === 1) {
                if (cB === 2) {
                    inGameLogic4Players.theBB4(3, setTurnCB, socket, 3, pF[2], 4, pF[3], 2);
                }
                if (cB === 3) {
                    inGameLogic4Players.theBB4(1, setTurnCB, socket, 2, pF[1], 1);
                }
                if (cB === 4) {
                    inGameLogic4Players.theBB4(2, setTurnCB, socket, 3, pF[2], 2, pF[1], 1);
                }
            }
            if (bB === 2) {
                if (cB === 2) {
                    inGameLogic4Players.pNext2TheBB4(3, setTurnCB, socket, 3, pF[2], 4, pF[3], 2);
                }

                if (cB === 3) {
                    inGameLogic4Players.pNext2TheBB4(1, setTurnCB, socket, 4, pF[3], 2, pF[1], 1);
                }

                if (cB === 4) {
                    inGameLogic4Players.pNext2TheBB4(2, setTurnCB, socket, 3, pF[2], 4);
                }
            }
            if (bB === 3) {
                if (cB === 2) {
                    inGameLogic4Players.theSB4(3, setTurnCB, socket, 3, pF[2], 4, pF[3], 1);
                }

                if (cB === 3) {
                    inGameLogic4Players.theSB4(1, setTurnCB, socket, 1);
                }

                if (cB === 4) {
                    inGameLogic4Players.theSB4(2, setTurnCB, socket, 3, pF[2], 1);
                }
            }
            if (bB === 4) {
                if (cB === 2) {
                    inGameLogic4Players.p2SpotsFromBB4(3, setTurnCB, socket, 3, pF[2], 4, pF[3], 2);
                }

                if (cB === 3) {
                    inGameLogic4Players.p2SpotsFromBB4(1, setTurnCB, socket, 3);
                }

                if (cB === 4) {
                    inGameLogic4Players.p2SpotsFromBB4(2, setTurnCB, socket, 3, pF[2], 4);
                }
            }
        }

    },

    folds: (socket) => {
        socket.emit('p1Folds')
    },
    displayFold: (rS, bB, cB, setTurnCB, pFolded, setFoldedCB, socket) => {
        setFoldedCB(pFolded)
        if (rS === 4) {
            if (bB === 1) {
                if (cB === 2) {
                    inGameLogic4Players.theBB4(3, setTurnCB, socket, 3, pF[2], 4);
                }
                if (cB === 3) {
                    inGameLogic4Players.theBB4(1, setTurnCB, socket, 2, pF[1], 3);
                }
                if (cB === 4) {
                    inGameLogic4Players.theBB4(2, setTurnCB, socket, 3, pF[2], 2);
                }
            }
            if (bB === 2) {
                if (cB === 2) {
                    inGameLogic4Players.pNext2TheBB4(3, setTurnCB, socket, 3, pF[2], 4);
                }
                if (cB === 3) {
                    inGameLogic4Players.pNext2TheBB4(1, setTurnCB, socket, 4, pF[3], 2);
                }
                if (cB === 4) {
                    inGameLogic4Players.pNext2TheBB4(2, setTurnCB, socket, 3, pF[2], 4);
                }
            }
            if (bB === 3) {
                if (cB === 2) {
                    inGameLogic4Players.theSB4(3, setTurnCB, socket, 3, pF[2], 4);
                }
                if (cB === 3) {
                    inGameLogic4Players.theSB4(1, setTurnCB, socket, 3);
                }
                if (cB === 4) {
                    inGameLogic4Players.theSB4(2, setTurnCB, socket, 3, pF[2], 4);
                }
            }
            if (bB === 4) {
                if (cB === 2) {
                    inGameLogic4Players.p2SpotsFromBB4(3, setTurnCB, socket, 3, pF[2], 4);
                }
                if (cB === 3) {
                    inGameLogic4Players.p2SpotsFromBB4(1, setTurnCB, socket, 3);
                }
                if (cB === 4) {
                    inGameLogic4Players.p2SpotsFromBB4(2, setTurnCB, socket, 3, pF[2], 4);
                }
            }
        }
    }

}



export const player3 = {
    bets: (socket, chips) => {
        socket.emit('p3SubmitsBet', chips);
    },
    displayBet: (rS, setCbCB, setTurnCB) => {
        setCbCB(3);
        if (rS === 4) {
            inGameLogic4Players.pBettingOrRaising4(setTurnCB, 4, pF[3], 2, pF[1], 1);
        }
    },

    checks: (socket) => {
        socket.emit('p3Checks');
    },
    displayCheck: (rS, bB, cR, setTurnCB, socket) => {
        if (rS === 4) {
            if (bB === 1) {
                inGameLogic4Players.pChecking4(2, setTurnCB, cR, socket, 4, pF[3], 2, pF[1], 1);
            }
            if (bB === 2) {
                inGameLogic4Players.pChecking4(1, setTurnCB, cR, socket, 4, pF[3], 2, pF[1], 1);
            }
            if (bB === 3) {
                inGameLogic4Players.pChecking4(3, setTurnCB, cR, socket, 1, pF[0], 3, 4, pF[3], 2, pF[1], 1);
            }
            if (bB === 4) {
                inGameLogic4Players.pChecking4(0, setTurnCB, cR, socket, 4, pF[3], 2, pF[1], 1);
            }
        }
    },

    calls: (socket, chips) => {
        socket.emit('P3CallsBet', chips);
    },
    displayCall: (rS, bB, cB, setTurnCB, socket) => {
        if (rS === 4) {
            if (bB === 1) {
                if (cB === 1) {
                    inGameLogic4Players.pNext2TheBB4(3, setTurnCB, socket, 4, pF[3], 2, pF[1], 1);
                }
                if (cB === 2) {
                    inGameLogic4Players.pNext2TheBB4(2, setTurnCB, socket, 4, pF[3], 2);
                }
                if (cB === 4) {
                    inGameLogic4Players.pNext2TheBB4(1, setTurnCB, socket, 2, pF[1], 1, pF[0], 3);
                }
            }
            if (bB === 2) {
                if (cB === 1) {
                    inGameLogic4Players.p2SpotsFromBB4(3, setTurnCB, socket, 4, pF[3], 2, pF[1], 1);
                }
                if (cB === 2) {
                    inGameLogic4Players.p2SpotsFromBB4(2, setTurnCB, socket, 4, pF[3], 2);
                }
                if (cB === 4) {
                    inGameLogic4Players.p2SpotsFromBB4(1, setTurnCB, socket, 4);
                }
            }
            if (bB === 3) {
                if (cB === 1) {
                    inGameLogic4Players.theBB4(3, setTurnCB, socket, 4, pF[3], 2, pF[1], 1);
                }
                if (cB === 2) {
                    inGameLogic4Players.theBB4(2, setTurnCB, socket, 4, pF[3], 1);
                }
                if (cB === 4) {
                    inGameLogic4Players.theBB4(1, setTurnCB, socket, 1, pF[0], 3);
                }
            }
            if (bB === 4) {
                if (cB === 1) {
                    inGameLogic4Players.theSB4(3, setTurnCB, socket, 4, pF[3], 2, pF[1], 3);
                }
                if (cB === 2) {
                    inGameLogic4Players.theSB4(2, setTurnCB, socket, 4, pF[3], 3);
                }
                if (cB === 4) {
                    inGameLogic4Players.theSB4(1, setTurnCB, socket, 3);
                }
            }
        }
    },

    folds: (socket) => {
        socket.emit('p3Folds');
    },
    displayFold: (rS, bB, cB, setTurnCB, pFolded, setFoldedCB, socket) => {
        setFoldedCB(pFolded)
        if (rS === 4) {
            if (bB === 1) {
                if (cB === 1) {
                    inGameLogic4Players.pNext2TheBB4(3, setTurnCB, socket, 4, pF[3], 2);
                }
                if (cB === 2) {
                    inGameLogic4Players.pNext2TheBB4(2, setTurnCB, socket, 4, pF[3], 2);
                }
                if (cB === 4) {
                    inGameLogic4Players.pNext2TheBB4(1, setTurnCB, socket, 2, pF[1], 1);
                }
            }
            if (bB === 2) {
                if (cB === 1) {
                    inGameLogic4Players.p2SpotsFromBB4(3, setTurnCB, socket, 4, pF[3], 2);
                }
                if (cB === 2) {
                    inGameLogic4Players.p2SpotsFromBB4(2, setTurnCB, socket, 4, pF[3], 2);
                }
                if (cB === 4) {
                    inGameLogic4Players.p2SpotsFromBB4(1, setTurnCB, socket, 4);
                }
            }
            if (bB === 3) {
                if (cB === 1) {
                    inGameLogic4Players.theBB4(3, setTurnCB, socket, 4, pF[3], 2);
                }
                if (cB === 2) {
                    inGameLogic4Players.theBB4(2, setTurnCB, socket, 4, pF[3], 1);
                }
                if (cB === 4) {
                    inGameLogic4Players.theBB4(1, setTurnCB, socket, 1, pF[0], 2);
                }
            }
            if (bB === 4) {
                if (cB === 1) {
                    inGameLogic4Players.theSB4(3, setTurnCB, socket, 4, pF[3], 2);
                }
                if (cB === 2) {
                    inGameLogic4Players.theSB4(2, setTurnCB, socket, 4, pF[3], 2);
                }
                if (cB === 4) {
                    inGameLogic4Players.theSB4(1, setTurnCB, socket, 4);
                }
            }
        }
    }
}

export const player4 = {
    bets: (socket, chips) => {
        socket.emit('p4SubmitsBet', chips)
    },
    displayBet: (rS, setCbCB, setTurnCB) => {
        setCbCB(4)
        if (rS === 4) {
            inGameLogic4Players.pBettingOrRaising4(setTurnCB, 2, pF[1], 1, pF[0], 3);
        }
    },

    checks: (socket) => {
        socket.emit('p4Checks');
    },
    displayCheck: (rS, bB, cR, setTurnCB, socket) => {
        if (rS === 4) {
            if (bB === 1) {
                inGameLogic4Players.pChecking4(1, setTurnCB, cR, socket, 2, pF[1], 1, pF[0], 3);
            }
            if (bB === 2) {
                inGameLogic4Players.pChecking4(0, setTurnCB, cR, socket, 2, pF[1], 1, pF[0], 3);
            }
            if (bB === 3) {
                inGameLogic4Players.pChecking4(2, setTurnCB, cR, socket, 2, pF[1], 1, pF[0], 3);
            }
            if (bB === 4) {
                inGameLogic4Players.pChecking4(3, setTurnCB, cR, socket, 3, pF[2], 4, 2, pF[1], 1, pF[0], 3);
            }
        }
    },

    calls: (socket, chips) => {
        socket.emit('p4CallsBet', chips)
    },
    displayCall: (rS, bB, cB, setTurnCB, socket) => {
        if (rS === 4) {
            if (bB === 1) {
                if (cB === 1) {
                    inGameLogic4Players.p2SpotsFromBB4(2, setTurnCB, socket, 2, pF[1], 1);
                }
                if (cB === 2) {
                    inGameLogic4Players.p2SpotsFromBB4(1, setTurnCB, socket, 2);
                }
                if (cB === 3) {
                    inGameLogic4Players.p2SpotsFromBB4(3, setTurnCB, socket, 2, pF[1], 1, pF[0], 3);
                }
            }
            if (bB === 2) {
                if (cB === 1) {
                    inGameLogic4Players.theSB4(2, setTurnCB, socket, 2, pF[1], 4);
                }
                if (cB === 2) {
                    inGameLogic4Players.theSB4(1, setTurnCB, socket, 4);
                }
                if (cB === 3) {
                    inGameLogic4Players.theSB4(3, setTurnCB, socket, 2, pF[1], 1, pF[0], 4);
                }
            }
            if (bB === 3) {
                if (cB === 1) {
                    inGameLogic4Players.pNext2TheBB4(2, setTurnCB, socket, 2, pF[1], 1);
                }
                if (cB === 2) {
                    inGameLogic4Players.pNext2TheBB4(1, setTurnCB, socket, 1, pF[0], 3, pF[2], 4);
                }
                if (cB === 3) {
                    inGameLogic4Players.pNext2TheBB4(3, setTurnCB, socket, 2, pF[1], 1, pF[0], 3);
                }
            }
            if (bB === 4) {
                if (cB === 1) {
                    inGameLogic4Players.theBB4(2, setTurnCB, socket, 2, pF[1], 3, pF[2], 4);
                }
                if (cB === 2) {
                    inGameLogic4Players.theBB4(1, setTurnCB, socket, 3, pF[2], 4);
                }
                if (cB === 3) {
                    inGameLogic4Players.theBB4(3, setTurnCB, socket, 2, pF[1], 1, pF[0], 3);
                }
            }
        }
    },

    folds: (socket) => {
        socket.emit('p4Folds')
    },
    displayFold: (rS, bB, cB, setTurnCB, pFolded, setFoldedCB, socket) => {
        setFoldedCB(pFolded)
        if (rS === 4) {
            if (bB === 1) {
                if (cB === 1) {
                    inGameLogic4Players.p2SpotsFromBB4(2, setTurnCB, socket, 2, pF[1], 1);
                }
                if (cB === 2) {
                    inGameLogic4Players.p2SpotsFromBB4(1, setTurnCB, socket, 2);
                }
                if (cB === 3) {
                    inGameLogic4Players.p2SpotsFromBB4(3, setTurnCB, socket, 2, pF[1], 1);
                }
            }
            if (bB === 2) {
                if (cB === 1) {
                    inGameLogic4Players.theSB4(2, setTurnCB, socket, 2, pF[1], 1);
                }
                if (cB === 2) {
                    inGameLogic4Players.theSB4(1, setTurnCB, socket, 2);
                }
                if (cB === 3) {
                    inGameLogic4Players.theSB4(3, setTurnCB, socket, 2, pF[1], 1);
                }
            }
            if (bB === 3) {
                if (cB === 1) {
                    inGameLogic4Players.pNext2TheBB4(2, setTurnCB, socket, 2, pF[1], 1);
                }
                if (cB === 2) {
                    inGameLogic4Players.pNext2TheBB4(1, setTurnCB, socket, 1, pF[0], 3);
                }
                if (cB === 3) {
                    inGameLogic4Players.pNext2TheBB4(3, setTurnCB, socket, 2, pF[1], 1);
                }
            }
            if (bB === 4) {
                if (cB === 1) {
                    inGameLogic4Players.theBB4(2, setTurnCB, socket, 2, pF[1], 3);
                }
                if (cB === 2) {
                    inGameLogic4Players.theBB4(1, setTurnCB, socket, 3, pF[2], 2);
                }
                if (cB === 3) {
                    inGameLogic4Players.theBB4(3, setTurnCB, socket, 2, pF[1], 1);
                }
            }
        }
    }
}

export const roundEnder = (cR, rN, setCrCB, setRnCB, cB, setCbCB, socket) => {
    setCbCB(0);
    if (cR === 0) {
        setRnCB('Flop');
        setCrCB(1);
    } else if (cR === 1) {
        setRnCB('Turn');
        setCrCB(2);
    } else if (cR === 2) {
        setRnCB('River');
        setCrCB(3);
    } else if (cR === 3) {
        socket.emit('currentRoundHasJustEnded');
    }
}

export const winnerSubmitted = (socket) => {
    socket.emit('roundIsOver');
}

export const displayWinnerOfRound = (winner, setWinnerCB, pot, setPot, pChips, setPChips) => {
    pChips += pot;
    setPChips(pChips);
    setPot(0);
    setWinnerCB(0);
}

export const nextRoundIsInitiated = (socket) => {
    socket.emit('nextRoundInitiated');
}

export const displayNextRound2Room = (rS, bB, setBB, setSB, setTurn, setRound, setRoundName) => {
    if (rS === 4) {
        setRoundName('PreFlop');
        setRound(0);
        if (bB === 1) {
            setSB(1);
            setTurn(4);

            setBB(3);
        } else if (bB === 2) {
            setSB(2)
            setTurn(3);

            setBB(1)
        } else if (bB === 3) {
            setSB(3)
            setTurn(2);

            setBB(4)
        } else if (bB === 4) {
            setSB(4)
            setTurn(1);

            setBB(2);
        }
    }

}