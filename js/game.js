'use strict'

const MINE = '*'
const MARK = '⛳'


var gBoard
var gLevel
var gGame
var gMIneNegCount
var gIsGameOn

// variable global timer
var gInterval

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

      var cell = gBoard[i][j]
      var content = cell.isMine ? MINE : countNegs(i, j, gBoard)

      if (!content) {
        content = ''
      }

      strHTML += `<td
                   oncontextmenu="onCellMarked(this); return false;"
                   class = "cell-${i}-${j} hidden"
                   onclick="onCellClicked(this, ${i}, ${j})">
                   ${content}
                   </td>`
    }
    strHTML += `</tr>`
  }
  document.querySelector('.board').innerHTML = strHTML
}

function placeMines(board) {

  for (var i = 0; i < gLevel.MINES; i++) {

    var randomLocation = getRandomPos()
    board[randomLocation.i][randomLocation.j].isMine = true

  }

}

function onCellClicked(elCell, i, j) {

  if (!gIsGameOn || gBoard[i][j].isMarked || gBoard[i][j].isShown) return /////////

  if (isFirstMove()) startStopWatch()


  if (isGamerWin()) {
    console.log('You Win')
    gameOver()
  }

  elCell.classList.remove('hidden')
  gBoard[i][j].isShown = true
  gGame.shownCount++
  // console.log(elCell)

  if (elCell.innerText) {
    if (elCell.innerText === MINE) {
      gameOver()
    }
  } else {
    expandShown(gBoard, elCell, i, j)
  }
}

function onCellMarked(elCell) {
  if (!gIsGameOn) return

  var currPos = getgBoardLocation(elCell)
  // console.log(currPos)

  if (currPos.isShown) return

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

    if (isGamerWin()) {

      console.log('You Win')
      gameOver()
    }

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

function expandShown(board, cellClass, rowIdx, colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {

      if (j < 0 || j >= board[0].length) continue
      
      if (board[i][j].isMine || board[i][j].isShown || board[i][j].isMarked) continue

      if (i === rowIdx && j === colIdx) continue



      
      var cellClass = getClassName(i, j)
      
      var elCell = document.querySelector(`.${cellClass}`)
      
      elCell.classList.remove('hidden')
      board[i][j].isShown = true
      gGame.shownCount++

      if (isGamerWin()) {
        console.log('You Win')
        gameOver()
      }

    }
  }
}

function getgBoardLocation(elCell) {
  var position = getPos(elCell.classList[0])
  return gBoard[position[0]][position[1]]
}

function gameOver() {
  console.log('Game Over')
  gIsGameOn = false
  clearInterval(gInterval)
}

function isGamerWin() {
  return gLevel.MINES === gGame.markedCount && (gGame.shownCount === (gLevel.SIZE ** 2) - gLevel.MINES)
}

