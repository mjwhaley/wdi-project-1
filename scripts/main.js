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
let soundBoom = null
let soundPlanet = null
let pilotName = 'Unknown'
let highscores = null

//Functions
function checkHighscores() {
  if(localStorage.getItem('highscore')) {
    highscores = JSON.parse(localStorage.getItem('highscore'))
  } else {
    highscores = []
  }
}


function startGame () {
  $('li.play').click(function() {
    $('div.pilotNameOverlay').removeClass('hide')
  })
}

function pilotNameInput () {
  $('.clickToPlay').click(function() {
    pilotName = $('.inputPilot').val()
    console.log(`Pilot name: ${pilotName}`)
    $('div.pilotNameOverlay').addClass('hide')
    $('div.container').removeClass('containerBackground')
    $('li.pilot').html(`Pilot: ${pilotName}`)
    gamePlaying = true
    playGame()
  })
}

function controlsOverlay () {
  $('.controls').click(function() {
    $('div.controlsOverlay').removeClass('hide')
  })
}
function controlsOverlayRemove () {
  $('.controlsOverlay').click(function() {
    $('div.controlsOverlay').addClass('hide')
  })
}
function rulesOverlay () {
  $('.rules').click(function() {
    $('div.rulesOverlay').removeClass('hide')
  })
}
function rulesOverlayRemove () {
  $('.rulesOverlay').click(function() {
    $('div.rulesOverlay').addClass('hide')
  })
}
function leaderboardOverlay () {
  $('.leaderboard').click(function() {
    $('div.leaderboardOverlay').removeClass('hide')
    highscores.forEach(score => $('.pilotList').append(`<li><p>${score.pilot} scored: ${score.score}<P></li>`))
  })
}
function leaderboardOverlayRemove () {
  $('.leaderboardOverlay').click(function() {
    $('div.leaderboardOverlay').addClass('hide')
  })
}
function resetGame () {
  $('li.reset').click(function() {
    quitGame()
    gamePlaying = true
    playerScore = 0
    $('li.score').html(`Score: ${playerScore}`)
    aliens = []
    for(let i = 0; i < 500; i++) {
      window.clearTimeout(i)
      window.clearInterval(i)
    }
    $('.container').empty()
    setTimeout(playGame(), 1000)
    $('li.score').html('Score: 0')
  })
}
function quitGame () {
  $('li.quit').click(function() {
    clearInterval(motherShipMoverInterval)
    clearTimeout(motherShipFrequencyInterval)
    clearTimeout(motherShipStartDelayTimeout)
    stopPlayeMovement()
    gamePlaying = false
    const itemToStore = { pilot: pilotName, score: playerScore}
    const newScores = [...highscores, itemToStore]
    localStorage.setItem('highscore', JSON.stringify(newScores))
    for(let i = 0; i < 500; i++) {
      window.clearTimeout(i)
      window.clearInterval(i)
    }
  })
}

function lostGame () {
  clearInterval(motherShipMoverInterval)
  clearTimeout(motherShipFrequencyInterval)
  clearTimeout(motherShipStartDelayTimeout)
  stopPlayeMovement()
  gamePlaying = false
  localStorage.setItem('Name and Score', `Pilot: ${pilotName} scored: ${playerScore}`)
}
function sounds () {
  soundLazer = document.querySelector('.lazer')
  soundBoom = document.querySelector('.boom')
  soundPlanet = document.querySelector('.planet')
}

function playGame () {
  createGrid(16, 20)
  playerScore = 0
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
  $('li.pilot').removeClass('hidden')
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

function playerFire () {
  $(document).keydown(function(e) {
    switch(e.which) {
      case 32: // fire
        playerShipFire(playerShipLocation, 15)
        soundLazer.play()
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

  render() {
    if (this.isHit === false) {
      $(`.v${this.currentV}.h${this.currentH}`).addClass('alienShip')
    }
  }

  move() {
    this.movementId = setInterval(() => {
      if (gamePlaying === false) {
        clearInterval(this.movementId)
      }
      this.isHit = !$(`.v${this.currentV}.h${this.currentH}`).hasClass('alienShip')
      if (this.isHit === true) {
        playerScore = playerScore + this.score
        soundBoom.play()
        $('li.score').html(`Score: ${playerScore}`)
        clearInterval(this.movementId)
      }
      if (this.currentH === 16) {
        clearInterval(this.movementId)
        lostGame()
      }
      $(`.v${this.currentV}.h${this.currentH}`).removeClass('alienShip')
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

function checkForWin () {
  console.log('checking up n running')
  setInterval(() => {
    if (playerScore === 990) {
      quitGame()
      resetGame()
      winnerMessage()
      for(let i = 0; i < 500; i++) {
        window.clearTimeout(i)
        window.clearInterval(i)
      }
    }
  }, 100)
}

function winnerMessage () {
  $('div.gameWonOverlay').removeClass('hide')
  $('.gameWonText').html(`<p>Game won</p><p>Welldone ${pilotName}</p><p>You scored: ${playerScore}</p><p class="playAgainButton">You want to play again?</p>`)
  playAgain()
}
function playAgain () {
  $('.playAgainButton').click(function() {
    $('div.gameWonOverlay').addClass('hide')
    resetGame()
  })
}
function motherShipMover () {
  if (motherShipLocation === 'v21') {
    clearInterval(motherShipMoverInterval)
    motherShipIntervalFrequency()
  } else {
    soundPlanet.play()
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
    if($(`div.${startColumn}.h${startRow}`).hasClass('alienShip')) {
      $(`div.${startColumn}.h${startRow}`).removeClass('alienShip bullet')
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
  checkHighscores()
  startGame()
  quitGame()
  resetGame()
  sounds()
  controlsOverlay()
  leaderboardOverlay()
  rulesOverlay()
  leaderboardOverlayRemove()
  rulesOverlayRemove()
  controlsOverlayRemove()
  pilotNameInput()
  checkForWin()
})
