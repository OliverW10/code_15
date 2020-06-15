
var dataRange = [0, 25];
var username = "Olikat";
var feed_key = "Inside";
var io_key = "aio_rdQf15MbEQi8rI1OBhuJYLvm9tu0";

function getData(){
	// interface with the adafruit api
	// var http = new XMLHttpRequest();
	// http.open("GET", `https://io.adafruit.com/api/v2/${username}/feeds/${feed_key}/data?x-aio-key=${}`);
	// http.send();
	// http.onreadystatechange = function() {
	//     if (this.readyState == 4 && this.status == 200) {
	//        // Typical action to be performed when the document is ready:
	//        console.log("got scores")
	//        leaderboard = JSON.parse(http.responseText);
	//        sortedLeaderboard = sortLeaderboard();
	//     }
	// };

	var dummyData = [];
	for(var i = 0; i < 100; i += 1){
		dummyData.push(random(dataRange[0], dataRange[1]));
	}
	return dummyData;
}

function PersToPxls(pers){ // converts a rect from percent to pixel locations
	return [pers[0] * canvas.width, pers[1] * canvas.height, pers[2] * canvas.width, pers[3] * canvas.height];
}

function drawLineGraph(data, rectPers){
	var rect = PersToPxls(rectPers);

	c.beginPath();
	c.strokeStyle = "rgb(200, 200, 200)";
	c.lineWidth = 2;
	c.rect(rect[0], rect[1], rect[2], rect[3]);
	c.stroke();

	c.moveTo(rect[0], rect[1]+rect[3]);
	for(var i = 0; i < data.length; i += 1){
		c.lineTo(scaleNumber(i, 0, data.length, rect[0], rect[0]+rect[2]), scaleNumber(data[i], dataRange[0], dataRange[1], rect[1]+rect[3], rect[1]));
	}
	c.stroke();
}

function drawCurrent(amount, pos, size){
	c.beginPath();
	c.lineWidth = size*canvas.width*0.3;
	c.strokeStyle = "rgba(200, 200, 200, 0.1)";
	c.arc(pos[0] * canvas.width, pos[1] * canvas.height, size*canvas.width*0.5, Math.PI*0.5, Math.PI*2.5);
	c.stroke();

	c.beginPath();
	c.strokeStyle = "rgb(200, 200, 200)";
	c.lineWidth = size*canvas.width*0.3;
	c.arc(pos[0] * canvas.width, pos[1] * canvas.height, size*canvas.width*0.5, Math.PI*0.5, Math.PI*2* (amount / dataRange[1]));
	c.stroke();
}

function update(){
	// var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	// var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

	// canvas.width = w;
	// canvas.height = h;

	c.beginPath();
	c.fillStyle = "rgb(0, 0, 0)";
	c.fillRect(0, 0, canvas.width, canvas.height);

	var points = getData();
	drawLineGraph(points, [0.1, 0.1, 0.3, 0.2]);
	drawCurrent(points[0], [0.2, 0.5], 0.1);
}

setInterval(update, 1000/60)