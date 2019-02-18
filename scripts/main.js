//Varibles
const gameAreaWidth = 1000
const gameAreaHeight = 800
const gameAreaBlockWidth = Math.round(gameAreaWidth/12)
const gameAreaBlockHeight = Math.round(gameAreaHeight/11)
const gridVertical = ['v1', 'v2','v3', 'v4','v5', 'v6','v7', 'v8','v9', 'v10', 'v11', 'v12']
const gridHorizontal = ['h1', 'h2','h3', 'h4','h5', 'h6','h7', 'h8','h9', 'h10', 'h11']

console.log(`Grid Width = ${gameAreaBlockWidth}`)
console.log(`Grid Height = ${gameAreaBlockHeight}`)

//Functions
function playGame () {
  createGrid(11, 12)
  playerKeys()
}

function createGrid(x, y) {
  for (let rows = 0; rows < x; rows++) {
    for (let columns = 0; columns < y; columns++) {
      $('.container').append(`<div class="gameGrid ${gridVertical[columns]} ${gridHorizontal[rows]}"></div>`)
    }
  }
  $('.gameGrid').width(gameAreaBlockWidth)
  $('.gameGrid').height(gameAreaBlockHeight)
}

function playerKeys () {
  $(document).keydown(function(e) {
    switch(e.which) {
      case 37: // left
        console.log('Moved Left')
        break
      case 39: // right
        console.log('Moved Right')
        break
      case 32: // down
        console.log('Fired Bullet')
        break
      default: return
    }
    e.preventDefault()
  })
}
$(document).ready(() => {
  playGame()
})
