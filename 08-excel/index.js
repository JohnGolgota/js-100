const $ = el => document.querySelector(el)
const $$ = el => document.querySelectorAll(el)

const $table = $('table')
const $thead = $('thead')
const $tbody = $('tbody')

const ROWS = 10
const COLS = 10

const FIRST_CHAR_CODE = 65

const range = length => Array.from({ length }, (_, i) => i)
const getColumn = i => String.fromCharCode(FIRST_CHAR_CODE + i)

let selectedColumn = null

let STATE = range(COLS).map(i => range(ROWS).map(() => ({ computedValue: 0, value: '' })))

function updateCell({ x, y, value }) {
  const newState = structuredClone(STATE)
  const constants = generateCellsConstants(newState)

  const cell = newState[x][y]
  const computedValue = computeValue(value, constants)

  cell.computedValue = computedValue // span
  cell.value = value // input

  newState[x][y] = cell

  computeAllCells(newState, generateCellsConstants(newState))

  STATE = newState

  renderSpreadSheet()
}

function computeAllCells(cells, constants) {
  cells.forEach((rows, x) => {
    rows.forEach((cell, y) => {
      const computedValue = computeValue(cell.value, constants)
      cell.computedValue = computedValue
    })
  })
}

function computeValue(value, constants) {
  if (typeof value === "number") return value
  if (typeof value === "string" && !value.startsWith('=')) return value

  const formula = value.substring(1)
  let computedValue
  try {
    computedValue = eval(`(() => {
${constants}
return ${formula}
})()`)
  } catch (e) {
    computedValue = `Error: ${e.message}`
  }
  return computedValue
}

function generateCellsConstants(cells) {
  return cells.map((rows, x) => {
    return rows.map((cell, y) => {
      const letter = getColumn(x)
      const cellId = `${letter}${y + 1}`
      return `const ${cellId} = ${cell.computedValue};`
    }).join('\n')
  }).join('\n')
}


const renderSpreadSheet = () => {

  const headerHTML = `<tr>
<th></th>
${range(COLS).map(i => `<th>${getColumn(i)}</th>`).join('')}
</tr>`

  $thead.innerHTML = headerHTML

  const bodyHTML = range(ROWS).map(row => {
    return `<tr>
<td>${row + 1}</td>
${range(COLS).map(column => `<td data-x="${column}" data-y="${row}">
<span>${STATE[column][row].computedValue}</span>
<input type="text" value="${STATE[column][row].value}">
</td>`).join('')}
</tr>`
  }).join('')

  $tbody.innerHTML = bodyHTML

}

$tbody.addEventListener('click', e => {
  const $td = e.target.closest('td')
  if (!$td) return

  $$('.selected').forEach(el => el.classList.remove('selected'))
  selectedColumn = null

  const { x, y } = $td.dataset
  const $input = $td.querySelector('input')
  const $span = $td.querySelector('span')

  // $td.classList.toggle('active')
  const end = $input.value.length
  $input.setSelectionRange(end, end)
  $input.focus()

  $input.addEventListener('keydown', e => {
    if (e.key === 'Enter') $input.blur()
  })

  $input.addEventListener('blur', () => {
    console.log({ value: $input.value, state: STATE[x][y] })
    if ($input.value === STATE[x][y].value) return

    updateCell({ x, y, value: $input.value })
  }, { once: true })
})

$thead.addEventListener('click', e => {
  const $th = e.target.closest('th')
  if (!$th) return;

  // const { x } = $th.dataset
  const x = [...$th.parentNode.children].indexOf($th)
  if (x <= 0) return

  selectedColumn = x - 1

  $$('.selected').forEach(el => el.classList.remove('selected'))

  $th.classList.add('selected')
  $$(`tr td:nth-child(${x + 1})`).forEach(el => el.classList.add('selected'))
})

document.addEventListener('keydown', e => {
  if (e.key === 'Backspace' && selectedColumn !== null) {
    range(ROWS).forEach(row => {
      updateCell({ x: selectedColumn, y: row, value: '' })
    })
    renderSpreadSheet()
  }
})

document.addEventListener('copy', e => {
  if (selectedColumn !== null) {
    const columnValues = range(ROWS).map(row => STATE[selectedColumn][row].computedValue)

    e.clipboardData.setData('text/plain', columnValues.join('\n'))
    e.preventDefault()
  }
})

renderSpreadSheet()