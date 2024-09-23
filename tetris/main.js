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

const pieces = [
    {
        position: { x: 5, y: 5 },
        shape: [
            [1, 1],
            [1, 1]
        ]
    }
]

// Game loop
let dropCounter = 0
let lastTime = 0
function update(time = 0) {
    const deltaTime = time - lastTime
    lastTime = time

    dropCounter += deltaTime

    if (dropCounter > 1000) {
        pieces[0].position.y++
        dropCounter = 0
        if (checkCollision(pieces[0])) {
            pieces[0].position.y--
            solidifyPiece(pieces[0])
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

    pieces[0].shape.forEach((row, i) => {
        row.forEach((block, j) => {
            if (block) {
                ctx.fillStyle = '#00f'
                ctx.fillRect(pieces[0].position.x + j, pieces[0].position.y + i, 1, 1)
            }
        })
    })
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        pieces[0].position.y--
    }
    if (e.key === 'ArrowDown') {
        pieces[0].position.y++
        if (checkCollision(pieces[0])) {
            pieces[0].position.y--
            solidifyPiece(pieces[0])
            removePiece()
        }
    }
    if (e.key === 'ArrowLeft') {
        pieces[0].position.x--
        if (checkCollision(pieces[0])) {
            pieces[0].position.x++
        }
    }
    if (e.key === 'ArrowRight') {
        pieces[0].position.x++
        if (checkCollision(pieces[0])) {
            pieces[0].position.x--
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
    piece.position.x = 0
    piece.position.y = 0
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

