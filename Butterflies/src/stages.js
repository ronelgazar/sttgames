import Button from "./button.js";
import { VideoPlayer } from "./video_player.js";


class Stage{
    constructor(game, canvas, ctx){
        this.game = game;
        this.canvas = canvas;
        this.ctx = ctx;
    }
}

class PlayStage extends Stage{
    constructor(game,canvas,ctx, stageID){
        super(game,canvas,ctx);


        this.backBTN = new Button(50,this.game.gameHeight - 80,"Back", 50, this.game);
        this.currentPlayed = undefined;

        let $this = this;
        this.backBTN.clickListener = function(){
            this.game.setStage(this.game.stages.MENU);
            $this.currentPlayed.pause();
        }

        this.game.addObject(this.backBTN);

        this.levelEnded = false;

        this.speaker = this.game.speaker;


        this.speakerObj = {
            image:this.speaker,
            x:20,y:20,
            width:100,height:100, max:120, min:100,
            hover:false
        }

        this.onSpeakerClick = undefined;

  
        this.endStage = new EndStage(this.game, this.canvas, this.ctx, () => this.game.setStage(stageID));
    }


    speakerHandle(dt){
        this.speakerObj.hover = Math.hypot((this.speakerObj.x + this.speakerObj.width/2) - this.game.mx, (this.speakerObj.y + this.speakerObj.height/2) - this.game.my) < this.speakerObj.width/2;

        if(this.speakerObj.hover){
            if(this.speakerObj.width < this.speakerObj.max){
                this.speakerObj.width += 100 *dt/1000;
                this.speakerObj.height += 100 *dt/1000;

                this.speakerObj.x -= 100/2 * dt/1000;
                this.speakerObj.y -= 100/2 * dt/1000;

            }
        }else{
            if(this.speakerObj.width > this.speakerObj.min){
                this.speakerObj.width -= 100 *dt/1000;
                this.speakerObj.height -= 100 *dt/1000;

                this.speakerObj.x += 100/2 * dt/1000;
                this.speakerObj.y += 100/2 * dt/1000;

            }
        }

        if(this.speakerObj.hover && this.game.click){
            this.onSpeakerClick();
        }
    }

    update(dt){
        if(!this.levelEnded){
            this.speakerHandle(dt);
        }else{
            this.endStage.update(dt);
            if(this.game.handler.includes(this.backBTN)){
                this.game.winAudio.play();
                this.game.removeObject(this.backBTN);
            }
        }
    }

    render(ctx){
        if(!this.levelEnded){
            ctx.drawImage(this.speakerObj.image,this.speakerObj.x,this.speakerObj.y,this.speakerObj.width,this.speakerObj.height);
        }else{
           this.endStage.render(ctx);
        }
    }

}

export class MenuStage extends Stage{
    constructor(game, canvas, ctx){
        super(game,canvas,ctx);
        
        let tutorialTitle = "Tutorial";
        this.ctx.font = "50px Arial Rounded MT";
        this.tutorialButton = new Button((this.game.gameWidth - this.ctx.measureText(tutorialTitle).width)/2 - 200,600,tutorialTitle,50, game);

        let practiceTitle = "Practice";
        this.practiceButton = new Button((this.game.gameWidth - this.ctx.measureText(practiceTitle).width)/2 + 200,600,practiceTitle,50, game);

        this.practiceButton.clickListener = function(){
            this.game.setStage(this.game.stages.PRACTICE);
        }

        this.tutorialButton.clickListener = function(){
            this.game.setStage(this.game.stages.TUTORIAL);
        }

        // this.game.addObject(this.tutorialButton);
        // this.game.addObject(this.practiceButton);



    }

    update(dt){
        this.tutorialButton.update(dt);
        this.practiceButton.update(dt);
    }

    render(ctx){

        ctx.fillStyle = "#cf455c";
        ctx.fillRect(0,0,this.game.gameWidth,this.game.gameHeight*0.7);

        ctx.fillStyle = "#ffdd67";
        ctx.fillRect(0,this.game.gameHeight*0.7,this.game.gameWidth,this.game.gameHeight*0.3);

        ctx.fillStyle = "#fff";
        ctx.font = "150px Arial Rounded MT";
        ctx.fillText("Butterflies",(this.game.gameWidth - this.ctx.measureText("Butterflies").width)/2, 300);

        if(this.game.totalLoaded >= this.game.totalElements){
            this.tutorialButton.render(ctx);
            this.practiceButton.render(ctx);
        }else{
            ctx.fillStyle = "#000";
            ctx.font = "80px Arial Rounded MT";
            let text = "Loading ( " + this.game.totalLoaded + " out of " + this.game.totalElements + " )";
            ctx.fillText(text,(this.game.gameWidth - this.ctx.measureText(text).width)/2, 650);
        }

        

        

    }
}

export class PracticeStage extends PlayStage{

    constructor(game, canvas, ctx){
        super(game, canvas, ctx, game.stages.PRACTICE);

        this.videos = [];
        this.audios = []

        this.game.practiceVideos.forEach(element => {
            element.reset();
            this.videos.push(element);
        });

        this.game.colorAudios.forEach(element => {
            
            this.audios.push(element);
        });
        console.log("bb");
        

        this.back = this.game.backgroundVid;

        this.currentPlayed = this.game.intro;
        this.currentPlayed.reset();
        this.currentPlayed.mute = false;
        
        this.currentIndex = undefined
        // this.currentPlayed = this.videos[this.currentIndex];
        this.currentAudio = undefined

        this.onSpeakerClick = () => {if(this.currentPlayed != this.game.intro){this.currentAudio.play();}};


        
        // this.videos.splice(this.currentIndex,1);
        // this.audios.splice(this.currentIndex,1);


        this.currentPlayed.play();

    }


    update(dt){

        if(!this.levelEnded){
            this.currentPlayed.update(dt);

        }

        if(this.currentPlayed.isFinished() && this.videos.length > 0){
            this.currentPlayed.pause();
            this.currentIndex = Math.floor(Math.random() * this.videos.length);
            this.currentPlayed = this.videos[this.currentIndex];
            this.currentAudio = this.audios[this.currentIndex];


            this.videos.splice(this.currentIndex,1);
            this.audios.splice(this.currentIndex,1);

        
            this.currentPlayed.play();
            this.currentPlayed.update(dt);
            this.currentPlayed.render(this.ctx);
        }else if(this.currentPlayed.isFinished()){
            this.levelEnded = true;
        }

        super.update(dt);

    }

    render(ctx){
        ctx.drawImage(this.back,0,0,this.game.gameWidth, this.game.gameHeight);
        this.currentPlayed.render(ctx);

        super.render(ctx);
    }

}

export class TutorialStage extends PlayStage{

    constructor(game, canvas, ctx){
        super(game, canvas, ctx, game.stages.TUTORIAL);

        this.endStage = new EndStage(this.game, this.canvas, this.ctx, () => this.game.setStage(this.game.stages.TUTORIAL));


        this.currentPlayed = this.game.tutorialVid;
        this.currentPlayed.mute = false;

        this.currentPlayed.reset();

        this.audios = this.game.tutorialAudios;
        this.onSpeakerClick = () => {
            if(this.currentPlayed.index < this.audios.length){
                this.audios[this.currentPlayed.index].play();
            }
        };

        this.currentPlayed.play();
    }

    update(dt){
        this.levelEnded = this.currentPlayed.isFinished();
        if(!this.levelEnded){
            this.currentPlayed.update(dt);
        }

        super.update(dt);
        
    }

    render(ctx){

        if(this.levelEnded){
            ctx.fillStyle = "#ADD8E6";
            ctx.fillRect(0,0,this.game.gameWidth, this.game.gameHeight)
        }else{
            this.currentPlayed.render(ctx);
        }

        super.render(ctx);
    }

    
}

export class EndStage extends Stage{
    constructor(game, canvas, ctx, playAgainFunc){
        super(game, canvas, ctx);

        this.ctx.font = "60px Arial Rounded MT";
        this.menuButton = new Button((this.game.gameWidth - this.ctx.measureText("Main Menu").width)/2, 460, "Main Menu", 60, this.game);
        this.menuButton.clickListener = () => this.game.setStage(this.game.stages.MENU);

        this.playAgainBTN = new Button((this.game.gameWidth - this.ctx.measureText("Play Again").width)/2, 330, "Play Again", 60, this.game);
        this.playAgainBTN.clickListener = playAgainFunc;
    }

    update(dt){
        this.menuButton.update(dt);
        this.playAgainBTN.update(dt);
    }

    render(ctx){
        ctx.fillStyle = "#000";
        ctx.font = "120px Arial Rounded MT";
        ctx.fillText("Good Job!", (this.game.gameWidth - ctx.measureText("Good Job!").width)/2, 200);

        this.menuButton.render(ctx);
        this.playAgainBTN.render(ctx);
    }
}

