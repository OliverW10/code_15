/*
A small, simple javascript library for game making, currently dosent support images or sound.
has drawing functions for most shapes and input handing
*/

var canvas = document.getElementById("canvasTag");
canvas.setAttribute('draggable', false);
var entirePage = document.getElementById("wholePage");
var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
h *= 0.95
var scale = h/600
var c = canvas.getContext("2d"); //c means context

var mousePos={x:0,y:0};
canvas.addEventListener('mousemove', function(evt) {
	mousePos = getMousePos(canvas, evt);
}, false);

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
};

/*
The keys system currently works by adding any key pressed into the keys object
the key is the key name and the value is a bool of if it is pressed
*/

var keys = {}

var pressedAnyKey = false;
document.addEventListener('keydown', function(event) {
		current_key = event.code;
		keys[current_key] = true;
		// console.log(keys);
		pressedAnyKey = true;
	}
);
document.addEventListener('keyup', function(event) {
		current_key = event.code;
		keys[current_key] = false;
	}
);

function checkKey(key){
	if(key in keys){
		if(keys[key] == true){
			return true;
		}
	}
	return false;
}

mouseButtons = [false, false, false];
document.addEventListener('mousedown', function(event){
	mouseButtons[0] = true;
	pressedAnyKey = true;
});

var liftedMouse = false;
var liftedEsc = false;

document.addEventListener('mouseup', function(event){
	mouseButtons[0] = false;
	liftedMouse = true;
});


function collidePoint(point, rect){
	if(point[0] > rect[0] && point[0] < rect[0] + rect[2] && point[1] > rect[1] && point[1] < rect[1] + rect[3]){
		return true;
	}else{
		return false;
	}
}

function collideRect(rect1, rect2){
	if(rect1[0] > rect2[0] + rect2[2] || rect1[0] + rect1[2] < rect2[0] || rect1[1] > rect2[1] + rect2[3] || rect1[1] - rect1[3] < rect2[1]){
		return false;
	}else{
		return true;
	}
}

function blendCols(col1, col2, per){
	var R = col1[0] + (col2[0] - col1[0])*per;
	var G = col1[1] + (col2[1] - col1[1])*per;
	var B = col1[2] + (col2[2] - col1[2])*per;
	return [R, G, B];
}

document.documentElement.style.setProperty('image-rendering', 'pixelated');

function midPoint(point1, point2, per){
	var x = point1[0] + (point2[0] - point1[0])*per;
	var y = point1[1] + (point2[1] - point1[1])*per;
	return [x, y];
}

function drawRotatedRect(X, Y, W, H, colour, rotation){
	c.save();
	c.translate(X, Y);
	c.rotate(rotation);
	c.fillStyle = colour;
	c.beginPath();
	c.rect(-W/2,-H/2, W, H);
	c.fill();
	c.restore();
}

function showText(text, X, Y, Size, colour = "rgb(0, 0, 0)", bold = false, stroke = false){
	c.beginPath();
	if(bold === true){
		c.font = "bold "+Size+"px Arial";
	}
	else{
		c.font = Size+"px Arial"
	}
	c.textAlign = "center";
	if(stroke === false){
		c.fillStyle=colour;
		c.fillText(text, X, Y);
	}
	if(stroke === true){
		c.lineWidth = Size/25;
		c.strokeStyle = colour;
		c.strokeText(text, X, Y)
	}
}

function onScreen(X, Y, size){
	if(X+size > 0 && X-size < canvas.width && Y+size > 0 && Y-size < canvas.width){
		return true;
	} else{
		return false;
	}
}

function roundRect(x, y, width, height, radius = 5) { // stolen
	/*
	creates the path for a rectangle with rounded corners
	*/
	if (typeof radius === 'number') {
		radius = {tl: radius, tr: radius, br: radius, bl: radius};
	}
	c.moveTo(x + radius.tl, y);
	c.lineTo(x + width - radius.tr, y);
	c.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
	c.lineTo(x + width, y + height - radius.br);
	c.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
	c.lineTo(x + radius.bl, y + height);
	c.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
	c.lineTo(x, y + radius.tl);
	c.quadraticCurveTo(x, y, x + radius.tl, y);
	c.closePath();
}
function roundedLine(startPos, endPos, width, colour){
	c.beginPath();
	c.strokeStyle = colour;
	c.lineWidth = width;
	c.moveTo(startPos[0], startPos[1]);
	c.lineTo(endPos[0], endPos[1]);
	c.stroke();

	c.beginPath();
	c.fillStyle = colour;
	c.arc(startPos[0], startPos[1], width/2, 0, Math.PI*2);
	c.fill();

	c.beginPath();
	c.arc(endPos[0], endPos[1], width/2, 0, Math.PI*2);
	c.fill();
}

function drawCorners(rect){
	c.beginPath();
	c.moveTo(rect[0]+rect[2]*0.1, rect[1]); //top left right
	c.lineTo(rect[0], rect[1]); //top left
	c.lineTo(rect[0], rect[1]+rect[3]*0.1); //top left bottom
	c.stroke();

	c.beginPath();
	c.moveTo(rect[0], rect[1]+rect[3]*0.9); //bottom left top
	c.lineTo(rect[0], rect[1]+rect[3]); // bottom left
	c.lineTo(rect[0]+rect[2]*0.1, rect[1]+rect[3]); //bottom left right
	c.stroke();

	c.beginPath();
	c.moveTo(rect[0]+rect[2]*0.9, rect[1]+rect[3]); //bottom right left
	c.lineTo(rect[0]+rect[2], rect[1]+rect[3]); //botom right
	c.lineTo(rect[0]+rect[2], rect[1]+rect[3]*0.9); //bottom right top
	c.stroke();

	c.beginPath();
	c.moveTo(rect[0]+rect[2], rect[1]+rect[3]*0.1); //top right bottom
	c.lineTo(rect[0]+rect[2], rect[1]); //top right
	c.lineTo(rect[0]+rect[2]*0.9, rect[1]); //top right left
	c.stroke();
}

function scaleNumber(n, x1, x2, z1, z2, clip = false){
	var range1 = x2-x1;
	var range2 = z2-z1;
	var ratio = (n - x1) / range1
    var result = ratio * range2 + z1
    if(clip === true){
    	return clip(result, z1, z2);
    }else{
    	return result;
    }
}

function dist(X1, Y1, X2, Y2){
	return Math.hypot(X1-X2, Y1-Y2);
}

function dist3d(x1, y1, z1, x2, y2, z2){
	return Math.sqrt((x2-x1)**2 + (y2-y1)**2 + (z2-z1)**2);
}

function createArray(fill, size){
	var temp_array = [];
	for(var i = 0; i<size; i+=1){
		temp_array.push(fill);
	}
	return temp_array
}

function createNdArray(fill, sizes){
	var temp_array = []
	if(sizes.length === 2){
		for(var i = 0; i<sizes[0]; i+=1){
			temp_array.push(createArray(fill, sizes[0]));
		}
		return temp_array
	}else{
		for(var i = 0; i<sizes[0]; i+=1){
			temp_array.push(createNdArray(fill, sizes.slice(1, sizes.length)));
		}
	}
	return temp_array
}


function round(num, places = 0){
	return Math.round(num*(10**places))/(10**places)
}

function random(min, max, round = false){
	if(round === false){
		return Math.random()*(max-min)+min;
	}else{
		// return round(Math.random()*(max-min)+min);
	}
}

function clip(n, min, max){
	return Math.min(Math.max(n, min), max);
}

function roundList(list, places = 0){
	var newList = []
	for(var i = 0; i < list.length; i+=1){
		newList.push(round(list[i], places))
	}
	return newList
}

function dist2line(x, y, line){
	var x1 = line[0];
	var y1 = line[1];
	var x2 = line[2];
	var y2 = line[3];
	var vx = x1 - x;
	var vy = y1 - y;
	var ux = x2 - x1;
	var uy = y2 - y1;

	var length = ux * ux + uy * uy;
	var det = (-vx * ux) + (-vy * uy);
	if(det < 0){
    	return Math.sqrt((x1 - x)**2 + (y1 - y)**2);
	}
    if(det > length){
    	return Math.sqrt((x2 - x)**2 + (y2 - y)**2);
    }
    det = ux * vy - uy * vx
    return Math.sqrt(det**2 / length)
}

function drawGlow(X, Y, size, brightness, col=[255, 255, 255]){
	//probrobly could go in renderer but its usefull to have in other projects
	c.beginPath();
	var glow = c.createRadialGradient(X, Y, 0, X, Y, size);
	glow.addColorStop(0, "rgba("+col[0]+", "+col[1]+","+col[2]+","+brightness+")")
	glow.addColorStop(1, "rgba("+255+", "+255+","+255+", 0)")
	c.fillStyle = glow;
	c.fillRect(X-size, Y-size, size*2, size*2);
}

function fairRandom(min, max, number){

}

function guasianRandom(min, max, amount = 2){
	var total = 0
	for(var i = 0; i < amount; i += 1){
		total += random(min,max);
	}
	return total/Math.floor(amount)
}

function lerp(v0, v1, t) {
    return v0*(1-t)+v1*t
}