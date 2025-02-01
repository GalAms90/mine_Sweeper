'use strict'

const MINE = '💣'
const MARK = '🚩'

const HINT_ON = `<img src="img/hint_on.jpg" alt="hint-on">`
const HINT_OFF = `<img onclick="onHintClick(this)" src="img/hint_off.jpg" alt="hint-off">`

const SMILE = '😊'
const BOOM = '🤯'
const WIN = '😎'
const DEAD = '💀'

var gGame
var gBoard
var gIsFirstClick

// BOUNS FEATURES
var gLives
var gHints
var gIsHintOn

var gLevel = {
  SIZE: 4,
  MINES: 2
}

// variable global timer

var gInterval

function onInit() {

  document.querySelector('.icon').innerText = SMILE
  document.querySelector('.timer').innerText = '00:000'
  clearInterval(gInterval)


  gIsFirstClick = false
  gLives = 3
  gHints = 3
  gIsHintOn = false

  gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
  }
  gBoard = buildBoard()
  populateBoard(gBoard)

  renderBoard()
  renderLives()
  renderHints()
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
        isMarked: false,
        isTempShow: false
      }
    }
  }
}

function renderBoard() {
  var strHTML = ''

  for (var i = 0; i < gBoard.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < gBoard[0].length; j++) {

      const currCell = gBoard[i][j];


      var content = '';

      if (currCell.isMarked) {
        content = MARK;
      } else if (currCell.isShown || currCell.isTempShow) {
        content = currCell.isMine ? MINE : currCell.minesAroundCount || ''
      }

      var cellClass = currCell.isShown || currCell.isTempShow ? '' : 'hidden'

      if (currCell.isMarked) cellClass = ''

      if (currCell.isMine && currCell.isShown) {
        cellClass += ' boom'
      }

      strHTML += `<td
                   oncontextmenu="onCellMarked(${i}, ${j}); return false;"
                   class="cell-${i}-${j} ${cellClass}"
                   data-location="${i},${j}"
                   onclick="onCellClicked(this, ${i}, ${j})">
                   ${content}
                   </td>`;
    }
    document.querySelector('.board').innerHTML = strHTML
  }
}

function onCellClicked(elCell, i, j) {

  if (!gGame.isOn || gBoard[i][j].isMarked || gBoard[i][j].isShown) return /////////

  if (!gIsFirstClick) {

    gIsFirstClick = { i, j }
    startStopWatch()
    placeMines(gBoard)
    setMinesNegsCount(gBoard)

  }

  if (gIsHintOn) {
    showHint(i,j)
    setTimeout(() => {
      hideHint(i,j)

      gIsHintOn.style.display = 'none'
      gIsHintOn = false
    }, 1000);
    return
  }

  gBoard[i][j].isShown = true
  gGame.shownCount++

  if (isGamerWin()) {
    document.querySelector('.icon').innerText = WIN
    gameOver()
  }



  if (gBoard[i][j].isMine) {

    document.querySelector('.icon').innerText = BOOM

    gLives--
    renderLives()

    if (isGamerWin()) {
      document.querySelector('.icon').innerText = WIN
      gameOver()
    }

    setTimeout(() => {
      if (gLives) document.querySelector('.icon').innerText = SMILE

      renderBoard()
    }, 2000);


    if (!gLives) {

      gameOver()
    }

  } else if (!gBoard[i][j].minesAroundCount) {
    expandShown(gBoard, i, j)
  }


  renderBoard()
}

function expandShown(board, rowIdx, colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {

      if (j < 0 || j >= board[0].length) continue

      if (board[i][j].isMine || board[i][j].isShown || board[i][j].isMarked) continue

      if (i === rowIdx && j === colIdx) continue

      board[i][j].isShown = true
      gGame.shownCount++

      if (isGamerWin()) {
        document.querySelector('.icon').innerText = WIN
        gameOver()
      }

      if (!board[i][j].minesAroundCount) expandShown(board, i, j)


    }
  }
}

function onCellMarked(i, j) {
  if (!gGame.isOn || gBoard[i][j].isShown) return

  gBoard[i][j].isMarked = !gBoard[i][j].isMarked

  if (gBoard[i][j].isMarked) {
    gGame.markedCount++
  } else {
    gGame.markedCount--
  }

  if (isGamerWin()) {
    document.querySelector('.icon').innerText = WIN
    gameOver()
  }

  renderBoard()

}

function setLevel(elBtn) {

  if (elBtn.innerText === 'Beginner') {
    gLevel.SIZE = 4
    gLevel.MINES = 2
  } else if (elBtn.innerText === 'Intermediate') {
    gLevel.SIZE = 8
    gLevel.MINES = 14
  } else if (elBtn.innerText === 'Expert') {
    gLevel.SIZE = 12
    gLevel.MINES = 32
  }

  clearInterval(gInterval)

  onInit()
}