const Engine = Matter.Engine;
const World= Matter.World;
const Bodies = Matter.Bodies;

var engine, world;

var pc, npc;
var ground, groundimg, invisground;
var backgroundImg;
var obstacles1, obstacles2, obstacles3;


var START = 0;
var PLAY = 1;
var END = 2;
var gameState = "START";

var startImg, restartImg;
var start, restart;




var count = 0;

function preload(){
groundimg = loadImage('road.jpg')

startImg = loadImage('starting.png')

restartImg = loadImage('purple_button.png')

}

function setup(){
    var canvas = createCanvas(800, 800);
    engine = Engine.create();
    world = engine.world;

    var ground = createSprite(0, 600, 800, 20);
    ground.addImage(groundimg)
    ground.x = ground.width /2;

    var invisGround = createSprite(0, 700, 800,5);
    invisGround.visible = false;
    invisGround.static = true

    start = createSprite(200,300);
    restart = createSprite(200,340);

    start.addImage(startImg);
    start.scale = 0.5;

    restart.addImage(restartImg);
    restart.scale = 0.5;

    start.visible = true;
    restart.visible = false;

    pc = createSprite(100, 720, 15, 15);
    pc.static = false;


}

function draw(){
    background('sunset.jpg');
    Engine.update(engine);

    text("Score: "+ count, 250, 100);
  console.log(gameState);

  if(gameState === "START") {
    pc.velocityX = 0;
    pc.velocityY = 0;
    if(mousePressedOver(start)) {
      gameUpdate();
    }
  }
  
  else if(gameState === "PLAY"){
    console.log(gameState);

    
    count = count + Math.round(World.frameRate/60);
    //move the ground
    ground.velocityx = -(6 + 3*count/100);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    if(keyDown("space") && pc.y >= 359){
      pc.velocityY = -12 ;
      playSound("jump.mp3");
    }
  
    //add gravity
    pc.velocityY = pc.velocityY + 0.8;
    
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles
    spawnObstacles();
    
    //End the game when pc is touching the obstacle
    if(ObstaclesGroup.isTouching(pc)){
      playSound("jump.mp3");
      gameState = END;
      playSound("die.mp3");
    }
  }
  
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    pc.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    
    //set lifetime of the game objects so that they are never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
    
    
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
  
  //pc.collide(invisibleGround);
  
  drawSprites();
}

function gameUpdate() {
  gameState = "PLAY";
}

function reset() {
  gameState = "START"
}