//Varibles
const gameAreaWidth = 1000
const gameAreaHeight = 800
const gameAreaBlockWidth = Math.round(gameAreaWidth/20)
const gameAreaBlockHeight = Math.round(gameAreaHeight/16)
const gridVertical = ['v1','v2','v3','v4','v5','v6','v7','v8','v9','v10','v11','v12','v13','v14','v15','v16','v17','v18','v19','v20']
const gridHorizontal = ['h1','h2','h3','h4','h5','h6','h7','h8','h9','h10','h11','h12','h13','h14','h15','h16']
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
const bulletSpeed = 20
let soundLazer = null

//Functions
function startGame () {
  $('li.play').click(function() {
    $('div.container').removeClass('containerBackground')
    gamePlaying = true
    playGame()

  })
}
function resetGame () {
  $('li.reset').click(function() {
    quitGame()
    gamePlaying = true
    playerScore = 0
    $('li.score').html(`Score: ${playerScore}`)
    aliens = []
    $('.container').empty()
    // $('li.score').html(`Score: ${playerScore}`)
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
    playerScore = 0
  })
}

function lostGame () {
  clearInterval(motherShipMoverInterval)
  clearTimeout(motherShipFrequencyInterval)
  clearTimeout(motherShipStartDelayTimeout)
  stopPlayeMovement()
  console.log('Lost game')
  gamePlaying = false
}
function sounds () {
  soundLazer = document.querySelector('.lazer')
}

function playGame () {
  createGrid(16, 20)
  playerScore = 0
  $('li.score').html(`Score: ${playerScore}`)
  navRemove()
  playerMove()
  playerFire()
  placePlayerShip()
  playerShipLocator()
  motherShipStartDelayTimeout = setTimeout(launchMotherShip, motherShipStartDelay)
  aliens = [new Alien(2, 2, 'johnny5', 50),new Alien(4, 2, 'johnny5', 50),new Alien(6, 2, 'johnny5', 50),new Alien(8, 2, 'johnny5', 50),new Alien(10, 2, 'johnny5', 50),new Alien(12, 2, 'johnny5', 50),new Alien(14, 2, 'johnny5', 50),new Alien(3, 4, 'walle', 40),new Alien(5, 4, 'walle', 40),new Alien(7, 4, 'walle', 40),new Alien(9, 4, 'walle', 40),new Alien(11, 4, 'walle', 40),new Alien(13, 4, 'walle', 40),new Alien(2, 6, 'c3po', 30),new Alien(4, 6, 'c3po', 30),new Alien(6, 6, 'c3po', 30),new Alien(8, 6, 'c3po', 30),new Alien(10, 6, 'c3po', 30),new Alien(12, 6, 'c3po', 30),new Alien(14, 6, 'c3po', 30),new Alien(3, 8, 'r2d2', 20),new Alien(5, 8, 'r2d2', 20),new Alien(7, 8, 'r2d2', 20),new Alien(9, 8, 'r2d2', 20),new Alien(11, 8, 'r2d2', 20),new Alien(13, 8, 'r2d2', 20),new Alien(2, 10, 'bender', 10),new Alien(4, 10, 'bender', 10),new Alien(6, 10, 'bender', 10),new Alien(8, 10, 'bender', 10),new Alien(10, 10, 'bender', 10),new Alien(12, 10, 'bender', 10),new Alien(14, 10, 'bender', 10)]
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
  $('li.reset').removeClass('hidden')
}
function playerMove () {
  $(document).keydown(function(e) {
    switch(e.which) {
      case 37:
        playerShipMovement(ShipMovementValue(-1), playerShipLocation)
        break
      case 39:
        playerShipMovement(ShipMovementValue(1), playerShipLocation)
        break
      default: return
    }
    e.preventDefault()
  })
}


function playAudio() {
  soundLazer.play()
}
function playerFire () {
  $(document).keydown(function(e) {
    switch(e.which) {
      case 32: // fire
        playerShipFire(playerShipLocation, 22)
        playAudio()
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
    if (this.isHit === false) {
      $(`.v${this.currentV}.h${this.currentH}`).addClass('alienShip1')
    }
  }

  move() {
    this.movementId = setInterval(() => {
      if (gamePlaying === false) {
        clearInterval(this.movementId)
      }
      this.isHit = !$(`.v${this.currentV}.h${this.currentH}`).hasClass('alienShip1')
      if (this.isHit === true && gamePlaying === true) {
        playerScore = playerScore + this.score
        $('li.score').html(`Score: ${playerScore}`)
        clearInterval(this.movementId)
      }
      if (this.currentH === 16) {
        clearInterval(this.movementId)
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
  if (motherShipLocation === 'v21') {
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

function playerShipFire (startColumn, startRow) {
  bulletInterval = setInterval(function () {
    $(`div.${startColumn}.h${startRow}`).removeClass('bullet')
    startRow--
    $(`div.${startColumn}.h${startRow}`).addClass('bullet')
    if($(`div.${startColumn}.h${startRow}`).hasClass('alienShip1')) {
      $(`div.${startColumn}.h${startRow}`).removeClass('alienShip1 bullet')
      clearInterval(bulletInterval)
    }
  }, bulletSpeed)
}

function playerShipMovement (newLocation, oldLocation) {
  switch (newLocation === oldLocation) {
    case false:
      $(`div.h16.${newLocation}`).addClass('playerShip')
      $(`div.h16.${oldLocation}`).removeClass('playerShip')
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
  const newLocation = numberOnly + movement
  if (newLocation > 20) {
    return 'v20'
  } else if  (newLocation < 1) {
    return 'v1'
  } else {
    return 'v' + newLocation
  }
}
//Run game when document ready
$(document).ready(() => {
  startGame()
  quitGame()
  resetGame()
  sounds()
})
