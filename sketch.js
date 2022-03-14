let player = {
  pos : [400, 400],
  vel : [0, 0],
  d : 20
};

let mist;
let mistTail;
let square;
let squareSpin;
let lines;

let time = 0;

let objects = [
  //{x : 400, y : 400, d : 100},
  //{x : 200, y : 200, d : 100}
];

function setup() {

  createCanvas(windowWidth - 2, windowHeight - 4);
  noStroke();
  fill(255);

  mist = createGraphics(3000, 3000)
  mist.noStroke();
  mist.ellipseMode(CENTER);
  mist.fill(125, 125, 125, 1);

  mistTail = createGraphics(3000, 3000)
  mistTail.noStroke();
  mistTail.ellipseMode(CENTER);
  mistTail.fill(125, 125, 125, 5);
  mistTail.background(0, 40, 50);

  square = createGraphics(3000, 3000)
  square.noStroke();
  square.rectMode(CENTER);
  square.fill(125, 125, 125, 1);

  squareSpin = createGraphics(3000, 3000)
  squareSpin.noStroke();
  squareSpin.rectMode(CENTER);
  squareSpin.fill(125, 125, 125, 1);

  lines = createGraphics(3000, 3000);
  lines.stroke(125, 125, 125);
  lines.strokeWeight(.1);

  mist.push();

  for (let i = 0; i < 50; i++) {

    objects.push({x : random(0, 2000), y : random(0, 1100), d : random(0, 200)});

   	mistTail.fill((10 * i) % 255);
   	mistTail.ellipse(objects[i].x, objects[i].y, objects[i].d, objects[i].d);

  }

  mist.pop()

}

function draw() {

	time++;

  let closest = objects[0];
  let distClosest = dist(objects[0].x, objects[0].y, player.pos[0], player.pos[1]) - objects[0].d / 2 - player.d / 2;

  objects.forEach((item, i) => {

    distToPlayer = dist(item.x, item.y, player.pos[0], player.pos[1]) - item.d / 2 - player.d / 2;
    
    [distClosest, closest] = 
    	distClosest < distToPlayer 
    		? [distClosest, closest] 
    		: [distToPlayer, item];

  });

  // draw mist
  //mist.fill(sin(sq(time) * 3) * 255, sin(sq(time) * 5) * 255, sin(sq(time) * 7) * 255, 5);
  mist.fill(sin(sq(time / 1000) * 3) * 255, sin(sq(time / 2000) * 5) * 255, sin(sq(time / 2000) * 7) * 255, 5);
  mist.ellipse(player.pos[0], player.pos[1], distClosest * 2 + player.d, distClosest * 2 + player.d);
  
  // draw mist tail
  //mistTail.fill(sin(sq(time) * 3) * 255, sin(sq(time) * 5) * 255, sin(sq(time) * 7) * 255, 5);
  mistTail.fill(125, 125, 125, 1);
  mistTail.ellipse(player.pos[0], player.pos[1], distClosest * 2 + player.d, distClosest * 2 + player.d);
  mistTail.fill(255);
  mistTail.ellipse(player.pos[0], player.pos[1], player.d, player.d);

  square.fill(sin(sq(time / 2000) * 3) * 255, sin(sq(time / 2000) * 5) * 255, sin(sq(time / 2000) * 7) * 255, 5);
  square.square(player.pos[0], player.pos[1], sqrt(sq(distClosest * 2 + player.d) / 2));

  squareSpin.push();
  squareSpin.translate(player.pos[0], player.pos[1]);
  squareSpin.rotate(time / 1000);
  squareSpin.fill(sin(sq(time / 2000) * 3) * 255, sin(sq(time / 2000) * 5) * 255, sin(sq(time / 2000) * 7) * 255, 5);
  squareSpin.square(0, 0, sqrt(sq(distClosest * 2 + player.d) / 2));
  squareSpin.pop();

  lines.stroke(sin(sq(time / 1000) * 3) * 255, sin(sq(time / 2000) * 5) * 255, sin(sq(time / 2000) * 7) * 255);
  lines.line(closest.x, closest.y, player.pos[0], player.pos[1]);

	// clear screen
  background(255);//(0, 40, 50);

  // draw graphics
  if (keyIsDown(32) && keyIsDown(SHIFT)) {

  	image(squareSpin, 0, 0);

  } else if (keyIsDown(32)) {

  	image(mistTail, 0, 0);

  } else if (keyIsDown(SHIFT)) {

  	image(square, 0, 0);

  } else if (keyIsDown(CONTROL)){

  	image(lines, 0, 0);

  } else {

  	image(mist, 0, 0);

  }

  ellipse(player.pos[0], player.pos[1], player.d, player.d);

  movePlayer(closest, distClosest);

}

function movePlayer(closest, distToClosest) {

	// apply friction
	player.vel[0] = player.vel[0] * .99;
	player.vel[1] = player.vel[1] * .99;

	// accellerate player away from collision
	if (distToClosest < 0) {

		let distX = abs(closest.x - player.pos[0]);
		let distY = abs(closest.y - player.pos[1]);

		if (distX > 0) {

			player.vel[0] += cos(atan(distY / distX)) * distToClosest 
	  		  * (closest.x - player.pos[0] > 0 ? 1 : -1);

	 	 	player.vel[1] += sin(atan(distY / distX)) * distToClosest
	  		  * (closest.y - player.pos[1] > 0 ? 1 : -1);

		} else {

			player.vel[1] += distClosest * (closest.y - player.pos[1] > 0 ? 1 : -1);

		}

	}


	let distMouse = sqrt(sq(mouseX - player.pos[0]) + sq(mouseY - player.pos[1]));

	// figure speed
	let followSpeed =  distMouse / 1000;

	// follow mouse
	let distX = abs(mouseX - player.pos[0]);
	let distY = abs(mouseY - player.pos[1]);

  if (distX > 0) {

  	player.vel[0] += 
  		cos(atan(distY / distX)) * followSpeed
  			* (mouseX - player.pos[0] > 0 ? 1 : -1),
  	
  	player.vel[1] +=	
  		sin(atan(distY / distX)) * followSpeed
  			* (mouseY - player.pos[1] > 0 ? 1 : -1);

  } else {

  		player.vel[1] += followSpeed
  			* (mouseY - player.pos[1] > 0 ? 1 : -1);

  }

  /* push wiht mouse
  if (distMouse < player.d * 2) {

	  if (distX > 0) {

	  	player.vel[0] += 
	  		cos(atan(distY / distX)) * 10
	  			* (mouseX - player.pos[0] > 0 ? -1 : 1),
	  	
	  	player.vel[1] +=	
	  		sin(atan(distY / distX)) * 10
	  			* (mouseY - player.pos[1] > 0 ? -1 : 1);

	  } else {

	  		player.vel[1] += 10
	  			* (mouseY - player.pos[1] > 0 ? -1 : 1);

	  }

	}*/


	// apply velocity
  player.pos[0] += player.vel[0];
  player.pos[1] += player.vel[1];

}

function windowResized() {

  createCanvas(windowWidth - 2, windowHeight - 4);
  background(125);

}