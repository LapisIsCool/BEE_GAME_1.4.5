const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world;

gameState = "Play";

var bee;
var beeImage;
var beeFliped;
var hive;
var hiveImage;

var backgroundImage;

var flowerGroup;
var PflowerGroup;
var flowerImage;
var pflowerImage;
var SflowerGroup;
var PSflowerGroup;
var SflowerImage;
var pflowerImage;
var hornet;
var hornetImage;
var bossHornetImage;
var hornetFliped;
var bossHornetFlipedImage;
var Necter = 0;
var Honey = 0;
var Lives = 3;
var edges;
var tempHoney = Honey;
var fCounter = 0;
var FfCounter = 0;
var sfCounter = 0;

function preload() {
  beeImage = loadImage("images/BEEnb.png");
  beeFliped = loadImage("images/BEEFLIPEDnb.png");
  hiveImage = loadImage("images/HIVEnb.png");
  backgroundImage = loadImage("images/Grass.png");
  flowerImage = loadImage("images/FLOWERnb.png");
  FflowerImage = loadImage("images/FFLOWERnb.png");
  pflowerImage = loadImage("images/PFLOWERnb.png");
  SflowerImage = loadImage("images/SUPERFLOWER.png");
  PSflowerImage = loadImage("images/PSUPERFLOWER.png");
  hornetImage = loadImage("images/HORNETnb.png");
  bossHornetImage = loadImage("images/HORNETBOSSnb.png");
  hornetFliped = loadImage("images/HORNETFLIPEDnb.png");
  bossHornetFlipedImage = loadImage("images/HORNETBOSSFLIPEDnb.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight - 26);

  bee = createSprite(windowWidth / 2, windowHeight / 2 - 40, 20, 20);
  bee.addImage("bee", beeImage);
  bee.addImage("beeFlipped", beeFliped);
  bee.scale = 0.05;
  bee.setCollider("rectangle", 0, 0, 1200, 900);
  // bee.debug = true;
  bee.shapeColor = "yellow";

  hive = createSprite(windowWidth / 2, windowHeight / 2, 40, 40);
  hive.addImage(hiveImage);
  hive.scale = 0.1;
  // hive.debug = true;
  // hive.shapeColor = "tan";

  flowerGroup = createGroup();
  FflowerGroup = createGroup();
  PflowerGroup = createGroup();
  SflowerGroup = createGroup();
  PSflowerGroup = createGroup();
  hornetGroup = createGroup();
  bossHornetGroup = createGroup();

  edges = createEdgeSprites();
}

function draw() {
  background("green");
  background(backgroundImage);

  if (gameState === "Play") {
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
      bee.y -= 5;
    }

    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
      bee.y += 5;
    }

    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      bee.x -= 5;
      bee.changeImage("beeFlipped", beeFliped);
    }

    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      bee.x += 5;
      bee.changeImage("bee", beeImage);
    }

    for (var i = 0; i < SflowerGroup.length; i++) {
      if (SflowerGroup.get(i).isTouching(bee)) {
        Necter += 5;
        SflowerGroup.get(i).destroy();
      }
    }

    for (var j = 0; j < flowerGroup.length; j++) {
      if (flowerGroup.get(j).isTouching(bee)) {
        Necter += 1;
        flowerGroup.get(j).destroy();
      }
    }

    for (var y = 0; y < FflowerGroup.length; y++) {
      if (FflowerGroup.get(y).isTouching(bee)) {
        Necter += 10;
        FflowerGroup.get(y).destroy();
      }
    }

    for (var k = 0; k < hornetGroup.length; k++) {
      if (hornetGroup.get(k).isTouching(bee)) {
        Necter = 0;
        Lives -= 1;
        hornetGroup.get(k).destroy();
      }
    }
    //Please don't torture the bee!
    //this is a easteregg
    for (var f = 0; f < bossHornetGroup.length; f++) {
      if (bossHornetGroup.get(f).isTouching(bee)) {
        Necter = 0;
        Lives -= 1;
        bossHornetGroup.get(f).destroy();
      }
    }

    for (var p = 0; p < PflowerGroup.length; p++) {
      if (PflowerGroup.get(p).isTouching(bee)) {
        Necter = 0;
        PflowerGroup.get(p).destroy();
      }
    }

    for (var a = 0; a < PSflowerGroup.length; a++) {
      if (PSflowerGroup.get(a).isTouching(bee)) {
        Necter = 0;
        PSflowerGroup.get(a).destroy();
      }
    }

    if (bee.isTouching(hive)) {
      if ((Necter % 5 === 0 && Necter !== 0) || Necter > 5) {
        Honey = Honey + Math.floor(Necter / 5);
        tempHoney += Math.floor(Necter / 5);
        Necter = Necter - Math.floor(Necter / 5) * 5;
      } else {
        textSize(32);
        fill("red");
        text(
          "You don't have enough necter!",
          windowWidth / 2 - 200,
          windowHeight / 2 + 50
        );
      }
    }

    if (Lives < 3 && Honey >= 10 && Honey % 10 >= 0 && bee.isTouching(hive)) {
      Honey = Honey - 10;
      tempHoney = tempHoney - 10;
      Lives = Lives + 1;

      if (bossHornetGroup.isTouching(bee)) {
        tempHoney = 0;
      }
    }

    bee.collide(hive);

    bee.collide(hornetGroup);

    flowerSpawn();
    spawnHornet();

    // console.log(tempHoney);

    if (
      tempHoney % 15 >= 0 &&
      tempHoney >= 15 &&
      bossHornetGroup.length === 0
    ) {
      spawnBossHornet();
      tempHoney = 0;
    }

    bee.collide(edges);

    bossHornetGroup.bounceOff(edges);

    if (Lives === 0) {
      gameState = "End";
    }
  } else if (gameState === "End") {
    SflowerGroup.destroyEach();
    flowerGroup.destroyEach();
    hornetGroup.destroyEach();
    bossHornetGroup.destroyEach();

    stroke("red");
    fill("red");
    textSize(30);
    text("Game Over ", windowWidth / 2 - 80, windowHeight / 2 - 40);
  }

  stroke("yellow");
  fill("yellow");
  textSize(15);
  text("Nectar: " + Necter, windowWidth / 2 - 25, 20);

  stroke("orange");
  fill("orange");
  textSize(15);
  text("Honey: " + Honey, windowWidth / 2 - 25, 40);

  if (Lives <= 1) {
    stroke("red");
    fill("red");
    textSize(15);
    text("Life: " + Lives, windowWidth / 2 - 25, 60);
  } else {
    stroke("red");
    fill("red");
    textSize(15);
    text("Lives: " + Lives, windowWidth / 2 - 25, 60);
  }

  drawSprites();
}

function flowerSpawn() {
  if (frameCount % 50 === 0) {
    var flower = createSprite(400, 200, 10, 10);
    flower.addImage(flowerImage);
    flower.scale = 0.09;
    //   flower.debug = true;
    //   flower.shapeColor = "red";
    flower.y = Math.round(random(0, windowHeight));
    flower.x = Math.round(random(0, windowWidth));
    flower.lifetime = 300;

    flowerGroup.add(flower);
    fCounter += 1;
  }
  //1000
  if (frameCount % 1000 === 0) {
    var Fflower = createSprite(400, 200, 10, 10);
    Fflower.addImage(FflowerImage);
    Fflower.scale = 0.09;
    Fflower.y = Math.round(random(0, windowHeight));
    Fflower.x = Math.round(random(0, windowWidth));
    Fflower.lifetime = 100;

    FflowerGroup.add(Fflower);
    FfCounter += 1;
  }
  // 200
  if (frameCount % 200 === 0) {
    var Sflower = createSprite(400, 200, 10, 10);
    Sflower.addImage(SflowerImage);
    Sflower.scale = 0.09;
    Sflower.y = Math.round(random(0, windowHeight));
    Sflower.x = Math.round(random(0, windowWidth));
    Sflower.lifetime = 150;

    SflowerGroup.add(Sflower);
    sfCounter += 1;
  }
  //50
  if (fCounter === 25) {
    fCounter = 0;
    var Pflower = createSprite(400, 200, 10, 10);
    Pflower.addImage(pflowerImage);
    Pflower.scale = 0.09;
    Pflower.y = Math.round(random(0, windowHeight));
    Pflower.x = Math.round(random(0, windowWidth));
    Pflower.lifetime = 300;

    PflowerGroup.add(Pflower);
  }
  //25
  if (sfCounter === 15) {
    sfCounter = 0;
    var PSflower = createSprite(400, 200, 10, 10);
    PSflower.addImage(PSflowerImage);
    PSflower.scale = 0.09;
    PSflower.y = Math.round(random(0, windowHeight));
    PSflower.x = Math.round(random(0, windowWidth));
    PSflower.lifetime = 150;

    PSflowerGroup.add(PSflower);
  }
}

function spawnHornet() {
  if (frameCount % 500 === 0) {
    hornet = createSprite(400, 200, 30, 30);
    // hornet.debug = true;
    // hornet.shapeColor = "orange";
    hornet.y = Math.round(random(0, windowHeight));
    hornet.x = Math.round(random(0, windowWidth));
    if (hornet.x < windowWidth / 2) {
      hornet.velocityX = Math.round(random(1, 6));
      hornet.addImage("hornet", hornetImage);
    }

    if (hornet.x > windowWidth / 2) {
      hornet.velocityX = Math.round(random(-6, -1));
      hornet.addImage("hornetFlipped", hornetFliped);
    }

    if (hornet.y < windowHeight / 2) {
      hornet.velocityY = Math.round(random(1, 6));
    }

    if (hornet.y > windowHeight / 2) {
      hornet.velocityY = Math.round(random(-6, -1));
    }

    hornet.lifetime = 500;
    hornet.scale = 0.2;

    hornetGroup.add(hornet);
  }
}

function spawnBossHornet() {
  bossHornet = createSprite(400, 200, 30, 30);
  // hornet.debug = true;
  // hornet.shapeColor = "orange";
  bossHornet.y = Math.round(random(0, windowHeight));
  bossHornet.x = Math.round(random(0, windowWidth));
  if (bossHornet.x < windowWidth / 2) {
    bossHornet.velocityX = 6;
    bossHornet.addImage("bossHornet", bossHornetImage);
  }

  if (bossHornet.x > windowWidth / 2) {
    bossHornet.velocityX = -6;
    bossHornet.addImage("bossHornetFliped", bossHornetFlipedImage);
  }

  if (bossHornet.y < windowHeight / 2) {
    bossHornet.velocityY = 6;
  }

  if (bossHornet.y > windowHeight / 2) {
    bossHornet.velocityY = -6;
  }

  bossHornet.lifetime = 750;
  bossHornet.scale = 0.3;

  bossHornetGroup.add(bossHornet);
}
