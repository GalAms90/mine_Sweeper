'use strict'

function placeMines(board) {

  for (var i = 0; i < gLevel.MINES; i++) {

    var randomLocation = getRandomPos()
    board[randomLocation.i][randomLocation.j].isMine = true

  }

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
      gBoard[i][j].minesAroundCount = countNegs(i, j, board)
    }
  }
  return res
}