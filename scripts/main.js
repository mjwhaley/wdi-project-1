console.log('Running')
const gameAreaWidth = 1000
const gameAreaHeight = 800
const gameAreaBlockWidth = Math.round(gameAreaWidth/12)
const gameAreaBlockHeight = Math.round(gameAreaHeight/11)
console.log(gameAreaBlockWidth)
console.log(gameAreaBlockHeight)



function createGrid(x, y) {
  for (var rows = 0; rows < x; rows++) {
    for (var columns = 0; columns < y; columns++) {
      $('.container').append('<div class="grid"></div>')
    }
  }
  $('.grid').width(83)
  $('.grid').height(73)
}

$(document).ready(() => {
  createGrid(12, 11)

})
