import { Game } from "./game.js";

let canvas = document.getElementById("canvas");

let ctx = canvas.getContext("2d");

let GAMEWIDTH = 1280, GAMEHEIGHT = 720;

let lastTime = 0;

var game = new Game(GAMEWIDTH,GAMEHEIGHT, canvas, ctx);

function gameLoop(timestamp){

    let dt = timestamp - lastTime;
    lastTime = timestamp;
    game.update(dt);

    game.render(ctx);

    requestAnimationFrame(gameLoop);
}

gameLoop();