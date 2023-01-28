import { MenuStage, LevelStage, GameStage } from "./stages.js";
import Recognizer from "./reco.js";


export default class Game{

    constructor(gameWidth, gameHeight, canvas, ctx){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.mx = 0;
        this.my = 0;
        this.canvas = canvas;
        this.ctx = ctx;
        this.click = false;

        this.images = [];

        this.correctAudio = new Audio("./src/res/voices/right.wav");
        this.wonAudio = new Audio("./src/res/voices/win.mp3")

        for(let i = 1; i<=9; i++){
            this.images.push(new Image());
            this.images[i - 1].src = "./src/res/images/color" + parseInt(i) + ".png";
        }

        this.grid1 = new Image();
        this.grid2 = new Image();

        this.grid1.src = "./src/res/images/grid3x3.png";
        this.grid2.src = "./src/res/images/grid4x4.png";

        this.dict = {
            red:["red","and", "add", "end", "head", "bed", "had"],
            green:["green","glen", "grain","getting", "good"],
            yellow:["yellow","hello"],
            blue:["blue","below", "blow"],
            pink:["pink","bing"],
            orange:["orange"],
            black:["black"],
            gray:["gray"],
            purple:["purple"]
        }

        this.indexes = Object.keys(this.dict);
        this.speech = new Recognizer(this.dict);



        this.level = 0;


        document.addEventListener("mousemove", event =>{
            let rect = this.canvas.getBoundingClientRect();
            this.mx = event.clientX - rect.left;
            this.my = event.clientY - rect.top;
        });

        document.addEventListener("click", event =>{
            this.click = true;
        });


        this.stages = {
            MENU:0,
            LEVEL:1,
            GAME:2
        }

        this.currentStage = this.stages.MENU;

        this.objects = [];
        this.objects.push(new MenuStage(this));

    }

    update(dt){

        if(!dt) return;
        
        this.objects.forEach(object => object.update(dt));


        this.click = false;
    }

    render(ctx){
       
        ctx.clearRect(0,0,this.gameWidth,this.gameHeight);

        ctx.fillStyle = "#32dbc6"
        ctx.fillRect(0,0,this.gameWidth,this.gameHeight/2);

        ctx.fillStyle = "#49beb7";
        ctx.fillRect(0,this.gameHeight/2,this.gameWidth,this.gameHeight/2);
        this.objects.forEach(object => object.render(ctx));

    }

    addObject(object){
        this.objects.push(object,);

    }

    changeStage(stage){
        this.objects = [];
        this.speech.stop();
        
        switch(stage){
            case this.stages.MENU:
                this.objects.push(new MenuStage(this));
                break;
            case this.stages.LEVEL:
                this.objects.push(new LevelStage(this));
                break;
            case this.stages.GAME:
                this.objects.push(new GameStage(this));
                break;
        }

    }


}
