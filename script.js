/* Contents:
  1. Module to control the gameboard
      Create array to hold the values on the board
      Add and remove values to the board array
      Evaluate if the game has ended (with a victory or a tie) or should continue
  2. Factory function to create players
  3. Module to control the flow of the game
      Functions to make and organise the players
      Make a move, end the game, clear the board and clear the players' scores
  4. AI module to make the computer play the game
      Clone current state of the gameboard on to a test board
      Check for victory and end of game
      Choose the best possible move to win or tie the game
  5. Module to control UI display
      DOM elements to manipulate
      Functions to control the gameboard display
      Functions to control the end-of-game message display
      Functions to control the scoreboard display
      Functions to control the forms to pick a name or choose to play against AI
*/

/* *******************************************************
1. Module to control the gameboard
******************************************************* */
const gameboard = ((rows, columns) => {
  /* Create array to hold the values on the board */
  const board = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < columns; j++) {
      const cell = '';
      row.push(cell);
    }
    board.push(row);
  }

  const getBoard = () => board;

  /* Add and remove values to the board array */
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
      return board;
    }
    return false;
  };

  /* Evaluate if the game has ended (with a victory or a tie) or should continue */
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

  return { addMark, getBoard, clearBoard, checkVictoryStatus };
})(3, 3);

/* *******************************************************
2. Factory function to create players
******************************************************* */
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

/* *******************************************************
3. Module to control the flow of the game
******************************************************* */
const gameController = (() => {
  /* Functions to make and organise the players */
  const playerX = playerFactory('Player X', 'X');
  const playerO = playerFactory('Player O', 'O');

  const getPlayerXScore = () => playerX.getScore();
  const getPlayerOScore = () => playerO.getScore();
  const changePlayerXName = (newName) => playerX.changeName(newName);
  const changePlayerOName = (newName) => playerO.changeName(newName);
  const getPlayerXName = () => playerX.getName();
  const getPlayerOName = () => playerO.getName();

  let firstPlayer = playerX;
  let currentPlayer = firstPlayer;

  const changeFirstPlayer = () => {
    if (firstPlayer === playerX) {
      firstPlayer = playerO;
    } else if (firstPlayer === playerO) {
      firstPlayer = playerX;
    }
    currentPlayer = firstPlayer;
    return firstPlayer;
  };

  const changeCurrentPlayer = () => {
    if (currentPlayer === playerX) {
      currentPlayer = playerO;
    } else if (currentPlayer === playerO) {
      currentPlayer = playerX;
    }
    return currentPlayer;
  };

  const getCurrentPlayerName = () => currentPlayer.getName();
  const getCurrentPlayerMark = () => currentPlayer.mark;

  /* Make a move, end the game, clear the board and clear the players' scores */
  const clearScores = () => {
    playerX.clearScore();
    playerO.clearScore();
  };

  const resetBoard = () => {
    gameboard.clearBoard();
    currentPlayer = firstPlayer;
  };

  const endOrContinueGame = (mark) => {
    const victory = gameboard.checkVictoryStatus(mark);
    if (victory === true) {
      currentPlayer.incrementScore();
      return 'win';
    }
    if (victory === 'tie') {
      return 'tie';
    }
    return 'continue';
  };

  const takeTurn = (row, column) => {
    const chosenMove = gameboard.addMark(currentPlayer.mark, row, column);
    if (chosenMove === false) {
      return false; // false = there already is a mark in this cell
    }
    return currentPlayer.mark;
  };

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

/* *******************************************************
4. AI module to make the computer play the game
******************************************************* */
const playerBot = (() => {
  /* Clone current state of the gameboard on to a test board */
  const currentBoard = gameboard.getBoard();
  const testBoard = [];
  for (let i = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      const cell = '';
      row.push(cell);
    }
    testBoard.push(row);
  }
  const updateTestBoard = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        testBoard[i][j] = currentBoard[i][j].toString();
      }
    }
    return testBoard;
  };

  /* Check for victory and end of game */
  const checkVictory = (mark) => {
    if (
      (testBoard[0][0] === mark &&
        testBoard[0][1] === mark &&
        testBoard[0][2] === mark) ||
      (testBoard[1][0] === mark &&
        testBoard[1][1] === mark &&
        testBoard[1][2] === mark) ||
      (testBoard[2][0] === mark &&
        testBoard[2][1] === mark &&
        testBoard[2][2] === mark) ||
      (testBoard[0][0] === mark &&
        testBoard[1][0] === mark &&
        testBoard[2][0] === mark) ||
      (testBoard[0][1] === mark &&
        testBoard[1][1] === mark &&
        testBoard[2][1] === mark) ||
      (testBoard[0][2] === mark &&
        testBoard[1][2] === mark &&
        testBoard[2][2] === mark) ||
      (testBoard[0][0] === mark &&
        testBoard[1][1] === mark &&
        testBoard[2][2] === mark) ||
      (testBoard[0][2] === mark &&
        testBoard[1][1] === mark &&
        testBoard[2][0] === mark)
    ) {
      return true; // Game has been won
    }
    return false;
  };

  const checkEndOfGame = () => {
    let ended = true;
    for (let i = 0; i < testBoard.length; i++) {
      for (let j = 0; j < testBoard[i].length; j++) {
        if (testBoard[i][j] === '') {
          ended = false;
          break;
        } else {
          ended = true;
        }
      }
      if (ended === false) {
        break;
      }
    }
    return ended; // true = no more moves possible
  };

  /* Choose the best possible move to win or tie the game */
  let botMark = '';
  let opponent = '';

  const setBotMark = (mark) => {
    if (mark === 'X') {
      botMark = 'X';
      opponent = 'O';
    } else if (mark === 'O') {
      botMark = 'O';
      opponent = 'X';
    }
  };

  const minimax = (mark, depth, isBot) => {
    const victory = checkVictory(mark);

    if (victory === true && isBot === true) {
      return 20 - depth;
    }
    if (victory === true && isBot === false) {
      return -20 + depth;
    }
    if (victory === false) {
      const tie = checkEndOfGame();
      if (tie === true) {
        return 0;
      }
    }

    if (isBot === true) {
      let bestScore = 100; // Best possible score choosing this cell will produce for the player bot
      for (let i = 0; i < testBoard.length; i++) {
        for (let j = 0; j < testBoard[i].length; j++) {
          if (testBoard[i][j] === '') {
            testBoard[i][j] = opponent;
            const result = minimax(opponent, depth++, false);
            bestScore = Math.min(bestScore, result);
            testBoard[i][j] = '';
          }
        }
      }
      return bestScore;
    }
    if (isBot === false) {
      let bestScore = -100; // Best possible score choosing this cell will produce for the opponent
      for (let i = 0; i < testBoard.length; i++) {
        for (let j = 0; j < testBoard[i].length; j++) {
          if (testBoard[i][j] === '') {
            testBoard[i][j] = botMark;
            const result = minimax(botMark, depth++, true);
            bestScore = Math.max(bestScore, result);
            testBoard[i][j] = '';
          }
        }
      }
      return bestScore;
    }
  };

  let bestRow = '';
  let bestColumn = '';

  const getBestRow = () => bestRow;
  const getBestColumn = () => bestColumn;

  const findBestChoice = () => {
    let bestScore = -100;
    for (let i = 0; i < testBoard.length; i++) {
      for (let j = 0; j < testBoard[i].length; j++) {
        if (testBoard[i][j] === '') {
          testBoard[i][j] = botMark;
          const score = minimax(botMark, 0, true);
          testBoard[i][j] = '';
          if (score > bestScore) {
            bestScore = score;
            bestRow = i;
            bestColumn = j;
          }
        }
      }
    }
  };

  return {
    updateTestBoard,
    setBotMark,
    getBestRow,
    getBestColumn,
    findBestChoice,
  };
})();

/* *******************************************************
5. Module to control UI display
******************************************************* */
const displayController = (() => {
  /* DOM elements to manipulate */
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
  const humanRadioX = document.getElementById('player-human-x');
  const botRadioX = document.getElementById('player-bot-x');
  const humanRadioO = document.getElementById('player-human-o');
  const botRadioO = document.getElementById('player-bot-o');
  const victoryStatusDiv = document.getElementById('victory-status');
  const endMessage = document.getElementById('victory-status-message');
  const playAgainBtn = document.getElementById('button-play-again');
  const cells = document.querySelectorAll('.gameboard-cell');

  /* Functions to control the gameboard display */
  const cellsArray = Array.from(cells);

  const removeClass = (cell) => {
    if (cell.classList.contains('cell-x')) {
      cell.classList.remove('cell-x');
    }
    if (cell.classList.contains('cell-o')) {
      cell.classList.remove('cell-o');
    }
  };

  const completeTurn = (cell) => {
    const chosenOption = gameController.takeTurn(
      cell.dataset.row,
      cell.dataset.column
    );
    if (chosenOption === false) {
      return false;
    }
    swapFirstPlayerBtn.disabled = true;
    if (chosenOption === 'X' || chosenOption === 'O') {
      if (chosenOption === 'X') {
        cell.textContent = 'X';
      }
      if (chosenOption === 'O') {
        cell.textContent = 'O';
      }
      removeClass(cell);
      const result = gameController.endOrContinueGame(chosenOption);
      if (result === 'continue') {
        gameController.changeCurrentPlayer();
        togglePlayerMark();
        if (
          gameController.getCurrentPlayerName() === 'CrossBot' ||
          gameController.getCurrentPlayerName() === 'NaughtyBot'
        ) {
          botTakeTurnDisplay();
        }
      } else if (result === 'win' || result === 'tie') {
        disableBoard();
        refreshScore();
        displayEndMessage(result);
      }
    }
  };

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

    cell.addEventListener('click', () => completeTurn(cell));
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

  const resetBoardDisplay = () => {
    gameController.resetBoard();
    cellsArray.forEach((cell) => {
      cell.disabled = false;
      cell.textContent = '';
      cell.classList.remove('cell-x');
      cell.classList.remove('cell-o');
    });
    addMarkClass();
  };

  /* Functions to control the end-of-game message display */
  const playNewRound = () => {
    resetBoardDisplay();
    isFirstPlayerBot();
    victoryStatusDiv.classList.add('hidden');
    playAgainBtn.removeEventListener('click', playNewRound);
    swapFirstPlayerBtn.disabled = false;
  };

  const displayEndMessage = (result) => {
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

  /* Functions to control the scoreboard display */
  const refreshScore = () => {
    const xScore = gameController.getPlayerXScore();
    const oScore = gameController.getPlayerOScore();
    const xScoreDisplay = document.getElementById('score-x');
    const oScoreDisplay = document.getElementById('score-o');
    xScoreDisplay.textContent = `${xScore}`;
    oScoreDisplay.textContent = `${oScore}`;
  };
  refreshScore();

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
    resetBoardDisplay();
    if (
      gameController.getCurrentPlayerName() === 'CrossBot' ||
      gameController.getCurrentPlayerName() === 'NaughtyBot'
    ) {
      botTakeTurnDisplay();
    }
  };
  swapFirstPlayerBtn.addEventListener('click', swapFirstPlayerDisplay);

  /* Functions to control the forms to pick a name or choose to play against AI */
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

  const botTakeTurnDisplay = () => {
    playerBot.updateTestBoard();
    playerBot.findBestChoice();
    const chosenRow = playerBot.getBestRow();
    const chosenColumn = playerBot.getBestColumn();
    cellsArray.forEach((cell) => {
      if (
        cell.dataset.row === chosenRow.toString() &&
        cell.dataset.column === chosenColumn.toString()
      ) {
        const result = completeTurn(cell);
        if (result === false) {
          botTakeTurnDisplay();
        }
      }
    });
  };

  const isFirstPlayerBot = () => {
    const firstPlayer = gameController.getCurrentPlayerName();
    if (firstPlayer === 'CrossBot' || firstPlayer === 'NaughtyBot') {
      botTakeTurnDisplay();
    }
  };

  const playAsBot = (e, otherBot, botName, mark) => {
    otherBot.disabled = true;
    changeNameDisplay(e, botName, mark);
    playerBot.setBotMark(mark);
    isFirstPlayerBot();
  };

  const playAsHuman = (e, otherBot, humanName, mark) => {
    otherBot.disabled = false;
    changeNameDisplay(e, humanName, mark);
  };

  humanRadioX.addEventListener('change', (e) =>
    playAsHuman(e, botRadioO, 'Player X', 'X')
  );
  botRadioX.addEventListener('change', (e) =>
    playAsBot(e, botRadioO, 'CrossBot', 'X')
  );
  humanRadioO.addEventListener('change', (e) =>
    playAsHuman(e, botRadioX, 'Player O', 'O')
  );
  botRadioO.addEventListener('change', (e) =>
    playAsBot(e, botRadioX, 'NaughtyBot', 'O')
  );
})();
