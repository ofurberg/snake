//pre settings
var snakeX = 2; // starting x position for snake
var snakeY = 2; // starting x position for snake
var height = 28; // height on the containing box
var width = 50; // width of the containing box
var interval = 100; // speed of the game
var increment = 4; // size snake increases with each apple eaten

//game variables
var length = 0; // left on the snake
var tailX = [snakeX];
var tailY = [snakeY];
var fX;
var fY;
var running = false;
var gameOver = false;
var direction = -1; // up = 0, down = -1, left = 1, right = 2
var tempdir = direction; // temporary direction, that fixes issue of players turning too fast
var int;
var score = 0; // game score


/**
* entry point of the game
*/
function run(){
    init();
    int = setInterval(gameLoop, interval);
}

function init(){
    createMap();
    createSnake();
    createFruit();
}

/**
* Generates the map for the snake
* Breaks if you put br after opening <table> and not after closing
*/
function createMap(){
    document.write("<table>");
    for(var y = 0; y < height; y++){
        document.write("<tr>");
        for(var x = 0; x < width; x++){
            if(x == 0 || x == width -1 || y == 0 || y == height -1){
                document.write("<td class='wall' id='"+ x + "-" + y +"'></td>");
            } else{
                document.write("<td class='blank' id='"+ x + "-" + y +"'></td>");
            }
        }
        document.write("</tr>");
    }
    document.write("</table>");
}

function createSnake(){
    set(snakeX, snakeY, "snake");
}

function get(x,y){
    return document.getElementById(x+"-"+y);
}

function set(x,y,value){
    if(x != null && y != null)
        get(x,y).setAttribute("class", value);
}

function rand(min,max){
    return Math.floor(Math.random() * (max - min) + min);
}

function getType(x,y){
    return get(x,y).getAttribute("class");
}

function createFruit(){
    var found = false;
    while(!found && (length < (width-2)*(height-2)+1)){
        var appleX = rand(1,width-1);
        var appleY = rand(1,height-1);
        if(getType(appleX, appleY) == "blank"){
            found = true;
        }
    }
    set(appleX, appleY, "apple");
    fX = appleX;
    fY = appleY;
}

/**
 * NOTE: notice use of new variable tempdir
 */
window.addEventListener("keypress", function key(event){
    //if key is W set direction up
    var key = event.keyCode;
    if(direction != -1 && (key == 119 || key == 87)){
        tempdir = 0;
    //if key is S set direction down
    } else if(direction != 0 && (key == 115 || key == 83)){
        tempdir = -1;
    //if key is A set direction left
    } else if(direction != 2 && (key == 97 || key == 65)){
        tempdir = 1;
    //if key is D set direction right
    } else if(direction != 1 && (key == 100 || key == 68)){
        tempdir = 2;
    }
    if(!running) {
        running = true;
    } else if(key == 32) {
        running = false;
    }
});

function gameLoop(){
    if(running && !gameOver){
        update();
    } else if(gameOver){
        clearInterval(int);
    }
}

/**
 * NOTE: notice use of new variable tempdir
 */
function update(){
    direction = tempdir;
    //prevents apple from not showing up
    set(fX, fY, "apple");
    //update the tail
    updateTail();
    //sets the last segment of the tail to blank  before moving the snake
    set(tailX[length], tailY[length], "blank");
    //updates the position of the snake according to the direction
    if(direction == 0){
        snakeY--;
    } else if(direction == -1) {
        snakeY++;
    } else if(direction == 1) {
        snakeX--;
    } else if(direction == 2) {
        snakeX++;
    }
    //draws the head of the snake on the tail
    set(snakeX, snakeY, "snake");
    //checks for collisions with self
    for(var i = tailX.length-1; i >=0; i--){
        if(snakeX == tailX[i] && snakeY == tailY[i]){
            alert("Game over, refresh the page to play again!");
            gameOver = true;
            break;
        }
    }
    //checks for collision with wall
    if(snakeX == 0 || snakeX == width-1 || snakeY == 0 || snakeY == height-1){
        gameOver = true;
        alert("Game over, refresh the page to play again!");
    //checks for collisions with apple
    } else if(snakeX == fX && snakeY == fY){
        //adds 4 to the score
        score += 4;
        //creates new apple, which automatically replaces the old one
        createFruit();
        //adds the set increment to the length of the snake making it longer
        length += increment;
    }
    //set
    document.getElementById("score").innerHTML = "Score: "+ score;
}

function updateTail(){
    for(var i = length; i > 0; i--){
        tailX[i] = tailX[i-1];
        tailY[i] = tailY[i-1];
    }
    tailX[0] = snakeX;
    tailY[0] = snakeY;
}

run();
