import { MenuStage, LevelStage, GameStage } from "./stages.js";

export default class Game{

    constructor(gameWidth, gameHeight, canvas, ctx){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.mx = 0;
        this.my = 0;
        this.canvas = canvas;
        this.ctx = ctx;
        this.click = false;

        this.correctAudio = new Audio("./src/res/voices/right.wav");
        this.wonAudio = new Audio("./src/res/voices/win.mp3");

        this.audio = []
        for(let i = 0; i < 10; i++){
            this.audio.push(new Audio('./src/res/voices/' + parseInt(i) + ".mp3"));
        }



        this.level = 0;

        this.images = [];

        for(let i = 1; i<=9; i++){
            this.images.push(new Image());
            this.images[i - 1].src = "./src/res/images/color" + parseInt(i) + ".png";
        }

        this.grid1 = new Image();
        this.grid2 = new Image();
        this.speaker = new Image();

        this.grid1.src = "./src/res/images/grid3x3.png";
        this.grid2.src = "./src/res/images/grid4x4.png";
        this.speaker.src = "./src/res/images/speaker.png";


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
