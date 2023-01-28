import Button from "./button.js";
import Pad from "./pad.js";

export class MenuStage{
    constructor(game){
        this.game = game;

        let title = "Start";
        this.game.ctx.font = "90px Arial Rounded MT";
        this.playButton = new Button((this.game.gameWidth - this.game.ctx.measureText(title).width)/2,500,title,90, game);

        this.playButton.clickListener = function(){
            this.game.changeStage(this.game.stages.LEVEL);
        }

        this.selected = -1;

        this.game.addObject(this.playButton);
    }

    update(dt){

    }

    render(ctx){
        let title = "BINGO"

        ctx.font = "180px Arial Rounded MT";
        
        let width = ctx.measureText(title).width;

        ctx.fillStyle = "#ebefd0";

        ctx.fillText(title, (this.game.gameWidth - width)/2, 230);

    }
}

export class LevelStage{
    
    constructor(game){

        this.game = game;

        this.imgSize = 320;
        this.imgSpacing = this.imgSize/2 + 80;

        this.startX = (this.game.gameWidth - this.imgSize)/2;
        this.grow = 100;

        this.gridsArr = [{
            image: this.game.grid1,
            x:this.startX  - this.imgSpacing,y:290,width:this.imgSize,height:this.imgSize,
            hover: false
        },{
            image: this.game.grid2,
            x:this.startX +  this.imgSpacing,y:290,width:this.imgSize,height:this.imgSize,
            hover:false
        }];

        

    }

    update(dt){
        for(let i in this.gridsArr){
            let img = this.gridsArr[i];
            img.hover = this.game.mx > img.x && this.game.mx < img.x + img.width && this.game.my > img.y && this.game.my < img.y + img.height;

            if(img.hover){
                
                if(img.width <  this.imgSize + 30){
                    img.width += this.grow * dt/1000.0;
                    img.height += this.grow * dt/1000.0;
                    img.x -= this.grow/2 * dt/1000.0;
                    img.y -= this.grow/2 * dt/1000.0;
                }

                if(this.game.click){
                    this.game.level = i;
                    this.game.changeStage(this.game.stages.GAME);
                }

            }else{

                if(img.width >  this.imgSize){
                    img.width -= this.grow * dt/1000.0;
                    img.height -= this.grow * dt/1000.0;
                    img.x += this.grow/2 * dt/1000.0;
                    img.y += this.grow/2 * dt/1000.0;
                }
            }
        }

    }

    render(ctx){

        let title = "Select Grid";
        ctx.font = "80px Arial Rounded MT";

        let width = ctx.measureText(title).width;

        ctx.fillStyle = "#ebefd0";

        ctx.fillText(title, (this.game.gameWidth - width)/2, 200);

        for(let i in this.gridsArr){
            let img = this.gridsArr[i];
            ctx.drawImage(img.image, img.x, img.y, img.width, img.height);

            if(img.hover){
                let title = (3 + parseInt(i)) + "X" + (3 + parseInt(i));

                ctx.font = "90px Arial Rounded MT";

                let width = ctx.measureText(title).width;
                ctx.fillText(title, (this.game.gameWidth - width)/2, 750);
            }
        }
    }
}

export class GameStage{

    constructor(game){
        this.game = game;
        this.cornerRadius = 20;
        this.dimentions = {
            width:this.game.gameHeight * 0.8,
            height:this.game.gameHeight * 0.8
        }
        this.position = {x:(this.game.gameWidth - this.dimentions.width)*0.8, y:(this.game.gameHeight - this.dimentions.height)/2};
        
        this.tileCount = parseInt(this.game.level) + 3;

        this.tiles = [];

        this.currentColor = 1;
        this.currentColorName = "Red";

        this.wonBackgroundY = -300;

        this.count = 0;

        this.won = false;
        this.wonPlay = false;
        this.audio = this.game.audio;

        let btn = new Button(100, 800, "Menu", 60, this.game);
        btn.clickListener = function(){
            this.game.changeStage(0);
        }

        this.game.addObject(btn);
        

        this.correctAudio = this.game.correctAudio;
        this.wonAudio = this.game.wonAudio;

        this.speaker = this.game.speaker;

        this.speakerObj = {
            image:this.speaker,
            x:150,y:(this.game.gameHeight - 250)/2,
            width:250,height:250,
            hover:false
        }

        this.colorNames = ["Red", "Green", "Yellow", "Blue", "Pink", "Orange", "Black", "Gray", "Purple"]

       

        let y = this.position.y + this.dimentions.height*0.05;
        let count = 1;

        for(let i = 0; i < this.tileCount; i++){

            let temp = [];
            let x = this.position.x + this.dimentions.width*0.05;

            for(let j = 0; j < this.tileCount; j++){

                let pad = new Pad(this.game,x,y,(this.dimentions.width*0.8)/this.tileCount,(this.dimentions.width*0.8)/this.tileCount, Math.floor(Math.random() * this.colorNames.length) + 1, this);

                temp.push(pad);
                
                x += (this.dimentions.width*0.95)/this.tileCount;
            }
            
            this.tiles.push(temp);
            y += (this.dimentions.height*0.95)/this.tileCount;

        }
        this.generateRandomColor();


    }

    update(dt){
        this.tiles.forEach(row => row.forEach(object => object.update(dt)));

        this.speakerObj.hover = Math.hypot((this.speakerObj.x + this.speakerObj.width/2) - this.game.mx, (this.speakerObj.y + this.speakerObj.height/2) - this.game.my) < this.speakerObj.width/2;

        if(this.speakerObj.hover){
            if(this.speakerObj.width < 270){
                this.speakerObj.width += 100 *dt/1000;
                this.speakerObj.height += 100 *dt/1000;

                this.speakerObj.x -= 100/2 * dt/1000;
                this.speakerObj.y -= 100/2 * dt/1000;

            }
        }else{
            if(this.speakerObj.width > 250){
                this.speakerObj.width -= 100 *dt/1000;
                this.speakerObj.height -= 100 *dt/1000;

                this.speakerObj.x += 100/2 * dt/1000;
                this.speakerObj.y += 100/2 * dt/1000;

            }
        }

        if(this.speakerObj.hover && this.game.click){
            if(!this.won){
                this.audio[this.currentColor].pause();
                this.audio[this.currentColor].play();
            }
        }

        if(this.won && !this.wonPlay){
            this.count += dt/1000.0;
            if(this.count >= 0.1){
                this.wonPlay = true;
                this.wonAudio.pause();
                this.wonAudio.play();

            }
        }

        if(this.won && parseInt(this.wonBackgroundY) <300)[
            this.wonBackgroundY += 1000 * dt/1000.0
        ]




    }

    render(ctx){

        ctx.fillStyle = "#ff502f";
        ctx.strokeStyle = "#ff502f";

        ctx.strokeRect(this.position.x+(this.cornerRadius/2), this.position.y+(this.cornerRadius/2), this.dimentions.width-this.cornerRadius, this.dimentions.height-this.cornerRadius);
        ctx.fillRect(this.position.x+(this.cornerRadius/2), this.position.y+(this.cornerRadius/2), this.dimentions.width-this.cornerRadius, this.dimentions.height-this.cornerRadius);

        this.tiles.forEach(row => row.forEach(object => object.render(ctx)));

        // if(!this.won){
        //     if(this.colorNames[this.currentColor - 1]){
        //         ctx.fillText(this.colorNames[this.currentColor - 1], 40,100);

        //     }
        // }else{
        //     ctx.fillText("You Won!", 40,100);

        // }

        ctx.drawImage(this.speakerObj.image,this.speakerObj.x,this.speakerObj.y,this.speakerObj.width,this.speakerObj.height);

        if(this.won){
            ctx.fillStyle = "#f7b71d";
            ctx.fillRect(0,this.wonBackgroundY,this.game.gameWidth, 300);

            ctx.font = "180px Arial Rounded MT";
            ctx.fillStyle = "#eaebd8";
            let title = "Bingo!"
            let x = (this.game.gameWidth - ctx.measureText(title).width)/2;
            ctx.fillText(title, x,this.wonBackgroundY + 200);
        }



    }

    generateRandomColor(){
        this.checkWon();

        if(this.won){
            this.currentColor = -1;
            return;
        }
        let free = [];

        for(let row of this.tiles){
            for(let col of row){
                if(!col.dead){
                    free.push(col);
                }
            }
        }

        if(free.length > 0){
            let i = Math.floor(Math.random() * free.length);
            this.currentColor = free[i].color;
            this.audio[this.currentColor].pause();
            this.audio[this.currentColor].play();
        }

    }

    checkWon(){
        //row
        for(let row of this.tiles){
            let count = 0;
            for(let col of row){
                if(col.dead){
                    count++;
                }
            }

            if(count == this.tileCount){
                this.won = true;
                return;
            }
        }

        //col
        for(let i in this.tiles[0]){
            let count = 0
            for(let j in this.tiles){
                let col = this.tiles[j][i];
                if(col.dead){
                    count++;
                }
            }
            if(count == this.tileCount){
                this.won = true;
                return;
            }
        }

        //diag
        let count = 0;
        for(let i = 0; i < this.tiles.length; i++){
            if(this.tiles[i][i].dead){
                count++;
            }
        }

        if(count == this.tileCount){
            this.won = true;
            return;
        }

        count = 0;
        for(let i = 0; i < this.tiles.length; i++){
            if(this.tiles[i][this.tiles.length - 1 - i].dead){
                count++;
            }
        }

        if(count == this.tileCount){
            this.won = true;
            return;
        }


    }

}