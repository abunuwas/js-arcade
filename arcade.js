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
		//enemy.attack(protagonist);
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

	return {
		init: init
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

	return {
		draw: draw,
		move: move,
		checkCollision: checkCollision,
		shoot: shoot
	};
};

ARCADE.enemy = function() {
	var position = [20, 20];

	function attack() {
		var attack = false;
	}

	function move(newDirection) {
		var newDirection = false;
	}

	function draw(ctx) {
		ctx.save();
		ctx.fillStyle = '#ff0000';
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
		checkCollision: checkCollision
	};

}

ARCADE.game.init();