// Define HTML elements
const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");

// Game object to encapsulate game related functionalities
const Game = {
  gridSize: 20,
  snake: null,
  food: null,
  highScore: 0,
  direction: "right",
  gameInterval: null,
  gameSpeedDelay: 200,
  gameStarted: false,

  // Initialize game
  init() {
    this.snake = [{ x: 10, y: 10 }];
    this.food = this.generateFood();
    this.draw();
    document.addEventListener("keydown", this.handleKeyPress.bind(this));
  },

  // Draw game map, snake, food
  draw() {
    board.innerHTML = "";
    this.drawSnake();
    this.drawFood();
    this.updateScore();
  },

  // Draw Snake
  drawSnake() {
    this.snake.forEach((segment) => {
      const snakeElement = this.createGameElement("div", "snake");
      this.setPosition(snakeElement, segment);
      board.appendChild(snakeElement);
    });
  },

  // Draw Food
  drawFood() {
    if (this.gameStarted) {
      const foodElement = this.createGameElement("div", "food");
      this.setPosition(foodElement, this.food);
      board.appendChild(foodElement);
    }
  },

  // Creates game elements
  createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
  },

  // Set the position of snake or food
  setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
  },

  // Start Game function
  startGame() {
    this.gameStarted = true;
    instructionText.style.display = "none";
    logo.style.display = "none";
    this.gameInterval = setInterval(() => {
      this.move();
      this.checkCollision();
      this.draw();
    }, this.gameSpeedDelay);
  },

  // Keypress event listener
  handleKeyPress(event) {
    if (!this.gameStarted && (event.code === "Space" || event.code === " ")) {
      this.startGame();
    } else {
      switch (event.key) {
        case "ArrowUp":
          if (this.direction != "down") {
            this.direction = "up";
          }
          break;
        case "ArrowDown":
          if (this.direction != "up") {
            this.direction = "down";
          }
          break;
        case "ArrowLeft":
          if (this.direction != "right") {
            this.direction = "left";
          }
          break;
        case "ArrowRight":
          if (this.direction != "left") {
            this.direction = "right";
          }
          break;
      }
    }
  },

  // Moving the snake
  move() {
    const head = { ...this.snake[0] };
    switch (this.direction) {
      case "right":
        head.x++;
        break;
      case "left":
        head.x--;
        break;
      case "up":
        head.y--;
        break;
      case "down":
        head.y++;
        break;
    }
    this.snake.unshift(head);
    if (head.x === this.food.x && head.y === this.food.y) {
      this.food = this.generateFood();
      this.increaseSpeed();
    } else {
      this.snake.pop();
    }
  },

  // Increase speed of the game
  increaseSpeed() {
    if (this.gameSpeedDelay > 150) {
      this.gameSpeedDelay -= 5;
    } else if (this.gameSpeedDelay > 100) {
      this.gameSpeedDelay -= 3;
    } else if (this.gameSpeedDelay > 50) {
      this.gameSpeedDelay -= 2;
    } else if (this.gameSpeedDelay > 25) {
      this.gameSpeedDelay -= 1;
    }
    clearInterval(this.gameInterval);
    this.gameInterval = setInterval(() => {
      this.move();
      this.checkCollision();
      this.draw();
    }, this.gameSpeedDelay);
  },

  // Check collision with walls or itself
  checkCollision() {
    const head = this.snake[0];
    if (
      head.x < 1 ||
      head.x > this.gridSize ||
      head.y < 1 ||
      head.y > this.gridSize
    ) {
      this.resetGame();
    }
    for (let i = 1; i < this.snake.length; i++) {
      if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
        this.resetGame();
      }
    }
  },

  // Reset the game
  resetGame() {
    this.updateHighScore();
    this.stopGame();
    this.snake = [{ x: 10, y: 10 }];
    this.food = this.generateFood();
    this.direction = "right";
    this.gameSpeedDelay = 200;
    this.updateScore();
  },

  // Generate food
  generateFood() {
    let isFoodOnSnake = false;
    let x;
    let y;
    do {
      x = Math.floor(Math.random() * this.gridSize + 1);
      y = Math.floor(Math.random() * this.gridSize + 1);
      isFoodOnSnake = checkForSnake(x, y);
    } while (isFoodOnSnake);
    return { x, y };
  },

  // Update score
  updateScore() {
    const currentScore = this.snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, "0");
  },

  // Stop the game
  stopGame() {
    clearInterval(this.gameInterval);
    this.gameStarted = false;
    instructionText.style.display = "block";
    logo.style.display = "block";
  },

  // Update high score
  updateHighScore() {
    const currentScore = this.snake.length - 1;
    if (currentScore > this.highScore) {
      this.highScore = currentScore;
      highScoreText.textContent = this.highScore.toString().padStart(3, "0");
    }
    highScoreText.style.display = "block";
  },
};

// Makes sure that Food is not placed over the snake
function checkForSnake(x, y) {
  const snake = Game.snake;
  for (let i = 1; i < snake.length; i++) {
    if (x === snake[i].x && y === snake[i].y) {
      return true;
    }
  }
  return false;
}

// Initialize the game
Game.init();
