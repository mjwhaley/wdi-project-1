//Varibles
const gameAreaWidth = 984
const gameAreaHeight = 792
const gameAreaBlockWidth = Math.round(gameAreaWidth/24)
const gameAreaBlockHeight = Math.round(gameAreaHeight/22)
const gridVertical = ['v1','v2','v3','v4','v5','v6','v7','v8','v9','v10','v11','v12','v13','v14','v15','v16','v17','v18','v19','v20','v21','v22','v23','v24']
const gridHorizontal = ['h1','h2','h3','h4','h5','h6','h7','h8','h9','h10','h11','h12','h13','h14','h15','h16','h17','h18','h19','h20','h21','h22']
let playerShipLocation = null
let motherShipLocation = 'v1'
let motherShipMoverInterval = null
let motherShipFrequencyInterval = null
const alienShipSpeed = 500
const motherShipStartDelay = 2000
let motherShipStartDelayTimeout = null
const motherShipFrequency = 5000
let aliens = []
let gamePlaying = false
let playerScore = 0
let bulletInterval = null
const bulletSpeed =20

//Functions
function startGame () {
  $('li.play').click(function() {
    $('div.container').removeClass('containerBackground')
    gamePlaying = true
    playGame()
  })
}
function quitGame () {
  $('li.quit').click(function() {
    clearInterval(motherShipMoverInterval)
    clearTimeout(motherShipFrequencyInterval)
    clearTimeout(motherShipStartDelayTimeout)
    stopPlayeMovement()
    gamePlaying = false

    //Need to add in the removing of the classes to show the ships.
  })
}
function lostGame () {
  clearInterval(motherShipMoverInterval)
  clearTimeout(motherShipFrequencyInterval)
  clearTimeout(motherShipStartDelayTimeout)
  stopPlayeMovement()
  alert('Game Over Dude')
  gamePlaying = false
  //Need to add in the removing of the classes to show the ships.
}

function playGame () {
  createGrid(22, 24)
  navRemove()
  playerMove()
  playerFire()
  placePlayerShip()
  playerShipLocator()

  motherShipStartDelayTimeout = setTimeout(launchMotherShip, motherShipStartDelay)
  aliens = [new Alien(3, 2, 'johnny5_1', 50),
    new Alien(5, 2, 'johnny5_2', 50),
    new Alien(7, 2, 'johnny5_3', 50),
    new Alien(9, 2, 'johnny5_4', 50),
    new Alien(11, 2, 'johnny5_5', 50),
    new Alien(13, 2, 'johnny5_6', 50),
    new Alien(15, 2, 'johnny5_7', 50),
    new Alien(17, 2, 'johnny5_8', 50),
    new Alien(3, 4, 'walle_1', 40),
    new Alien(5, 4, 'walle_2', 40),
    new Alien(7, 4, 'walle_3', 40),
    new Alien(9, 4, 'walle_4', 40),
    new Alien(11, 4, 'walle_5', 40),
    new Alien(13, 4, 'walle_6', 40),
    new Alien(15, 4, 'walle_7', 40),
    new Alien(17, 4, 'walle_8', 40),
    new Alien(3, 6, 'c3po_1', 30),
    new Alien(5, 6, 'c3po_2', 30),
    new Alien(7, 6, 'c3po_3', 30),
    new Alien(9, 6, 'c3po_4', 30),
    new Alien(11, 6, 'c3po_5', 30),
    new Alien(13, 6, 'c3po_6', 30),
    new Alien(15, 6, 'c3po_7', 30),
    new Alien(17, 6, 'c3po_8', 30),
    new Alien(3, 8, 'r2d2_1', 20),
    new Alien(5, 8, 'r2d2_2', 20),
    new Alien(7, 8, 'r2d2_3', 20),
    new Alien(9, 8, 'r2d2_4', 20),
    new Alien(11, 8, 'r2d2_5', 20),
    new Alien(13, 8, 'r2d2_6', 20),
    new Alien(15, 8, 'r2d2_7', 20),
    new Alien(17, 8, 'r2d2_8', 20),
    new Alien(3, 10, 'bender_1', 10),
    new Alien(5, 10, 'bender_2', 10),
    new Alien(7, 10, 'bender_3', 10),
    new Alien(9, 10, 'bender_4', 10),
    new Alien(11, 10, 'bender_5', 10),
    new Alien(13, 10, 'bender_6', 10),
    new Alien(15, 10, 'bender_7', 10),
    new Alien(17, 10, 'bender_8', 10)]
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

function navRemove() {
  $('H1').slideUp()
  $('.fade').fadeOut()
  $('li.score').removeClass('hidden')
  $('li.quit').removeClass('hidden')
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
        playerShipFire(playerShipLocation, 22)
        break
      default: return
    }
    e.preventDefault()
  })
}
function stopPlayeMovement () {
  $(document).off('keydown')
}

function placePlayerShip () {
  $('.gameGrid').last().addClass('playerShip')
}

class Alien {
  constructor(startingV, startingH, name, score) {
    this.currentV = startingV
    this.currentH = startingH
    this.name = name
    this.score = score
    this.currentMoves = 0
    this.isMovingRight = true
    this.isHit = false
    this.render()
    this.movementId = null
    this.move()
  }
  scoreUpdater() {
  }

  render() {
    // console.log(this.currentH, this.currentV)
    $(`.v${this.currentV}.h${this.currentH}`).addClass('alienShip1')
  }

  move() {
    this.movementId = setInterval(() => {
      if (gamePlaying === false) {
        clearInterval(this.movementId)
      }
      if (this.isHit === true) {
        playerScore === playerScore + this.score
        $('li.score').innerHTML(`Score: ${playerScore}`)
        clearInterval(this.movementId)
        console.log(`Alien ship hit = ${this.name}`)
      }
      if (this.currentH === 22) {
        lostGame()
      }
      $(`.v${this.currentV}.h${this.currentH}`).removeClass('alienShip1')
      if (this.currentMoves < 5) {
        this.currentMoves++
        if(this.isMovingRight) {
          this.currentV++
        } else {
          this.currentV--
        }
      } else {
        this.currentH++
        this.currentMoves = 0
        this.isMovingRight = !this.isMovingRight
      }
      this.render()
    }, alienShipSpeed)
  }
}

function motherShipMover () {
  if (motherShipLocation === 'v25') {
    clearInterval(motherShipMoverInterval)
    motherShipIntervalFrequency()
  } else {
    const numberOnly = parseInt(motherShipLocation.replace('v', ''))
    const newLocation = numberOnly + 1
    const updateNewLocation = 'v' + newLocation
    motherShipMovement(updateNewLocation, motherShipLocation)
  }
}

function motherShipIntervalMover () {
  motherShipMoverInterval = setInterval(motherShipMover , alienShipSpeed)
}

function motherShipIntervalFrequency () {
  motherShipFrequencyInterval = setTimeout(launchMotherShip, motherShipFrequency)
}

function launchMotherShip () {
  motherShipLocation = 'v1'
  $(`div.h1.${motherShipLocation}`).addClass('motherShip')
  motherShipIntervalMover()
}

function playerShipLocator () {
  const shipFinder = $('.container').find('div.playerShip')
  playerShipLocation = shipFinder[0].classList[1]
}

function alienShipDead () {
  let shot = $('.container').find('div.alienShip1.bullet')
  return shot[0]
}
console.log(alienShipDead())

function playerShipFire (startColumn, startRow) {
  bulletInterval = setInterval(function () {
    if (startRow === 1) {
      clearInterval(bulletInterval)
      console.log('fire finished')
    }
    alienShipDead ()
    $(`div.${startColumn}.h${startRow}`).removeClass('bullet')
    startRow--
    $(`div.${startColumn}.h${startRow}`).addClass('bullet')

  }, bulletSpeed)
}

function playerShipMovement (newLocation, oldLocation) {
  switch (newLocation === oldLocation) {
    case false:
      $(`div.h22.${newLocation}`).addClass('playerShip')
      $(`div.h22.${oldLocation}`).removeClass('playerShip')
      playerShipLocation = newLocation
      break
    default:
  }
}

function motherShipMovement (newLocation, oldLocation) {
  $(`div.h1.${newLocation}`).addClass('motherShip')
  $(`div.h1.${oldLocation}`).removeClass('motherShip')
  motherShipLocation = newLocation
}

function ShipMovementValue (movement) {
  const numberOnly = parseInt(playerShipLocation.replace('v', ''))
  console.log(movement)
  const newLocation = numberOnly + movement
  if (newLocation > 24) {
    return 'v24'
  } else if  (newLocation < 1) {
    return 'v1'
  } else {
    return 'v' + newLocation
  }
}

$(document).ready(() => {
  startGame()
  quitGame()

})
