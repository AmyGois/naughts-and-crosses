/* Module to control the gameboard */
const gameboard = ((rows, columns) => {
  const board = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < columns; j++) {
      const cell = '';
      row.push(cell);
    }
    board.push(row);
  }

  const clearBoard = () => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        board[i][j] = '';
      }
    }
    return board;
  };

  const addMark = (playerMark, row, column) => {
    if (board[row][column] === '') {
      board[row][column] = playerMark;
      console.log(board);
      return board;
    }
    return false;
  };

  const checkVictoryStatus = (playerMark) => {
    let victory = false;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === playerMark) {
          victory = true;
        } else {
          victory = false;
          break;
        }
      }
      if (victory === true) {
        return victory;
      }
    }
    for (let j = 0; j < board[0].length; j++) {
      let victory1 = victory;
      board.every((row) => {
        if (row[j] === playerMark) {
          victory1 = true;
        } else {
          victory1 = false;
          return victory1;
        }
        return victory1;
      });
      victory = victory1;
      if (victory === true) {
        return victory;
      }
    }
    let j = 0;
    board.every((row) => {
      if (row[j] === playerMark) {
        victory = true;
      } else {
        victory = false;
        return victory;
      }
      j += 1;
      return victory;
    });
    if (victory === true) {
      return victory;
    }
    j = board.length - 1;
    board.every((row) => {
      if (row[j] === playerMark) {
        victory = true;
      } else {
        victory = false;
        return victory;
      }
      j -= 1;
      return victory;
    });
    if (victory === false) {
      let tie = true;
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (board[i][j] === '') {
            tie = false;
            break;
          } else {
            tie = true;
          }
        }
        if (tie === false) {
          break;
        }
      }
      if (tie === true) {
        victory = 'tie';
      }
    }
    return victory;
  };
  console.log(board);
  return { addMark, clearBoard, checkVictoryStatus };
})(3, 3);

/* Factory function to create players */
const playerFactory = (playerName, playerMark) => {
  const name = playerName;
  const mark = playerMark;
  let score = 0;
  const incrementScore = () => {
    score += 1;
    return score;
  };
  const clearScore = () => {
    score = 0;
    return score;
  };

  const getScore = () => score;

  return { name, mark, incrementScore, clearScore, getScore };
};

/* Module to control the flow of the game */
const gameController = (() => {
  const playerX = playerFactory('Player X', 'X');
  const playerO = playerFactory('Player O', 'O');

  let firstPlayer = playerX;
  const changeFirstPlayer = () => {
    if (firstPlayer === playerX) {
      firstPlayer = playerO;
    } else if (firstPlayer === playerO) {
      firstPlayer = playerX;
    }
    console.log(`${firstPlayer.name}'s turn.`);
    return firstPlayer;
  };

  let currentPlayer = firstPlayer;
  const changeCurrentPlayer = () => {
    if (currentPlayer === playerX) {
      currentPlayer = playerO;
    } else if (currentPlayer === playerO) {
      currentPlayer = playerX;
    }
    console.log(`${currentPlayer.name}'s turn.`);
    return currentPlayer;
  };

  const getCurrentPlayerName = () => currentPlayer.name;
  const getCurrentPlayerMark = () => currentPlayer.mark;
  const getPlayerXScore = () => playerX.getScore();
  const getPlayerOScore = () => playerO.getScore();

  const clearScores = () => {
    playerX.clearScore();
    console.log(playerX.getScore());
    playerO.clearScore();
    console.log(playerO.getScore());
  };

  const resetBoard = () => {
    gameboard.clearBoard();
    currentPlayer = firstPlayer;
  };

  const endOrContinueGame = (mark) => {
    const victory = gameboard.checkVictoryStatus(mark);
    if (victory === true) {
      console.log(`${mark} wins!`);
      currentPlayer.incrementScore();
      return 'win';
    }
    if (victory === 'tie') {
      console.log(`It's a tie!`);
      return 'tie';
    }
    return 'continue';
  };

  const takeTurn = (row, column) => {
    const chosenMove = gameboard.addMark(currentPlayer.mark, row, column);
    if (chosenMove === false) {
      console.log('Try again!');
      return false; // false = there already is a mark in this cell
    }
    return currentPlayer.mark;
  };

  console.log(`${currentPlayer.name}'s turn.`);
  return {
    changeFirstPlayer,
    getCurrentPlayerName,
    getCurrentPlayerMark,
    changeCurrentPlayer,
    getPlayerXScore,
    getPlayerOScore,
    clearScores,
    resetBoard,
    endOrContinueGame,
    takeTurn,
  };
})();

/* Module to control UI display */
const displayController = (() => {
  const cells = document.querySelectorAll('.gameboard-cell');
  const cellsArray = Array.from(cells);
  cellsArray.forEach((cell) => {
    if (cellsArray.indexOf(cell) < 3) {
      cell.dataset.row = 0;
    }
    if (cellsArray.indexOf(cell) >= 3 && cellsArray.indexOf(cell) < 6) {
      cell.dataset.row = 1;
    }
    if (cellsArray.indexOf(cell) >= 6 && cellsArray.indexOf(cell) < 9) {
      cell.dataset.row = 2;
    }

    if (
      cellsArray.indexOf(cell) === 0 ||
      cellsArray.indexOf(cell) === 3 ||
      cellsArray.indexOf(cell) === 6
    ) {
      cell.dataset.column = 0;
    }
    if (
      cellsArray.indexOf(cell) === 1 ||
      cellsArray.indexOf(cell) === 4 ||
      cellsArray.indexOf(cell) === 7
    ) {
      cell.dataset.column = 1;
    }
    if (
      cellsArray.indexOf(cell) === 2 ||
      cellsArray.indexOf(cell) === 5 ||
      cellsArray.indexOf(cell) === 8
    ) {
      cell.dataset.column = 2;
    }

    const removeClass = () => {
      if (cell.classList.contains('cell-x')) {
        cell.classList.remove('cell-x');
      }
      if (cell.classList.contains('cell-o')) {
        cell.classList.remove('cell-o');
      }
    };

    const completeTurn = () => {
      const chosenOption = gameController.takeTurn(
        cell.dataset.row,
        cell.dataset.column
      );
      if (chosenOption === 'X' || chosenOption === 'O') {
        if (chosenOption === 'X') {
          cell.textContent = 'X';
        }
        if (chosenOption === 'O') {
          cell.textContent = 'O';
        }
        removeClass();
        const result = gameController.endOrContinueGame(chosenOption);
        if (result === 'continue') {
          gameController.changeCurrentPlayer();
          togglePlayerMark();
        } else if (result === 'win' || result === 'tie') {
          disableBoard();
          refreshScore();
          displayEndMessage(result);
        }
      }
    };

    cell.addEventListener('click', completeTurn);
  });

  const addMarkClass = () => {
    const currentPlayerMark = gameController.getCurrentPlayerMark();
    if (currentPlayerMark === 'X') {
      cellsArray.forEach((cell) => cell.classList.add('cell-x'));
    }
    if (currentPlayerMark === 'O') {
      cellsArray.forEach((cell) => cell.classList.add('cell-o'));
    }
  };
  addMarkClass();

  const togglePlayerMark = () => {
    cellsArray.forEach((cell) => {
      if (cell.classList.contains('cell-x')) {
        cell.classList.replace('cell-x', 'cell-o');
      } else if (cell.classList.contains('cell-o')) {
        cell.classList.replace('cell-o', 'cell-x');
      }
    });
  };

  const disableBoard = () => {
    cellsArray.forEach((cell) => {
      cell.disabled = true;
    });
  };

  const refreshScore = () => {
    const xScore = gameController.getPlayerXScore();
    const oScore = gameController.getPlayerOScore();
    const xScoreDisplay = document.getElementById('score-x');
    const oScoreDisplay = document.getElementById('score-o');
    xScoreDisplay.textContent = `${xScore}`;
    oScoreDisplay.textContent = `${oScore}`;
  };
  refreshScore();

  const playNewRound = () => {
    gameController.resetBoard();
    cellsArray.forEach((cell) => {
      cell.disabled = false;
      cell.textContent = '';
      cell.classList.remove('cell-x');
      cell.classList.remove('cell-o');
    });
    addMarkClass();

    const victoryStatusDiv = document.getElementById('victory-status');
    const playAgainBtn = document.getElementById('button-play-again');
    victoryStatusDiv.classList.add('hidden');
    playAgainBtn.removeEventListener('click', playNewRound);
  };

  const displayEndMessage = (result) => {
    const victoryStatusDiv = document.getElementById('victory-status');
    const endMessage = document.getElementById('victory-status-message');
    const playAgainBtn = document.getElementById('button-play-again');

    victoryStatusDiv.classList.remove('hidden');
    if (result === 'win') {
      const winner = gameController.getCurrentPlayerName();
      endMessage.textContent = `${winner} wins this round!`;
    }
    if (result === 'tie') {
      endMessage.textContent = `It's a tie!`;
    }
    playAgainBtn.addEventListener('click', playNewRound);
  };

  const clearScoreBtn = document.getElementById('clear-score');
  const clearScoreDisplay = () => {
    gameController.clearScores();
    refreshScore();
  };
  clearScoreBtn.addEventListener('click', clearScoreDisplay);
})();
