import Button from "./button.js";
import { MenuStage, PracticeStage, TutorialStage } from "./stages.js";
import Recognizer from "./reco.js";
import { VideoPlayer } from "./video_player.js";


export class Game{

    constructor(width, height, canvas, ctx){

        this.handler = [];

        this.canvas = canvas;
        this.ctx = ctx;
        this.game = this;

        this.videoCount = 0;


        this.dict = {
            red:["red","and", "add", "end", "head", "bed", "had", "bread", "fred", "brat", "brent"],
            green:["green","glen", "grain","getting", "good","grand", "grime"],
            yellow:["yellow","hello", "yello", "ello"],
            brown:["brown", "drown", "braun"],
            white:["white", "why", "wight"],
            blue:["blue","below", "blow"],
            pink:["pink","bing", "ping", "bring", "ing", "thing","bink", "pynk","fink"],
            orange:["orange", "avenge", "oven"],
            black:["black", "block", "blac"],
            gray:["gray", "today", "array", "ay"],
            purple:["purple", "burple", "openpurple"]
        }

        this.stages = {
            MENU:0,
            TUTORIAL:1,
            PRACTICE:2
        }

        this.speech = new Recognizer(this.dict);

        this.gameWidth = width;
        this.gameHeight = height;

        this.addObject(new MenuStage(this,canvas,ctx));

        this.totalLoaded = 0;
        this.totalElements = 13;
        
        this.speaker = new Image();
        this.speaker.src = "src/imgs/speaker.png";

        this.correctAudio = new Audio("src/sounds/correct.wav");
        this.winAudio = new Audio("src/sounds/win.mp3");

        this.practiceVideos = [
            new VideoPlayer("src/videos/Black_v02.mp4",24,this.canvas,[96],["black"],this.game.speech,this.game),
            new VideoPlayer("src/videos/Blue_v02.mp4",24,this.canvas,[96],["blue"],this.game.speech,this.game),
            new VideoPlayer("src/videos/Brown_v02.mp4",24,this.canvas,[96],["brown"],this.game.speech,this.game),
            new VideoPlayer("src/videos/Green_v02.mp4",24,this.canvas,[96],["green"],this.game.speech,this.game),
            new VideoPlayer("src/videos/Grey_v02.mp4",24,this.canvas,[96],["gray"],this.game.speech,this.game),
            new VideoPlayer("src/videos/Orange_v02.mp4",24,this.canvas,[96],["orange"],this.game.speech,this.game),
            new VideoPlayer("src/videos/Pink_v02.mp4",24,this.canvas,[96],["pink"],this.game.speech,this.game),
            new VideoPlayer("src/videos/Purple_v02.mp4",24,this.canvas,[96],["purple"],this.game.speech,this.game),
            new VideoPlayer("src/videos/Red_v02.mp4",24,this.canvas,[96],["red"],this.game.speech,this.game),
            new VideoPlayer("src/videos/White_v02.mp4",24,this.canvas,[96],["white"],this.game.speech,this.game),
            new VideoPlayer("src/videos/Yellow_v02.mp4",24,this.canvas,[96],["yellow"],this.game.speech,this.game)
        ];

        this.tutorialVid = new VideoPlayer("src/videos/tutorial.mp4",25,this.canvas,[483, 755, 886,1028,1162,1294,1426,1562,1693,1831],["red", "green", "yellow","orange","blue","black","white","brown","pink","purple"],this.game.speech,this.game);
        this.intro = new VideoPlayer("src/videos/intro.mp4",25,this.canvas, [], [],this.game.speech,this);
        this.intro.hasToStop = false;

        
        this.colorAudios = [
            new Audio("src/sounds/Black.wav"),
            new Audio("src/sounds/Blue.wav"),
            new Audio("src/sounds/Brown.wav"),
            new Audio("src/sounds/Green.wav"),
            new Audio("src/sounds/Gray.wav"),
            new Audio("src/sounds/Orange.wav"),
            new Audio("src/sounds/Pink.wav"),
            new Audio("src/sounds/Purple.wav"),
            new Audio("src/sounds/Red.wav"),
            new Audio("src/sounds/White.wav"),
            new Audio("src/sounds/Yellow.wav"),
        ];

        this.tutorialAudios = [
            new Audio("src/sounds/Red.wav"),
            new Audio("src/sounds/Green.wav"),
            new Audio("src/sounds/Yellow.wav"),
            new Audio("src/sounds/Orange.wav"),
            new Audio("src/sounds/Blue.wav"),
            new Audio("src/sounds/Black.wav"),
            new Audio("src/sounds/White.wav"),
            new Audio("src/sounds/Brown.wav"),
            new Audio("src/sounds/Pink.wav"),
            new Audio("src/sounds/Purple.wav"),
        ];

        this.backgroundVid = new Image();
        this.backgroundVid.src = "./src/imgs/prevideo_back.png";

        this.audios = [this.correctAudio, this.winAudio];

        this.correctAudio.load();
        this.winAudio.load();
        
        this.tutorialAudios.forEach(a => a.load());
        this.colorAudios.forEach(a => a.load());

        this.mx = 0;
        this.my = 0;
        this.click = false;


        document.addEventListener("mousemove", event =>{
            let rect = canvas.getBoundingClientRect();
            this.mx = event.clientX - rect.left;
            this.my = event.clientY - rect.top;
        });

        document.addEventListener("click", event =>{
            this.click = true;
        });

        document.addEventListener("release", event =>{
            this.click = false;
        });



    }

    render(ctx){
        ctx.clearRect(0,0,this.gameWidth,this.gameHeight);

   

        this.handler.forEach(obj => obj.render(ctx));
    }

    update(dt){
        

        this.handler.forEach(obj => obj.update(dt));

        this.click = false;
    }

    addObject(obj){
        this.handler.unshift(obj);
    }
    addLastObject(obj){
        this.handler.push(obj);
    }

    removeObject(obj){
        for(var i in this.handler){
            if(this.handler[i]==obj){
                this.handler.splice(i,1);
                break;
            }
        }
    }

    clearHandler(){
        this.handler = [];
    }

    setStage(stage){
        this.clearHandler();
        this.speech.stop();
        this.speech.clear(true);

        this.audios.forEach(au => au.pause());

        switch(stage){
            case this.stages.MENU:
                this.addObject(new MenuStage(this, this.canvas, this.ctx));
                break;
            case this.stages.PRACTICE:
                this.addObject(new PracticeStage(this, this.canvas, this.ctx));
                break;
            case this.stages.TUTORIAL:
                this.addObject(new TutorialStage(this, this.canvas, this.ctx));
                break;
        }
    }
}
