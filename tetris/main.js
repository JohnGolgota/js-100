import './style.css'

const $canvas = document.querySelector('canvas')

const ctx = $canvas.getContext('2d')

const BLOCK_SIZE = 20
const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20

$canvas.width = BLOCK_SIZE * BOARD_WIDTH
$canvas.height = BLOCK_SIZE * BOARD_HEIGHT

ctx.scale(BLOCK_SIZE, BLOCK_SIZE)

// Board manipulation
const board = []
for (let i = 0; i < BOARD_HEIGHT; i++) {
  board[i] = []
  for (let j = 0; j < BOARD_WIDTH; j++) {
    board[i][j] = 0
  }
}

const PIECES = [
  [
    [1, 1, 1, 1]
  ],
  [
    [0, 1, 1],
    [1, 1, 0]
  ],
  [
    [1, 1, 0],
    [0, 1, 1]
  ],
  [
    [0, 1, 0],
    [1, 1, 1]
  ],
  [
    [0, 0, 1],
    [1, 1, 1]
  ],
  [
    [1, 0, 0],
    [1, 1, 1]
  ],
]

const piece = {
  position: { x: Math.floor(BOARD_WIDTH / 2) - 2, y: 0 },
  shape: PIECES[Math.floor(Math.random() * PIECES.length)]
}

// Game loop
let dropCounter = 0
let lastTime = 0
function update(time = 0) {
  const deltaTime = time - lastTime
  lastTime = time

  dropCounter += deltaTime

  if (dropCounter > 1000) {
    piece.position.y++
    dropCounter = 0
    if (checkCollision(piece)) {
      piece.position.y--
      solidifyPiece(piece)
      removePiece()
    }
  }

  draw()
  window.requestAnimationFrame(update)
}

function draw() {
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, $canvas.width, $canvas.height)

  board.forEach((row, i) => {
    row.forEach((block, j) => {
      if (block) {
        ctx.fillStyle = '#f00'
        ctx.fillRect(j, i, 1, 1)
      }
    })
  })

  piece.shape.forEach((row, i) => {
    row.forEach((block, j) => {
      if (block) {
        ctx.fillStyle = '#00f'
        ctx.fillRect(piece.position.x + j, piece.position.y + i, 1, 1)
      }
    })
  })
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') {
    const rotated = []
    for (let i = 0; i < piece.shape[0].length; i++) {
      const row = []
      for (let j = piece.shape.length - 1; j >= 0; j--) {
        row.push(piece.shape[j][i])
      }
      rotated.push(row)
    }
    const prevShape = piece.shape
    piece.shape = rotated
    if (checkCollision(piece)) {
      piece.shape = prevShape
    }
  }
  if (e.key === 'ArrowDown') {
    piece.position.y++
    if (checkCollision(piece)) {
      piece.position.y--
      solidifyPiece(piece)
      removePiece()
    }
  }
  if (e.key === 'ArrowLeft') {
    piece.position.x--
    if (checkCollision(piece)) {
      piece.position.x++
    }
  }
  if (e.key === 'ArrowRight') {
    piece.position.x++
    if (checkCollision(piece)) {
      piece.position.x--
    }
  }
})

function checkCollision(piece) {
  return piece.shape.find((row, y) => {
    return row.find((block, x) => {
      return (
        block != 0 &&
        board[piece.position.y + y]?.[piece.position.x + x] != 0
      )
    })
  })
}

function solidifyPiece(piece) {
  piece.shape.forEach((row, y) => {
    row.forEach((block, x) => {
      if (block) {
        board[piece.position.y + y][piece.position.x + x] = 1
      }
    })
  })

  piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)]

  piece.position.x = Math.floor(BOARD_WIDTH / 2) - 2
  piece.position.y = 0

  if (checkCollision(piece)) {
    window.alert('Game Over')
    board.forEach(row => row.fill(0))
  }
}

function removePiece(piece) {
  const rowToRemove = []
  board.forEach((row, y) => {
    if (row.every(block => block == 1)) {
      rowToRemove.push(y)
    }
  })

  rowToRemove.forEach(y => {
    board.splice(y, 1)
    const newRow = Array(BOARD_WIDTH).fill(0)
    board.unshift(newRow)
  })
}

update()

