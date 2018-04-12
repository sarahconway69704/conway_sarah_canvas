(() => {

  console.log('game stuff ready!');

//set up variables
  const theCanvas = document.querySelector('canvas'),
    ctx = theCanvas.getContext('2d'),
    playerImg = document.querySelector('.ship'),
    mouseTracker = { x : theCanvas.width /2 },
    playerLives = [1, 2, 3],
    // grab the enemy images
    enemy1 = document.querySelector('.enemyOne'),
    enemy2 = document.querySelector('.enemyTwo'),
    enemy3 = document.querySelector('.enemyThree'),

    player = { x: 275, y: 550, width: 50, height: 50, speed: 8, lives: 3}, //variables that describe the player



    playButton = document.querySelector('.play'),
    pauseButton = document.querySelector('.pause'),
    resetButton = document.querySelector('.reset'),


//grab reset screen
    resetScreen = document.querySelector('.level-up');


    var playState = true;
      score = 0,
      mousePos = 0;
      bullets = [],
      squares = [
      { x: randomX(), y: 30, x2: 30, y2: 30, image : enemy1, xspeed: -3, yspeed: 5, points: 10},
      { x: randomX(), y: 30, x2: 30, y2: 30, image : enemy2, xspeed: 7, yspeed: 7, points: 5},
      { x: randomX(), y: 30, x2: 30, y2: 30, image : enemy3, xspeed: -5, yspeed: 3, points: 10},

    ];

//restart game, reset player to middel


function draw() {
  ctx.clearRect(0, 0, theCanvas.width, theCanvas.height);

  // draw score first
  ctx.fillStyle = 'rgb(255, 255, 255, 255)';
  ctx.font = '18px sans-serif';
  ctx.fillText(`Score : ${score}`, 500, 20);

  // draw life icons

  playerLives.forEach((life, index) => {
    ctx.drawImage(playerImg, 10 + (index * 26), 10, 20, 20);
  });

  //draw the mouse tracker
  ctx.beginPath();
  ctx.moveTo(mouseTracker.x, theCanvas.height - 10);
  ctx.lineTo(mouseTracker.x - 5, theCanvas.height);
  ctx.lineTo(mouseTracker.x + 5, theCanvas.height);
  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.fill();

  // make the ship chase teh triangle
  dx = mousePos - player.x;
  player.x += (dx / 10);

  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height); //30, 30 is origin coordinates

  bullets.forEach((bullet, index) => {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.85)';
    ctx.fillRect(bullet.x, bullet.y, bullet.x2, bullet.y2);

    let bulletIndex = index;

  squares.forEach ((square, index) => {

      // check for collision (bullet and box) => check all coord and dimensions to see if a bullet is touching a box
      if (bullet.y <= (square.y + square.y2) && bullet.y > square.y && bullet.x > square.x && bullet.x < (square.x + square.x2)){
        squares.splice(index, 1);
        bullets.splice(bulletIndex, 1);

        //increment the score based on enemy points
        score += square.points;
        console.log(`Score = ${score}`);

//are there any enemies left?
        if (squares.length == 0) {
          //show the level up screen
          console.log('level up!');
          showResetScreen()
        }

        //play explosion sound
        let explode = document.createElement('audio');
        explode.src = "audio/explosion.mp3";

        document.body.appendChild(explode);

        explode.addEventListener('ended', () => {
          document.body.removeChild(explode);
      });

      explode.play();
    }
    });


    bullet.y -= bullet.speed;

    if (bullet.y < 0) {
      bullets.splice(index, 1);
    }
  })

  squares.forEach (square => {
      //ctx.fillStyle = square.color;
      ctx.drawImage(square.image, square.x, square.y, square.x2, square.y2);

    if (square.x + square.x2 > theCanvas.width){
      square.xspeed *= -1;
    } else if (square.x <  0) {
      square.xspeed *= -1;
    }

    if (square.y + square.y2 > theCanvas.height - 100){
      square.yspeed *= -1;
    } else if (square.y < 0) {
      square.yspeed *= -1;
    }

    square.x += square.xspeed;
    square.y += square.yspeed;
  });

  if (playState === false) {
    window.cancelAnimationFrame(draw);
    return;
  }

  window.requestAnimationFrame(draw);
}

// function moveShip(e) {
//   //check the keycode of the key you're pressing
//   switch (e.keyCode) {
//     //left arrow key
//     case 37:
//     console.log('move the ship left');
//     if (player.x > 0){ //don't allow the player to go past the left edge
//     player.x -= player.speed; //move ship left
//   }
//     break;
//
//     //right arrow key
//     case 39:
//     console.log('move the ship right');
//     if (player.x + player.width < theCanvas.width) {//don't allow the player to go past the right edge
//         player.x += 5; //move ship right
//       }
//     break;
//
//
//     default:
//     //do nothing
//   }
// }

function createBullet() {
  //create a bullet and push it into the bullet array
  let newBullet = {
    x : player.x + player.width / 2 - 2.5,
    y : theCanvas.height - player.height - 10,
    x2 : 5,
    y2 : 10,
    speed : 8
  };

  bullets.push(newBullet);

  //play cheesy laser sound
  let laser = document.createElement('audio');
  laser.src ="audio/laser.mp3";
  document.body.appendChild(laser);

  laser.addEventListener('ended', () => {
    document.body.removeChild(laser);
  });

  laser.play();
}

function movePlayer(e) {
  mousePos = (e.clientX - theCanvas.offsetLeft) - player.width / 2;

  mouseTracker.x = e.clientX - theCanvas.offsetLeft;
}

function resumeGame() {
  playState = true;
  window.requestAnimationFrame(draw);
}

function pauseGame() {
  playState = false;
}

function showResetScreen() {
  resetScreen.classList.add('show-level-up');
  playState = false;
}

function levelUpGame() {
  //increase the difficulty
  bullets = [],
  squares = [
  { x: randomX(), y: 30, x2: 30, y2: 30, image : enemy1, xspeed: -3, yspeed: 5, points: 10},
  { x: randomX(), y: 30, x2: 30, y2: 30, image : enemy2, xspeed: 7, yspeed: 7, points: 5},
  { x: randomX(), y: 30, x2: 30, y2: 30, image : enemy3, xspeed: -5, yspeed: 3, points: 10},
  { x: randomX(), y: 30, x2: 30, y2: 30, image : enemy1, xspeed: 3, yspeed: 5, points: 10},
  { x: randomX(), y: 30, x2: 30, y2: 30, image : enemy2, xspeed: -7, yspeed: 7, points: 5},
  { x: randomX(), y: 30, x2: 30, y2: 30, image : enemy3, xspeed: 5, yspeed: 3, points: 10},
  //restart the game
];
player.x = theCanvas.width / 2;
mousePos = theCanvas.width / 2;

resetScreen.classList.remove('show-level-up');

playState = true;

  //restart animation
window.requestAnimationFrame(draw);
}

function randomX() {
  return Math.floor(Math.random() * (theCanvas.width - 100));
}

window.requestAnimationFrame(draw); //everytime we do a key press , we want another one

//window.addEventListener('keydown', moveShip);
theCanvas.addEventListener('mousemove', movePlayer);
theCanvas.addEventListener('click', createBullet);

playButton.addEventListener('click', resumeGame);
pauseButton.addEventListener('click', pauseGame);
resetButton.addEventListener('click', levelUpGame);
})();
