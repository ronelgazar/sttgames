import Game from "./game.js";
import Button from "./button.js"

let canvas = document.getElementById("gameScreen");

let ctx = canvas.getContext("2d");

let GAMEWIDTH = 1600, GAMEHEIGHT = 900;

let lastTime = 0;

let game = new Game(GAMEWIDTH,GAMEHEIGHT, canvas,ctx);

function gameLoop(timestamp){

    let dt = timestamp - lastTime;
    lastTime = timestamp;
    game.update(dt);

    game.render(ctx);

    requestAnimationFrame(gameLoop);
}

gameLoop();

