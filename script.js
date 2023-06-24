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
  let name = playerName;
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

  const getName = () => name;

  const changeName = (newName) => {
    name = newName;
    return name;
  };

  return {
    mark,
    incrementScore,
    clearScore,
    getScore,
    getName,
    changeName,
  };
};

/* Module to control the flow of the game */
const gameController = (() => {
  const playerX = playerFactory('Player X', 'X');
  const playerO = playerFactory('Player O', 'O');

  let firstPlayer = playerX;
  let currentPlayer = firstPlayer;

  const changeFirstPlayer = () => {
    if (firstPlayer === playerX) {
      firstPlayer = playerO;
    } else if (firstPlayer === playerO) {
      firstPlayer = playerX;
    }
    currentPlayer = firstPlayer;
    console.log(`${firstPlayer.getName()}'s turn.`);
    return firstPlayer;
  };

  const changeCurrentPlayer = () => {
    if (currentPlayer === playerX) {
      currentPlayer = playerO;
    } else if (currentPlayer === playerO) {
      currentPlayer = playerX;
    }
    console.log(`${currentPlayer.getName()}'s turn.`);
    return currentPlayer;
  };

  const getCurrentPlayerName = () => currentPlayer.getName();
  const getCurrentPlayerMark = () => currentPlayer.mark;
  const getPlayerXScore = () => playerX.getScore();
  const getPlayerOScore = () => playerO.getScore();
  const changePlayerXName = (newName) => playerX.changeName(newName);
  const changePlayerOName = (newName) => playerO.changeName(newName);
  const getPlayerXName = () => playerX.getName();
  const getPlayerOName = () => playerO.getName();

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

  console.log(`${currentPlayer.getName()}'s turn.`);
  return {
    changeFirstPlayer,
    getCurrentPlayerName,
    getCurrentPlayerMark,
    changeCurrentPlayer,
    getPlayerXScore,
    getPlayerOScore,
    changePlayerXName,
    changePlayerOName,
    getPlayerXName,
    getPlayerOName,
    clearScores,
    resetBoard,
    endOrContinueGame,
    takeTurn,
  };
})();

/* Module to control UI display */
const displayController = (() => {
  const clearScoreBtn = document.getElementById('clear-score');
  const swapFirstPlayerBtn = document.getElementById('swap-players');
  const choosePlayerXBtn = document.getElementById('button-choose-player-x');
  const choosePlayerOBtn = document.getElementById('button-choose-player-o');
  const choosePlayerXForm = document.getElementById('form-choose-player-x');
  const choosePlayerOForm = document.getElementById('form-choose-player-o');
  const chooseNameXInput = document.getElementById('choose-name-x');
  const chooseNameOInput = document.getElementById('choose-name-o');
  const submitNameXBtn = document.getElementById('button-submit-name-x');
  const submitNameOBtn = document.getElementById('button-submit-name-o');
  const nameDisplayX = document.getElementById('name-player-x');
  const nameDisplayO = document.getElementById('name-player-o');
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
      swapFirstPlayerBtn.disabled = true;
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
    swapFirstPlayerBtn.disabled = false;
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

  const clearScoreDisplay = () => {
    gameController.clearScores();
    refreshScore();
  };
  clearScoreBtn.addEventListener('click', clearScoreDisplay);

  const swapFirstPlayerDisplay = () => {
    const playerXDiv = document.getElementById('scoreboard-player-x');
    const playerXNameDiv = document.getElementById('scoreboard-player-x-name');
    const playerODiv = document.getElementById('scoreboard-player-o');
    const playerONameDiv = document.getElementById('scoreboard-player-o-name');
    if (playerXDiv.classList.contains('order-2')) {
      playerXDiv.classList.remove('order-2');
      playerXNameDiv.classList.remove('order-2');
      playerODiv.classList.add('order-2');
      playerONameDiv.classList.add('order-2');
    } else if (playerODiv.classList.contains('order-2')) {
      playerODiv.classList.remove('order-2');
      playerONameDiv.classList.remove('order-2');
      playerXDiv.classList.add('order-2');
      playerXNameDiv.classList.add('order-2');
    }
    gameController.changeFirstPlayer();
    togglePlayerMark();
  };
  swapFirstPlayerBtn.addEventListener('click', swapFirstPlayerDisplay);

  const toggleChangeNameForm = (form) => {
    const formToOpen = form;
    if (formToOpen.classList.contains('visible')) {
      formToOpen.classList.remove('visible');
    } else if (!formToOpen.classList.contains('visible')) {
      formToOpen.classList.add('visible');
    }
  };
  choosePlayerXBtn.addEventListener('click', () =>
    toggleChangeNameForm(choosePlayerXForm)
  );
  choosePlayerOBtn.addEventListener('click', () =>
    toggleChangeNameForm(choosePlayerOForm)
  );

  const changeNameDisplay = (e, newName, mark) => {
    e.preventDefault();
    if (mark === 'X') {
      if (newName === '' || newName === ' ') {
        gameController.changePlayerXName('PLayer X');
      } else {
        gameController.changePlayerXName(newName);
      }
      nameDisplayX.textContent = gameController.getPlayerXName();
      toggleChangeNameForm(choosePlayerXForm);
    } else if (mark === 'O') {
      if (newName === '' || newName === ' ') {
        gameController.changePlayerOName('PLayer O');
      } else {
        gameController.changePlayerOName(newName);
      }
      nameDisplayO.textContent = gameController.getPlayerOName();
      toggleChangeNameForm(choosePlayerOForm);
    }
  };
  submitNameXBtn.addEventListener('click', (e) => {
    changeNameDisplay(e, chooseNameXInput.value, 'X');
  });
  submitNameOBtn.addEventListener('click', (e) => {
    changeNameDisplay(e, chooseNameOInput.value, 'O');
  });
})();
