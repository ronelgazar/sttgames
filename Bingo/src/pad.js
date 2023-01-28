export default class Pad{

    constructor(game, x, y, w, h, i, stage){
        this.game = game;
        this.pos = {
            x:x, y:y, width:w, height:h
        }
        this.dead = false;
        this.stage = stage;
        this.hover = false;
        this.color = parseInt(i);
        this.image = this.game.images[i-1];
        this.count = 0;
        this.change = false;
    }

    update(dt){
        this.hover = this.game.mx > this.pos.x && this.game.mx < this.pos.x + this.pos.width && this.game.my > this.pos.y && this.game.my < this.pos.y + this.pos.height;

        if(this.hover && this.game.click && this.stage.currentColor == this.color && !this.dead){
            this.dead = true;
            this.stage.correctAudio.play(); 
            this.stage.currentColor = -1;     

        }
        if(this.dead && !this.change){
            this.count += dt/1000.0;

            if(this.count >= 1){
                this.change = true;

                this.stage.generateRandomColor();
            }
        }
        
    }

    render(ctx){
        ctx.fillStyle = (this.hover || this.dead)? "#eaebd8": "#fff";
        ctx.fillRect(this.pos.x, this.pos.y, this.pos.width, this.pos.height);

        if(!this.dead){
            ctx.drawImage(this.image, this.pos.x + this.pos.width*0.1, this.pos.y + this.pos.height*0.1, this.pos.width* 0.8, this.pos.height * 0.8);
        }
    }

}