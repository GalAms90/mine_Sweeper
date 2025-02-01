'use strict'

function createMat(SIZE) {
  var mat = []

  for (var i = 0; i < SIZE; i++) {
    mat[i] = []
    for (var j = 0; j < SIZE; j++) {
      mat[i][j] = {}
    }
  }
  return mat
}

function countEmptyCells(board) {
  var res = []
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if (gIsFirstClick.i === i && gIsFirstClick.j === j) continue
      if (!board[i][j].isMine)  ///
        res.push({ i, j })
    }
  }
  if (!res) return null
  return res
}

function getRandomPos() {
  var emptyCells = countEmptyCells(gBoard)
  var randPos = getRandomInt(0, emptyCells.length - 1)
  var randomLocation = emptyCells[randPos]
  emptyCells.splice(randPos, 1)


  return randomLocation

}

function isGamerWin() {
  return gGame.shownCount === (gLevel.SIZE ** 2 - gLevel.MINES) &&
    gGame.markedCount === gLevel.MINES || gGame.shownCount === (gLevel.SIZE ** 2)
}

function startStopWatch() {

  var StartTime = Date.now();

  gInterval = setInterval(function () {
    var elapsedTime = Date.now() - StartTime;
    document.querySelector(".timer").innerHTML = (elapsedTime / 1000).toFixed(3);
  }, 1);

}

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

function gameOver() {

  if (!gLives) {
    document.querySelector('.icon').innerText = DEAD

  }

  console.log('Game Over')
  clearInterval(gInterval)
  gGame.isOn = false
}

function renderLives() {

  var strLives = ''

  for (var i = 0; i < gLives; i++) {
    strLives += '❤'
  }
  document.querySelector('.lives').innerText = strLives

}

function renderHints() {

  var strHints = ''

  for (var i = 0; i < gHints; i++) {
    strHints += HINT_OFF
  }
  document.querySelector('.hints').innerHTML = strHints

}

function onHintClick(elHint) {
  
  if (gIsHintOn) return
  
  elHint.src = "img/hint_on.jpg";

  elHint.removeAttribute("onclick");

  gIsHintOn = elHint
  

}

function showHint(rowIdx,colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {

      if (j < 0 || j >= gBoard[0].length) continue

      if (gBoard[i][j].isShown) continue

      

      gBoard[i][j].isTempShow = true

    }
  }
  renderBoard()
}

function hideHint(rowIdx, colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= gBoard[0].length) continue;

      if (gBoard[i][j].isShown) continue;

      gBoard[i][j].isTempShow = false
    }
  }
  renderBoard();
}













