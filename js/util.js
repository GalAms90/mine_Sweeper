'use strict'

function createMat(SIZE) {
  var mat = []

  for (var i = 0; i < SIZE; i++) {
    mat[i] = []
    for (var j = 0; j < SIZE; j++) {
      mat[i][j] = ''
    }
  }
  return mat
}

function isFirstMove() {
  return !gGame.shownCount && !gGame.markedCount && !gGame.secsPassed
}

function countNegs(rowIdx, colIdx, board) {
  var count = 0
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i === rowIdx && j === colIdx) continue
      if (j < 0 || j >= board[0].length) continue


      if (board[i][j].isMine) count++
    }
  }
  return count
}

function setMinesNegsCount(board) {

  var res = []

  for (var i = 0; i < board.length; i++) {

    for (var j = 0; j < board[0].length; j++) {
      var currCount = countNegs(i, j, board)
      res.push(currCount)
    }
  }
  return res
}

function startStopWatch() {

  var StartTime = Date.now();

  gInterval = setInterval(function () {
    var elapsedTime = Date.now() - StartTime;
    document.querySelector(".timer").innerHTML = (elapsedTime / 1000).toFixed(3);
  }, 1);

}

function getRandomPos() {
  var emptyCells = countEmptyCells(gBoard)
  var randPos = getRandomInt(0, emptyCells.length - 1)
  var randomLocation = emptyCells[randPos]
  emptyCells.splice(1, randPos)

  return randomLocation

}

function countEmptyCells(board) {
  var res = []
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if (!board[i][j].isMine && !board[i][j].minesAroundCount)  ///
        res.push({ i, j })
    }
  }
  if (!res) return null
  return res
}

function getClassName(i, j) {
  return `cell-${i}-${j}`
}

function getPos(str) {
  var array = str.split('-')
  array.shift()
  return array
}

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}