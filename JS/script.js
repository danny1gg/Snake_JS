let gameTable = getById("gameTable");
let gameStatus = getById("gameStatus");
let restartBtn = getById("restartGame");
let scoreDiv = getById("score");
let food, randomFoodLocationRow, randomFoodLocationColumn, foodLocation;
let snake, snakeLocationRow = 10, snakeLocationColumn = 7, snakeLocation, snakeBody = [""];
let pressedKey = [], direction = "right", score = 0;
createGameTable();
createAndPlaceFood();
createAndPlaceSnake();
updateScore();

function getById(id) { // shortcut for the Id selector
	return document.getElementById(id);
}

function updateScore() { // sets, updates and displays the score
	scoreDiv.innerHTML = "Score: " + score;
}

function createGameTable() { // creates the game table with the rounded corners
	for (let i = 0; i <= 31; ++i) {
		let row = document.createElement("div");
		row.setAttribute("class", "row");
		for (let j = 0; j <= 31; ++j) {
			let cell = document.createElement("div");
			cell.setAttribute("id", setLocation(i, j));
			if (i == 0 || j == 0 || i == 31 || j == 31) {
				cell.setAttribute("class", "border");
				if (i == 0 && j == 0) {
					cell.setAttribute("style", "border-radius: 20px 0px 0px 0px");
				} else if (i == 0 && j == 31) {
					cell.setAttribute("style", "border-radius: 0px 20px 0px 0px");
				} else if (i == 31 && j == 31) {
					cell.setAttribute("style", "border-radius: 0px 0px 20px 0px");
				} else if (i == 31 && j == 0) {
					cell.setAttribute("style", "border-radius: 0px 0px 0px 20px");
				}
			} else {
				cell.setAttribute("class", "gameBoard");
			}
			cell.innerHTML = "";
			row.appendChild(cell);
		}
		gameTable.appendChild(row);
	}
}

function setLocation(row, coll) { // sets the location of the food or the snake
	return "cell_" + row + "_" + coll;
}

function setColorAndShape(object) { // sets the color and the shape of the food or snake
	if (object === food) {
		food.style.backgroundColor  = "red";
		food.style.borderRadius = "10px";
	} else {
		snake.style.backgroundColor = "darkblue";
		snake.style.borderRadius = "3px";
	}
}

function generateRandomNr() {
	return Math.floor(Math.random() * 30 + 1); 
}

function createAndPlaceFood() {
	randomFoodLocationRow = generateRandomNr();
	randomFoodLocationColumn = generateRandomNr();
	foodLocation = setLocation(randomFoodLocationRow, randomFoodLocationColumn);
	food = getById(foodLocation);
	setColorAndShape(food);
}

function createAndPlaceSnake() { // creates the snake at the beginning of the game
	while (snakeLocationColumn < 10) {
		snakeLocation = setLocation(snakeLocationRow, ++snakeLocationColumn);
		snakeBody.push(snakeLocation);
		snake = getById(snakeLocation);
		setColorAndShape(snake);
	}
}

const ANIMATE_GAME = setInterval(animateGame, 110);

function animateGame() {
	moveSnake();
	snake = getById(snakeLocation);
	setColorAndShape(snake);
	pressedKey.shift(); // clear the queue for the preesed keys
}

function changeSnakeDirection() { // getting the pressed keys and chage direction
	if (pressedKey.length == 0) { // to avoid multiple pressed keys bug, 
		pressedKey.push(window.event.key); // we are checking if no key is pressed in the queue
		if (pressedKey == 'ArrowUp' && direction !== "up" && direction !== "down") {
			direction = "up";
		} else if (pressedKey == 'ArrowDown' && direction !== "up" && direction !== "down") {
			direction = "down";
		} else if (pressedKey == 'ArrowLeft' && direction !== "left" && direction !== "right") {
			direction = "left";
		} else if (pressedKey == 'ArrowRight' && direction !== "left" && direction !== "right") {
			direction = "right";
		}
	}
}
	
function moveSnake() { // moving the snake in a specific direction
	getById(snakeBody[1]).style.backgroundColor = "darkgreen";
	if (direction === "up") {
		--snakeLocationRow;
	} else if (direction === "down") {
		++snakeLocationRow;
	} else if (direction === "left") {
		--snakeLocationColumn;
	} else if (direction === "right") {
		++snakeLocationColumn;
	}
	snakeLocation = setLocation(snakeLocationRow, snakeLocationColumn);
	snakeBody.push(snakeLocation); // move the snake a div forward
	checkIfFoodIsEaten();
	checkIfSelfEated();
	checkForHittingTheWall();
}

function checkIfFoodIsEaten() {
	if (snakeBody.includes(foodLocation)) { // if the food is eaten
		++score;
		updateScore();
		createAndPlaceFood();
	} else { 
		snakeBody.shift(); // clear the trail left behind the snake
	}
}

function checkForHittingTheWall() {
	if (snakeLocationRow < 1  || snakeLocationRow > 30 
		|| snakeLocationColumn < 1 || snakeLocationColumn > 30) { // if the snake hits the wall
		stopGame();	
	}
}

function checkIfSelfEated() {
	for (let i = 0; i < snakeBody.length - 1; ++i) {
		if (snakeLocation == snakeBody[i]) {
			snake.style.backgroundColor = "blue";
			stopGame();	
		}
	}
}

function stopGame() {
	clearInterval(ANIMATE_GAME);
	gameStatus.innerHTML = "Game over!";
	gameStatus.setAttribute("class", "animated_lost_message");
	restartBtn.style.visibility = "visible";
}
