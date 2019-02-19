//Varibles
const gameAreaWidth = 1000
const gameAreaHeight = 800
const gameAreaBlockWidth = Math.round(gameAreaWidth/12)
const gameAreaBlockHeight = Math.round(gameAreaHeight/11)
const gridVertical = ['v1', 'v2','v3', 'v4','v5', 'v6','v7', 'v8','v9', 'v10', 'v11', 'v12']
const gridHorizontal = ['h1', 'h2','h3', 'h4','h5', 'h6','h7', 'h8','h9', 'h10', 'h11']
let playerShipLocation = null
let motherShipLocation = 'v1'
let alienShipSpeed = 1000
const motherShipTiming = 10000
console.log(`Grid Width = ${gameAreaBlockWidth}`)
console.log(`Grid Height = ${gameAreaBlockHeight}`)

//Functions
function startGame () {
  $('li.play').click(function() {
    $('div.container').removeClass('containerBackground')
    playGame()
  })
}
function playGame () {
  createGrid(11, 12)
  playerMove()
  playerFire()
  placePlayerShip()
  placeAlienShips()
  playerShipLocator()
  placeMotherShip()
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

function playerMove () {
  $(document).keydown(function(e) {
    switch(e.which) {
      case 37: // left
        console.log('Moved Left')
        playerShipMovement(ShipMovementValue(-1), playerShipLocation)
        break
      case 39: // right
        console.log('Moved Right')
        playerShipMovement(ShipMovementValue(1), playerShipLocation)
        break
      // case 32: // fire
      //   console.log('Fired Bullet')
      //   break
      default: return
    }
    e.preventDefault()
  })
}
function playerFire () {
  $(document).keydown(function(e) {
    switch(e.which) {
      case 32: // fire
        console.log('Fired Bullet')
        break
      default: return
    }
    e.preventDefault()
  })
}


function placePlayerShip () {
  $('.gameGrid').last().addClass('playerShip')
}

function placeAlienShips () {

}

function placeMotherShip () {
  $(`div.h1.${motherShipLocation}`).addClass('motherShip')
  setInterval(function(){
    if (motherShipLocation === 'v13') {
      clearInterval()
    } else {
      const numberOnly = parseInt(motherShipLocation.replace('v', ''))
      const newLocation = numberOnly + 1
      const newLocationV = 'v' + newLocation
      motherShipMovement(newLocationV, motherShipLocation)
      console.log(motherShipLocation)
    }
  }
  , alienShipSpeed)
  motherShipLocation = 'v1'
}

function playerShipLocator () {
  const shipFinder = $('.container').find('div.playerShip')
  playerShipLocation = shipFinder[0].classList[1]
}

function playerShipMovement (newLocation, oldLocation) {
  switch (newLocation === oldLocation) {
    case false:
      $(`div.h11.${newLocation}`).addClass('playerShip')
      $(`div.h11.${oldLocation}`).removeClass('playerShip')
      playerShipLocation = newLocation
      break
    default:
  }
}
function motherShipMovement (newLocation, oldLocation) {
  switch (newLocation === oldLocation) {
    case false:
      $(`div.h1.${newLocation}`).addClass('motherShip')
      $(`div.h1.${oldLocation}`).removeClass('motherShip')
      motherShipLocation = newLocation
      break
    default:
  }
}


function ShipMovementValue (movement) {
  const numberOnly = parseInt(playerShipLocation.replace('v', ''))
  console.log(movement)
  const newLocation = numberOnly + movement
  if (newLocation > 12) {
    return 'v12'
  } else if  (newLocation < 1) {
    return 'v1'
  } else {
    return 'v' + newLocation
  }
}


$(document).ready(() => {
  startGame()
})
