var ARCADE = {};

ARCADE.game = (function() {
	var canvas, ctx;
	var frameLength;
	var protagonist;
	var enemy;
	var bullets;
	var score;
	ARCADE.width = 800;
	ARCADE.height = 800;
	ARCADE.blocksize = 15;
	ARCADE.widthInBlocks = ARCADE.width / ARCADE.blockSize;
	ARCADE.heigthInBlocks = ARCADE.height / ARCADE.blockSize;

	function init() {
		var $canvas = $('#jsArcade');
		if ($canvas.length < 1) {
			$('body').append('<canvas id="jsArcade">');
		}
		$canvas = $('#jsArcade');
		$canvas.attr('width', ARCADE.width);
		$canvas.attr('height', ARCADE.height);
		canvas = $canvas[0];
		ctx = canvas.getContext('2d');
		score = 0;
		frameLegth = 500;
		protagonist = ARCADE.protagonist();
		enemy = ARCADE.enemy();
		bindEvents();
		gameLoop();
	}

	function gameLoop() {
		ctx.clearRect(0, 0, ARCADE.width, ARCADE.height);
		if (enemy.distanceFrom(protagonist) < [2, 2]) {
			enemy.attack(protagonist);
		}
		else {
			enemy.move();
		}
		draw();
		timeout = setTimeout(gameLoop, frameLength);
	}

	function draw () {
		protagonist.draw(ctx);
		enemy.draw(ctx);
		if (ARCADE.bullets.length > 0) {
			//console.log(ARCADE.bullets.length)
    		for(var i = 0; i < ARCADE.bullets.length; i++) {
    			var bullet = ARCADE.bullets[i];
    			//console.log(bullet);
    			bullet.move();
    			bullet.draw(ctx);
    			console.log(ARCADE.bullets.length)
    			if (bullet.duration < 1) {
    				console.log('It is 0!!!');
    				ARCADE.bullets.splice(i-1, 1);
    			}
    		}
		}
	}

	function restart() {
		clearTimeout(timeout);
		$('body').unbind('keydown');
		$(ARCADE).unbind('appleEaten');
		$(canvas).unbind('click');
		ARCADE.game.init();
	}

	function bindEvents() {
		var keysToDirections = {
			37: 'left',
			38: 'up',
			39: 'right',
			40: 'down'
		};

		$(document).keydown(function (event) {
			var key = event.which;
			var direction = keysToDirections[key];

			if (direction) {
				protagonist.move(direction);
				event.preventDefault();
			}
			else if (key === 32) {
				protagonist.shoot();
			}
		});

		$(ARCADE).bind('enemyKilled',function (event, protagonistPositions) {
			enemy.setNewPosition(protagonistPositions);
			score++;
		});

		$(canvas).click(restart);
	}

	function getProtaPosition() {
		return protagonist.getPosition();
	}

	return {
		init: init,
		getProtaPosition: getProtaPosition
	};
})();

ARCADE.bullets = [];

function Bullet (direction, speed, duration, position) {
	this.direction = direction;
	this.speed = speed;
	this.duration = duration;
	ARCADE.bullets.push(this)

	this.move = function () {
		switch (this.direction) {
		case 'left': 
			position[0] -= this.speed;
			break;
		case 'up':
			position[1] -= this.speed;
			break;
		case 'right':
			position[0] += this.speed;
			break;
		case 'down': 
			position[1] += this.speed;
			break
		}
		this.duration -= 1;
		//console.log(this.duration);
		//console.log(position)
	}

	this.draw = function (ctx) {
		ctx.save();
		ctx.fillStyle = 'black'; // bullet black
		var x = ARCADE.blocksize * position[0];
		var y = ARCADE.blocksize * position[1];
		ctx.fillRect(x, y, ARCADE.blocksize, ARCADE.blocksize);
	}
}

ARCADE.protagonist = function () {
	var direction;
	var position = [6, 6];
	//var direction, nextDirection;

	function move(newDirection) {
		console.log('Moving protagonist!!')
		direction = newDirection;
		switch (newDirection) {
		case 'left': 
			position[0] -= 1;
			break;
		case 'up':
			position[1] -= 1;
			break;
		case 'right':
			position[0] += 1;
			break;
		case 'down': 
			position[1] += 1;
			break
		}
		console.log(position)
	}

	function draw(ctx) {
		ctx.save();
		ctx.fillStyle = '#0a0'; // protagonist green
		var x = ARCADE.blocksize * position[0];
		var y = ARCADE.blocksize * position[1];
		ctx.fillRect(x, y, ARCADE.blocksize, ARCADE.blocksize);
	}

	function checkCollision() {
		var wallCollision = false;
	}

	function shoot() {
		var bulletPosition = position.slice();
		bulletPosition[0] += .5;
		var bulletDirection = direction;
		if (typeof bulletDirection === 'undefined') {
			bulletDirection = 'right';
		}
		else {
			bulletDirection = direction;
		}
		var bullet = new Bullet(bulletDirection, 0.2, 500, bulletPosition);
	}

	function getPosition() { 
		return position;
	}

	return {
		draw: draw,
		move: move,
		checkCollision: checkCollision,
		shoot: shoot,
		getPosition: getPosition
	};
};

ARCADE.enemy = function() {
	var direction;
	var position = [30, 30];
	var speed = 0.2;

	function attack() {
		console.log('Attacking protagonist!!')
		var attack = false;
	}

	function randomPosition() {
		var directions = ['left', 'up', 'right', 'down'];
		var index = Math.floor(Math.random() * 4);
		direction = directions[index];
		//console.log(index, direction);
		switch (direction) {
		case 'left': 
			position[0] -= speed;
			break;
		case 'up':
			position[1] -= speed;
			break;
		case 'right':
			position[0] += speed;
			break;
		case 'down': 
			position[1] += speed;
			break
		}			
	}

	function getCloser(protaX, protaY) {
		var x = position[0];
		var y = position[1];
		if (protaX < x && protaY < y) {
			position[0] -= 1;
			position[1] -= 1;
		}
		else if (protaX > x && protaY < y) {
			position[0] += 1;
			position[1] -= 1;
		}
		else if (protaX > x && protaY > y) {
			position[0] += 1;
			position[1] += 1;
		}
		else if (protaX < x && protaY > y) {
			position[0] -= 0;
			position[1] += 1;
		}
	}

	function distanceFrom(target) {
		var targetPos = target.getPosition();
		var targetX = Math.abs(targetPos[0]);
		var targetY = Math.abs(targetPos[1]);
		var x = Math.abs(position[0]);
		var y = Math.abs(position[1]);
		distance = [Math.abs(targetX - x), Math.abs(targetY - y)];
		return distance;
	}

	function move() {
		var protaPosition = ARCADE.game.getProtaPosition();
		var protaX = protaPosition[0];
		var protaY = protaPosition[1];
		var distX = Math.abs(position[0]) - Math.abs(protaX);
		var distY = Math.abs(position[1]) - Math.abs(protaY);
		console.log(distX, distY);
		if (Math.abs(distX) > 0 && Math.abs(distX) < 20 && Math.abs(distY) > 0 && Math.abs(distY) < 20) {
			getCloser(protaX, protaY)
		}
		else {
			randomPosition()
		}
	}

	function draw(ctx) {
		ctx.save();
		ctx.fillStyle = 'red';
		var x = ARCADE.blocksize * position[0];
		var y = ARCADE.blocksize * position[1];
		ctx.fillRect(x, y, ARCADE.blocksize, ARCADE.blocksize);
	}

	function checkCollision() {
		var wallCollision = false;
	}

	return {
		draw: draw,
		move: move,
		checkCollision: checkCollision,
		distanceFrom: distanceFrom,
		attack: attack
	};

}

ARCADE.game.init();