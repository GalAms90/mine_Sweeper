'use strict'

const MINE = '*'
const MARK = '⛳'

var SIZE = 4
var gBoard
var gLevel
var gGame
var gMIneCount
var gIsGameOn

function onInit() {
  gIsGameOn = true
  gLevel = {
    SIZE: 4,
    MINES: 2
  }
  gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
  }
  gBoard = buildBoard()
  console.table(gBoard)
  populateBoard(gBoard)
  gMIneCount = setMinesNegsCount(gBoard)
  renderBoard()
  // console.log(gMIneCount)
}

function buildBoard() {
  const board = createMat(SIZE)
  return board
}

function populateBoard(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
      }
    }
  }
  // placeMines(board)
  board[0][0].isMine = true
  board[3][3].isMine = true
}

function renderBoard() {
  var strHTML = ''

  for (var i = 0; i < gBoard.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < gBoard[0].length; j++) {

      var astr = gBoard[i][j].isMine ? MINE : ''

      if (astr) {
        strHTML += `<td oncontextmenu="onCellMarked(this); return false;" class = "cell-${i}-${j} hidden" onclick="onCellClicked(this, ${i}, ${j})">${astr}</td>`
      } else {


        var negsCount = countNegs(i, j, gBoard) ? countNegs(i, j, gBoard) : ''

        gBoard[i][j].minesAroundCount = countNegs(i, j, gBoard)



        strHTML += `<td oncontextmenu="onCellMarked(this); return false;" class = "cell-${i}-${j} hidden" onclick="onCellClicked(this, ${i}, ${j})">${negsCount}</td>`

      }
    }
    strHTML += `</tr>`
  }
  document.querySelector('.board').innerHTML = strHTML
}

function getRandomPos() {
  var randPos_i = getRandomInt(0, SIZE - 1)
  var randPos_j = getRandomInt(0, SIZE - 1)
  var drawnPos = gBoard[randPos_i][randPos_j]
  return drawnPos

}

function placeMines(board) {
  for (var i = 0; i < gLevel.MINES; i++) {
    var currPos_i = getRandomInt(0, SIZE - 1)
    var currPos_j = getRandomInt(0, SIZE - 1)
    if (board[currPos_i][currPos_j].isMine) {
      currPos_i = getRandomInt(0, SIZE - 1)
      currPos_j = getRandomInt(0, SIZE - 1)
    }
    board[currPos_i][currPos_j].isMine = true
  }
}

// function countEmptyCells(gBoard) {
// 	var res = []
// 	for (var i = 0; i < gBoard.length; i++) {
// 		for (var j = 0; j < gBoard[0].length; j++) {
// 			if (gBoard[i][j].type === FLOOR && gBoard[i][j].gameElement === null)
// 				res.push({ i, j })
// 		}
// 	}
// 	if (!res) return null
// 	return res
// }

function onCellMarked(elCell) {
  if (!gIsGameOn) return


  var position = getPos(elCell.classList[0])
  var currPos = gBoard[position[0]][position[1]]

  if (!currPos.isMarked) { // if cell is not marked, mark it

    currPos.isMarked = true
    elCell.innerText = MARK
    elCell.classList.remove('hidden')

  } else { // else make the cell Hidden

    elCell.classList.add('hidden')
    currPos.isMarked = false

    if (currPos.isMine) {// if the cell was a mine, put a mine back

      elCell.innerText = MINE

    } else {

      if (!currPos.minesAroundCount) {
        elCell.innerText = ''

      } else {
        elCell.innerText = currPos.minesAroundCount
      }
    }
  }
}