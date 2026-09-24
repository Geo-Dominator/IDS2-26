let totalTime = 120; // 2 minutes in seconds
let timeLeft;
let gameStart = false;
let startTime = 0;

let hueR = 0,
  hueG = 0,
  hueB = 0,
  hueA = 255;
let penSize = 10;

let persons = [
  "Cat",
  "Dog",
  "Mouse",
  "Man",
  "Woman",
  "Reptile",
  "Alien",
  "Witch",
  "Wizard",
];
let things = [
  "Building",
  "Mushroom",
  "Plant",
  "Pool",
  "Forest",
  "Field",
  "Tree",
  "Tower",
];
let verbs = [
  "Resting",
  "Eating",
  "Stealing",
  "Hiding",
  "Running",
  "Sitting",
  "Standing",
  "Looking",
];
let adjs = [
  " Red",
  " Green",
  " Blue",
  " Cyan",
  " Magenta",
  " Yellow",
  " Tall",
  " Short",
  " Large",
  " Tiny",
  "n Evil",
  " Holy",
  " Boring",
];

let templates = [
  `A${adj()} ${person()} vs a${adj()} ${person()}`,
  `A${adj()} ${person()} ${verb()} beside a${adj()} ${thing()}`,
  `A${adj()} ${person()}`,
];

let prompt = "";

function setup() {
  createCanvas(800, 500);
  background(255);
  textAlign(CENTER, CENTER);
  generate();
}

function draw() {
  console.log(timeLeft);

  stroke(0);
  strokeWeight(2);
  fill("#C2C3C4");
  rect(0, 0, 800, 75);
  rect(0, 75, 150, 600);
  line(75, 75, 75, 600);
  line(0, 150, 150, 150);
  line(0, 225, 150, 225);
  line(0, 300, 150, 300);
  line(0, 375, 150, 375);

  line(35, 390, 25, 400);
  line(35, 390, 45, 400);
  line(35, 480, 25, 470);
  line(35, 480, 45, 470);
  line(112, 390, 102, 400);
  line(112, 390, 122, 400);
  line(112, 480, 102, 470);
  line(112, 480, 122, 470);

  noStroke();
  fill(255, 0, 0);
  rect(10, 85, 55, 55);
  fill(0, 255, 0);
  rect(10, 160, 55, 55);
  fill(0, 0, 255);
  rect(10, 235, 55, 55);
  fill(0, 255, 255);
  rect(85, 85, 55, 55);
  fill(255, 0, 255);
  rect(85, 160, 55, 55);
  fill(255, 255, 0);
  rect(85, 235, 55, 55);
  fill(0, 0, 0);
  rect(10, 310, 55, 55);
  fill(255, 255, 255);
  rect(85, 310, 55, 55);
  fill(0, 0, 0);
  stroke(0);
  fill("#C2C3C4");
  ellipse(width / 2, height / 10, 100);
  strokeWeight(1);
  fill(0);
  textSize(12), text("CLEAR", 112, 340);
  text("SIZE", 35, 435);
  text(penSize, 35, 445);
  text("OPACITY", 112, 435);
  text(hueA, 112, 445);

  if (timeLeft === 0) {
    textSize(36), text("Times's Up!", 610, 40);
  } else if (gameStart === true) {
    textSize(24), text("Draw the Prompt!", 610, 40);
  } else {
    textSize(24), text("Press any Key to Start", 610, 40);
  }

  if (gameStart === true) {
    randoText();
    Clock();
  }
  if (gameStart === true && timeLeft !== 0) {
    Draw();
  }
}
function randoText() {
  strokeWeight(1);
  fill(0);
  textSize(15), text(prompt, width / 5, height / 12);
}
function Clock() {
  if (gameStart === true) {
    // Calculate remaining seconds
    let elapsedSeconds = floor((millis() - startTime) / 1000);
    timeLeft = max(0, totalTime - elapsedSeconds);

    // Format minutes and seconds
    let minutes = floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    // Pad single digits with a leading zero
    let displaySeconds = seconds < 10 ? "0" + seconds : seconds;
    let displayTime = minutes + ":" + displaySeconds;

    // Draw the timer text
    textSize(48);
    text(displayTime, width / 2, height / 10);
  }
}

function Draw() {
  strokeWeight(penSize);
  stroke(hueR, hueG, hueB, hueA);
  if (mouseIsPressed) {
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
}

function keyPressed() {
  if (gameStart === false) {
    gameStart = true;
    startTime = millis();
  }
}
function mousePressed() {
  if (gameStart === true) {
    //line thickness

    if (mouseX >= 0 && mouseX <= 72 && mouseY >= 380 && mouseY <= 420) {
      penSize += 1;
    }
    if (
      mouseX >= 0 &&
      mouseX <= 72 &&
      mouseY >= 450 &&
      mouseY <= 500 &&
      penSize >= 1
    ) {
      penSize -= 1;
    }

    //line alpha
    if (
      mouseX >= 76 &&
      mouseX <= 150 &&
      mouseY >= 380 &&
      mouseY <= 420 &&
      hueA < 255
    ) {
      hueA += 25;
    }
    if (
      mouseX >= 76 &&
      mouseX <= 150 &&
      mouseY >= 450 &&
      mouseY <= 500 &&
      hueA > 5
    ) {
      hueA -= 25;
    }

    //color changing

    if (mouseX >= 12 && mouseX <= 65 && mouseY >= 90 && mouseY <= 142) {
      hueR = 255;
      hueG = 0;
      hueB = 0;
    }
    if (mouseX >= 12 && mouseX <= 65 && mouseY >= 165 && mouseY <= 215) {
      hueR = 0;
      hueG = 255;
      hueB = 0;
    }
    if (mouseX >= 12 && mouseX <= 65 && mouseY >= 235 && mouseY <= 290) {
      hueR = 0;
      hueG = 0;
      hueB = 255;
    }
    if (mouseX >= 86 && mouseX <= 139 && mouseY >= 90 && mouseY <= 142) {
      hueR = 0;
      hueG = 255;
      hueB = 255;
    }
    if (mouseX >= 86 && mouseX <= 139 && mouseY >= 165 && mouseY <= 215) {
      hueR = 255;
      hueG = 0;
      hueB = 255;
    }
    if (mouseX >= 86 && mouseX <= 139 && mouseY >= 235 && mouseY <= 290) {
      hueR = 255;
      hueG = 255;
      hueB = 0;
    }
    if (mouseX >= 12 && mouseX <= 65 && mouseY >= 309 && mouseY <= 363) {
      hueR = 0;
      hueG = 0;
      hueB = 0;
    }
    if (mouseX >= 86 && mouseX <= 139 && mouseY >= 309 && mouseY <= 363) {
      background(255);
    }
  }
}
//Randomization Station

function generate() {
  let index = floor(Math.random() * templates.length);
  prompt = templates[index];
}

function person() {
  let index = floors(Math.random() * persons.length);
  return persons[index];
}
function thing() {
  let index = floors(Math.random() * things.length);
  return things[index];
}
function verb() {
  let index = floors(Math.random() * verbs.length);
  return verbs[index];
}
function adj() {
  let index = floors(Math.random() * adjs.length);
  return adjs[index];
}
function floors(n) {
  console.log(n - (n % 1));
  return n - (n % 1);
}
