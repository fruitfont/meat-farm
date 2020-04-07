let p = {
  camX: 14000,
  camY: 0,
  dir: 1,
  x: 14000,
  y: 0,
  veX: 0,
  veY: 0,
  maxSpeed: 7,
  attack: 0,
  arm: 0,
  meat: 0,
  nearestTree: 0,
  treeAlive: 0,
  nearestNumb: 0,
  nearestTreeEffect: 0,
}
let meat = [{}]
let tip = 1;
let tipEffect = 0;
let oops = {
  on: 0,
  effect: 0,
  time: 0,
}
let txtr = {}
let keys = [];
let treeSelect = [];
let treesDead = [];
let treesDeadEffect = [];
let treeTimes = [];
let menuEffect = 0;
let menuOn = false;
let settings = false;
let shift = 0;
let jump = 0;
let multiplier = {
  amount: 1,
  times: 0,
  cost: 0,
}
let adder = {
  amount: 0,
  times: 0,
  cost: 0,
}
let myFont;


function preload() {
  myFont = loadFont('assets/Sweet.otf');
  txtr.headR = loadImage('assets/headR.png');
  txtr.legR = loadImage('assets/legR.png');
  txtr.headL = loadImage('assets/headL.png');
  txtr.legL = loadImage('assets/legL.png');
  txtr.armL = loadImage('assets/armL.png');
  txtr.armR = loadImage('assets/armR.png');
  txtr.handL = loadImage('assets/handL.png');
  txtr.handR = loadImage('assets/handR.png');
  txtr.axL = loadImage('assets/axL.png');
  txtr.axR = loadImage('assets/axR.png');
  txtr.tree0 = loadImage('assets/tree0.png');
  txtr.tree1 = loadImage('assets/tree1.png');
  txtr.tip = loadImage('assets/tip.png');
  txtr.meat = loadImage('assets/meat.png');
  txtr.shop = loadImage('assets/shop.png');
  txtr.gear = loadImage('assets/gear.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noiseSeed(4474);
  textFont(myFont);
  pixelDensity(0.9);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

keyPressed = function() {
  keys[keyCode] = keys[key.toString().toLowerCase()] = true;
  if (keys[16] || keys[88]) {
    attack();
  }
  if (keys[82]) {
    treesDeadEffect = [];
    treesDead = [];
    treeTimes = [];
    treeSelect = [];
  }
};
keyReleased = function() {
  keys[keyCode] = keys[key.toString().toLowerCase()] = false;
};

function draw() {
  noSmooth();
  blendMode(BLEND);
  drawPaper();
  if(!menuOn) {
    move();
  }
  drawScene();
  push();
  translate(50, 50);
  rotate(millis()/1000);
  image(txtr.gear, 0, 0, txtr.gear.width, txtr.gear.height);
  pop();
  treeCheck();
  tipEffect += (!tip - tipEffect) / 8;
  image(txtr.tip, width / 2, -20 + height - txtr.tip.height / 4 + tipEffect * txtr.tip.height, txtr.tip.width / 2, txtr.tip.height / 2);
  noStroke();
  fill(0);
  textSize(30);
  if(menuOn) {
    menuEffect += (1-menuEffect)/8;
  }else{
    menuEffect += (0-menuEffect)/8;  
  }
  menu();
  textAlign(RIGHT, TOP);
  textSize(30);
  text(p.meat + " meat", width - 10, 0);
}

function mousePressed() {
  if(menuOn) {
    if(mouseY>height-70) {
    menuOn = 0;
      if(!settings) {
        p.x -= 100;
      }
  }
  if(!settings) {
  if(mouseY>140&&mouseY<160&&p.meat>=multiplier.cost) {
    multiplier.times += 1;
    multiplier.amount += 1;
    p.meat -= multiplier.cost;
  }
  if(mouseY>100&&mouseY<120&&p.meat>=adder.cost) {
    adder.times += 1;
    adder.amount += 1;
    p.meat -= adder.cost;
  }
  }else{
  
  if(mouseY>140&&mouseY<190) {
    if(mouseIsPressed) {
      pixelDensity(map(mouseX, 0, width, 0.01, 1));
    }
  }
  }
  }else{
    if(mouseX>100 || mouseY>100) {
      attack();
    }else{
      settings = true;
      menuOn = true;
    }
  }
}

function menu() {
  fill(255);
  push();
  translate(0, 10+height-menuEffect*(height+10));
  rect(0, 0, width, height);
  pop();
  fill(0);
  textSize(40);
  if(!settings) {
    textAlign(CENTER, TOP);
    text("shop", -width/2+menuEffect*width, 0);
  }else{
    textAlign(CENTER, TOP);
    text("graphics", -width/2+menuEffect*width, 0);
  }
  push();
  translate(0, 10+height-menuEffect*(height+10));
  textAlign(CENTER, BOTTOM);
  noStroke();
  textSize(25);
  if(!settings) {
  textAlign(CENTER, BOTTOM);
  text("tap here to exit", width/2, height);
  textAlign(CENTER, TOP);
  text("anywhere from "+(1+adder.amount)*multiplier.amount+" to "+(6+adder.amount)*multiplier.amount+" meat per tree", 5, 200, width-10);
  textAlign(LEFT, TOP);
  text("adder +1: ", 20, 90);
  text("currently: "+adder.amount, 20, 110);
  textAlign(RIGHT, TOP);
  adder.cost = floor((adder.times+2)**3+52);
  text(adder.cost+" meat", width-20, 90);
  
  textAlign(LEFT, TOP);
  text("multiplier +1: ", 20, 130);
  text("currently: "+multiplier.amount, 20, 150);
  
  textAlign(RIGHT, TOP);
  multiplier.cost = floor((multiplier.times+2)**4+34);
  text(multiplier.cost+" meat", width-20, 130);
  }else{
    textAlign(CENTER, TOP);
  text("tap anywhere in the black bar to change the graphics quality", 5, 60, width-10);
  rect(0, 140, width, 50);
    textAlign(CENTER, TOP);
  text("current quality: "+ceil(100*pixelDensity()), width/2, 200);
    textAlign(CENTER, BOTTOM);
    text("tap here to exit", width/2, height);
  
  }
    
  stroke(0, 0, 0, 32);
  for(let i = 0; i < width/10+1; i++) {
    line(0, i*20, width, i*20);
  }
  for(let i = 0; i < width/10+1; i++) {
    line(i*20, 0, i*20, height);
  }
  pop();
  noStroke();
}

function move() {
  if(mouseIsPressed) {
    if(mouseY<height/3) {
      jump = 1;
    }else{
      jump = 0;
    }
    if(mouseY>height-height/3) {
      shift = 1;
    }else{
      shift = 0;
    }
  }else{
    shift = 0;
    jump = 0;
  }
  past = 0;
  if (keys[37] && keys[39]) {
  let past = p.dir;
  }
  if(keys[65] && keys[68]) {
  let past = p.dir;
  }
  
  
  if (keys[37] || keys[65]) {
    if (p.dir === 1) {
      p.dir = -1;
      p.arm = 1;
    }
    p.veX += (-p.maxSpeed - p.veX) / 16;
  }
  
  if (keys[39] || keys[68]) {
    if (p.dir === -1) {
      p.dir = 1;
      p.arm = 1;
    }
    p.veX += (p.maxSpeed - p.veX) / 16;
  }
  if (!keys[37] && !keys[65] && !keys[39] && !keys[68]) {
    p.veX /= 1.1;
  }
  if ((keys[38]||keys[87]||keys[32]||jump)&&p.j===1) {
    p.veY = 5;
  }
  if (p.y > 0 - 1) {
    if (keys[40] || keys[83] ||shift) {
      p.veY -= 0.8;
    } else {
      p.veY -= 0.2;
    }
    p.y += p.veY;
    p.j = 0;
  }
  p.y += p.veY;
  if (p.y < 0 + 1) {
    p.veY = 0;
    p.y = 0;
    p.j = 1;
  }
  if (past !== 0) {
  p.dir = past;
  }
  if (keys[37] && keys[39]) {
  p.veX = 0;
  }
  if(keys[65] && keys[68]) {
  p.veX = 0;
  }
  
  if(mouseIsPressed) {
    if (mouseX<width&&mouseX>0) {
      p.veX = map(mouseX, 0, width, -p.maxSpeed, p.maxSpeed);
    }else{
      if(mouseX>width) {
        p.veX = p.maxSpeed;
      }else{
        p.veX = -p.maxSpeed;
      }
    }
    if(mouseX>width/2) {
      if(p.dir === -1) {
        p.arm = 1;
      }
      p.dir = 1;
    }else{
      if(p.dir === 1) {
        p.arm = 1;
      }
      p.dir = -1;
    }
  }
  
  if (p.y > 0) {
    p.x += p.veX * 2;
  } else {
    p.x += p.veX * 1.5;
  }
  p.camX += (p.x - p.camX) / 6;
  p.camY += (p.y - p.camY) / 2;

  p.attack /= 1.5;
  p.arm /= 1.5
}

function treeCheck() {
  let treeTime = 0;
  for (let property in treesDead) {
    if (treeTimes[property] > treeTime) {
      treeTime = treeTimes[property];
    }
    if (millis() - treeTimes[property] > 10000) {
      treesDead[property] = 0;
    }
    if (treesDeadEffect[property] == null) {
      treesDeadEffect[property] = 0;
    } else {
      treesDeadEffect[property] += (treesDead[property] - treesDeadEffect[property]) / 8;
      if(treesDeadEffect[property]==0) {
        treesDeadEffect[property] = null;
        treesDead[property] = null;
        treeTimes[property] = null;
      }
    }
  }
  if (millis() - treeTime > 12000) {
    treesDeadEffect = [];
    treesDead = [];
    treeTimes = [];
  }
}

function drawPlayer() {
  if (p.dir == 1) {
    push();
    translate(width / 2 + p.x - p.camX + 9, height / 1.5 + p.y - p.camY - txtr.headR.height / 3.5 + 20);
    rotate(sin(millis() / -100) * (p.veX / 10));
    image(txtr.legR, 2, 10, txtr.headR.width / 4, txtr.headR.height / 4);
    pop();
    push();
    translate(width / 2 + p.x - p.camX - 5, height / 1.5 + p.y - p.camY - txtr.headR.height / 3.5 + 20);
    rotate(sin(millis() / 100) * (p.veX / 10) + 0.1);
    image(txtr.legR, 2, 10, txtr.headR.width / 4, txtr.headR.height / 4);
    pop();
    drawArm();
    image(txtr.headR, width / 2 + p.x - p.camX, height / 1.5 + p.y - p.camY - txtr.headR.height / 3.5, txtr.headR.width / 3, txtr.headR.height / 3);
  } else {
    push();
    translate(width / 2 + p.x - p.camX - 13, height / 1.5 + p.y - p.camY - txtr.headL.height / 3.5 + 20);
    rotate(sin(millis() / -100) * (p.veX / 10));
    image(txtr.legL, 2, 10, txtr.headL.width / 4, txtr.headL.height / 4);
    pop();
    push();
    translate(width / 2 + p.x - p.camX + 1, height / 1.5 + p.y - p.camY - txtr.headL.height / 3.5 + 20);
    rotate(sin(millis() / 100) * (p.veX / 10) - 0.1);
    image(txtr.legL, 2, 10, txtr.headL.width / 4, txtr.headL.height / 4);
    pop();
    drawArm();
    image(txtr.headL, width / 2 + p.x - p.camX - 1, height / 1.5 + p.y - p.camY - txtr.headL.height / 3.5, txtr.headL.width / 3, txtr.headL.height / 3);
  }
}

function drawArm() {
  if (p.dir === 1) {
    push();
    translate(width / 2 + p.x - p.camX, height / 1.5 + p.y - p.camY - txtr.headR.height / 3.5);
    rotate(sin(millis() / 100) * p.veX / 100 + p.attack + p.arm);
    image(txtr.armR, 28, 5, txtr.armR.width / 3, txtr.armR.height / 3);
    image(txtr.handR, 45, 5, txtr.handR.width / 3.5, txtr.handR.height / 3.5);
    image(txtr.axR, 57, -10, txtr.axR.width / 3.5, txtr.axR.height / 3.5);
    pop();

  } else {

    push();
    translate(width / 2 + p.x - p.camX, height / 1.5 + p.y - p.camY - txtr.headR.height / 3.5);
    rotate(sin(millis() / 100) * p.veX / -100 - p.attack - p.arm);
    image(txtr.armL, -28, 5, txtr.armL.width / 3, txtr.armL.height / 3);
    image(txtr.handL, -45, 5, txtr.handL.width / 3.5, txtr.handL.height / 3.5);
    image(txtr.axL, -57, -10, txtr.axL.width / 3.5, txtr.axL.height / 3.5);
    pop();
  }
}

function attack() {
  if (tip) {
    tip = 0;
  }
      
  //p.x = p.nearestTree-200;
  let noiseValue = noise(p.nearestTree * 0.08);
      if (p.nearestTree / 300 == floor(p.nearestTree / 300) && noiseValue > 0.55 || noiseValue < 0.45) {
      if(treesDead[p.nearestTree]==null||treesDead[p.nearestTree]==0) {
      for(let i = 0; i < (random(1, 6)+adder.amount)*multiplier.amount; i++) {
        meat[meat.length] = {
          x: p.nearestTree + random(-10, 10),
          y: 20,
          size: random(0, 15),
        };
      }
        p.attack = 1;
      treesDead[p.nearestTree] = 1;
      treeTimes[p.nearestTree] = millis();
      }else{
      p.arm = 0.1;
      }
      }else{
        if(noiseValue<0.5&&noiseValue>0.47) {
          menuOn = !menuOn;
          settings = false;
        }
        if(menuOn&&settings) {
          menuOn = 0;
        }
        if(!menuOn) {
          p.arm = 0.1;
        }
      }
}

function drawPaper() {
  background(255);
  push();
  translate(width / 2, height / 2);
  noStroke();
  fill(255);
  rect(-width / 2, -height / 2, width, height);
  strokeWeight(4);
  stroke(212, 105, 78, 100);
  for (let i = 0; i < width / 40; i++) {
    line(-width / 2, -height / 2 + 60 + i * 40, width / 2, -height / 2 + 60 + i * 40);
  }
  stroke(82, 169, 209, 100);
  line(-width / 2 + 30 + width / 10, -height / 2, -width / 2 + 30 + width / 10, height / 2);
  pop();
}

function drawScene() {
  p.nearestTree = floor((p.x + width / 2 + 150) / 300) * 300;
  p.nearestNumb = ((p.x + width / 2 + 150) / 300) * 300;
  //tint(255, 200);
  for (let i = floor(p.camX) - 110; i < floor(p.camX) + width + 110; i++) {
    if (treesDead[i] == null) {
      treesDead[i] = 0;
      treesDeadEffect[i] = 0;
    }
    if (i==p.nearestTree) {
      if (treeSelect[i]==null) {
        treeSelect[i] = 1;
      }else{
        treeSelect[i] += (1-treeSelect[i])/8;
      }
    }else{
      if (treeSelect[i]==null) {
        treeSelect[i] = 0;
      }else{
        treeSelect[i] += (0-treeSelect[i])/8;
      }
    }
    let noiseVal = noise(i * 0.08);
    imageMode(CENTER);
    textAlign(CENTER);
    fill(0);
    if (i / 300 == floor(i / 300)) {
      if (noiseVal > 0.55) {
        if(treeTimes[i]!==null) {
          text(10-floor(millis()/1000-treeTimes[i]/1000)+" seconds", i - p.camX, 50+treesDeadEffect[i] * -200 + height / 1.5 + p.camY);
        }
        image(txtr.tree0, i - p.camX, treesDeadEffect[i] * 200 + height / 1.5 - 80 + p.camY- sin(millis()/100)*(treeSelect[i] * 3), txtr.tree0.width / 2, txtr.tree0.height / 2);
      } else {
        if (noiseVal < 0.45) {
          if(treeTimes[i]!==null) {
          text(10-floor(millis()/1000-treeTimes[i]/1000)+" seconds", i - p.camX, 50+treesDeadEffect[i] * -200 + height / 1.5 + p.camY);
        }
          image(txtr.tree1, i - p.camX, treesDeadEffect[i] * 200 + height / 1.5 - 80 + p.camY - sin(millis()/100)*(treeSelect[i] * 3), txtr.tree0.width / 2, txtr.tree0.height / 2);
        }else{
        if(noiseVal<0.5&&noiseVal>0.47) {
          image(txtr.shop, i - p.camX, treesDeadEffect[i] * 200 + height / 1.5 - 80 + p.camY - treeSelect[i] + sin(millis() / 200) * (treeSelect[i] * 10), txtr.shop.width / 2, txtr.shop.height / 2);
        }
        }
      }
    }
  }
  noTint();
  fill(0);
  for (let i = 0; i < meat.length; i++) {
    if (meat[i] !== null) {
      image(txtr.meat, meat[i].x - p.camX, sin(millis()/200+meat[i].size)*5+-20 + height / 1.5 + meat[i].y + p.camY, txtr.meat.width/3+meat[i].size, txtr.meat.height/3+meat[i].size);
      meat[i].y /= 1.2;
      if (p.x + width / 2 - 10 < meat[i].x && p.x + width / 2 + 20 > meat[i].x&& p.y<30) {
        p.meat += 1;
        meat[i] = null;
      }
    }
  }
  drawPlayer();
  fill(201, 145, 117);
  stroke(0);
  strokeWeight(5);
  beginShape()
  vertex(-10, height+10);
  for (let i = -10; i < width/100+10; i++) {
    vertex(map(i, -10, width/100+10, -10, width+50), -10+sin(millis()/300+((i*100)+p.camX)/100)*4+p.camY+height/1.5);
  }
  vertex(width+10, height+10)
  endShape(CLOSE);
  //rect(-20, p.camY+height/1.5-10, width+40, height-height/1.5+30)
}
