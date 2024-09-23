// Const
const MODES = {
  DRAW: 'draw',
  ERASE: 'erase',
  FILL: 'fill',
  RECT: 'rect',
  CIRCLE: 'circle',
  LINE: 'line',
  TEXT: 'text',
  PICKER: 'picker',
  RECTANGLE: 'rectangle'
}

// Elements
const $canvas = document.querySelector('#canvas')
const $colorPicker = document.querySelector('#color-picker')

const $clearBtn = document.querySelector('#clear-btn')
const $rectangleBtn = document.querySelector('#rectangle-btn')
const $drawBtn = document.querySelector('#draw-btn')
const $eraseBtn = document.querySelector('#erase-btn')
const $pickerBtn = document.querySelector('#picker-btn')

const ctx = $canvas.getContext('2d')

// State
let isDrawing = false
let isShiftPressed = false
let startx, starty
let lastX = 0
let lastY = 0
let mode = MODES.DRAW

let imageData

// Events
$canvas.addEventListener('mousedown', startDrawing)
$canvas.addEventListener('mousemove', draw)
$canvas.addEventListener('mouseup', stopDrawing)
$canvas.addEventListener('mouseleave', stopDrawing)

$colorPicker.addEventListener('change', setColor)
$clearBtn.addEventListener('click', clearCanvas)

document.addEventListener('keydown', handleKeyDown)
document.addEventListener('keyup', handleKeyUp)

$rectangleBtn.addEventListener('click', () => {
  setMode(MODES.RECTANGLE)
})

$drawBtn.addEventListener('click', () => {
  setMode(MODES.DRAW)
})

$eraseBtn.addEventListener('click', () => {
  setMode(MODES.ERASE)
})

$pickerBtn.addEventListener('click', () => {
  setMode(MODES.PICKER)
})

// Methods
function startDrawing(e) {
  isDrawing = true
  lastX = e.offsetX
  lastY = e.offsetY
  startx = lastX
  starty = lastY

  imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
}

function draw(e) {
  if (!isDrawing) return

  const { offsetX, offsetY } = e

  if (mode === MODES.DRAW || mode === MODES.ERASE) {
    // comenzar a dibujar
    ctx.beginPath()
    // mover el trazado a las coordenadas del ratón
    ctx.moveTo(lastX, lastY)
    // Dibujar
    ctx.lineTo(offsetX, offsetY)
    ctx.stroke()
    // Actualizar el último punto
    lastX = offsetX
    lastY = offsetY
    return
  }
  if (mode === MODES.RECTANGLE) {
    ctx.putImageData(imageData, 0, 0)

    let width = offsetX - startx
    let height = offsetY - starty

    if (isShiftPressed) {
      const sideLength = Math.min(Math.abs(width), Math.abs(height))

      width = width > 0 ? sideLength : -sideLength
      height = height > 0 ? sideLength : -sideLength
    }

    ctx.beginPath()
    ctx.rect(startx, starty, width, height)
    ctx.stroke()
  }
}
function stopDrawing() {
  isDrawing = false
  $canvas.style.cursor = 'default'
}

function setColor() {
  ctx.strokeStyle = $colorPicker.value
}

function clearCanvas() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

async function setMode(newMode) {
  let previousMode = mode
  mode = newMode
  document.querySelector('button.active')?.classList.remove('active')

  if (mode === MODES.DRAW) {
    $drawBtn.classList.add('active')
    ctx.globalCompositeOperation = 'source-over'
    ctx.lineWidth = 2
    return
  }

  if (mode === MODES.RECTANGLE) {
    $rectangleBtn.classList.add('active')
    ctx.canvas.style.cursor = 'crosshair'
    ctx.globalCompositeOperation = 'source-over'
    ctx.lineWidth = 2
    return
  }

  if (mode === MODES.ERASE) {
    $eraseBtn.classList.add('active')
    ctx.canvas.style.cursor = 'url("./cursors/erase.png") 0 24, auto'
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineWidth = 20
    return
  }

  if (mode === MODES.PICKER) {
    $pickerBtn.classList.add('active')
    const eyeDropper = new window.EyeDropper()

    try {
      const result = await eyeDropper.open()
      const { sRGBHex } = result
      ctx.strokeStyle = sRGBHex
      $colorPicker.value = sRGBHex
      setMode(previousMode)
    } catch (e) {
      // si ha habido un error o el usuario no ha recuperado ningún color
    }
  }
}

function handleKeyDown(e) {
  if (e.key === 'Shift') {
    isShiftPressed = true
  }
}

function handleKeyUp({ key }) {
  if (key === 'Shift') {
    isShiftPressed = false
  }
}

// init
setMode(MODES.DRAW)

// Hide not supported picker
if (typeof window.EyeDropper !== 'undefined') {
  $pickerBtn.removeAttribute('disabled')
}
