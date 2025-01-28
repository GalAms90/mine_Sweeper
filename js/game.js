'use strict'

const MINE = '*'
const MARK = '⛳'


var gBoard
var gLevel
var gGame
var gMIneNegCount
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
  gMIneNegCount = setMinesNegsCount(gBoard)
  renderBoard()
  // console.log(gMIneCount)
}

function buildBoard() {
  const board = createMat(gLevel.SIZE)
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
  var emptyCells = countEmptyCells(gBoard)
  var randPos = getRandomInt(0, emptyCells.length - 1)
  var randomLocation = emptyCells[randPos]
  emptyCells.splice(1, randPos)

  return randomLocation

}

function placeMines(board) {

  for(var i = 0; i < gLevel.MINES; i++) {

    var randomLocation =  getRandomPos()
    board[randomLocation.i][randomLocation.j].isMine = true

  }
  
}

function countEmptyCells(board) {
  var res = []
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if (!board[i][j].isMine && !board[i][j].minesAroundCount)
        res.push({ i, j })
    }
  }
  if (!res) return null
  return res
}

function onCellMarked(elCell) {
  if (!gIsGameOn) return


  var position = getPos(elCell.classList[0])
  var currPos = gBoard[position[0]][position[1]]

  if (!currPos.isMarked) { // if cell is not marked, mark it
 
    gGame.markedCount++
    currPos.isMarked = true
    elCell.innerText = MARK
    elCell.classList.remove('hidden')
    if (isGamerWin()) {
      console.log('You Win')
      gameOver()
    }

  } else { // else make the cell Hidden
    gGame.markedCount--
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