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
      let tie = false;
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (board[i][j] === '') {
            tie = false;
            break;
          } else {
            tie = true;
          }
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
  return { name, mark, score, incrementScore, clearScore };
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
    return currentPlayer;
  };

  const resetGame = () => {
    gameboard.clearBoard();
    currentPlayer = firstPlayer;
  };

  const endOrContinueGame = () => {
    const victory = gameboard.checkVictoryStatus(currentPlayer.mark);
    if (victory === true) {
      console.log(`${currentPlayer.name} wins!`);
      currentPlayer.score += 1;
      const results = [currentPlayer.score, 1];
      resetGame();
      return results; // 1 = win
    }
    if (victory === 'tie') {
      console.log(`It's a tie!`);
      resetGame();
      return 2; // 2 = tie
    }
    changeCurrentPlayer();
    console.log(`${currentPlayer.name}'s turn.`);
    return 3; // 3 = game continues
  };

  const takeTurn = (row, column) => {
    const chosenMove = gameboard.addMark(currentPlayer.mark, row, column);
    if (chosenMove === false) {
      console.log('Try again!');
      return false; // false = there already is a mark in this cell
    }
    const endOrContinue = endOrContinueGame();
    return endOrContinue;
  };

  console.log(`${currentPlayer.name}'s turn.`);
  return { changeFirstPlayer, resetGame, takeTurn };
})();
