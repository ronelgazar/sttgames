export default class Pad{

    constructor(game, x, y, w, h, i, stage){
        this.game = game;
        this.pos = {
            x:x, y:y, width:w, height:h
        }
        this.img = {
            x:this.pos.x + this.pos.width*0.1,
            y:this.pos.y + this.pos.height*0.1
        }
        this.dead = false;
        this.stage = stage;
        this.hover = false;
        this.color = parseInt(i);
        this.image = this.game.images[i-1];
        this.count = 0;
        this.change = false;
        this.deg = 0;
        this.rotateSpeed = 300;
        this.mode = 0;
    }

    update(dt){

        if(this.stage.currentColor === this && !this.dead){
            if(this.mode == 0){
                this.deg += this.rotateSpeed * dt/1000.0;
                if(this.deg >= 40){
                    this.mode = 1;
                }
            }else if(this.mode == 1){
                this.deg -= this.rotateSpeed * dt/1000.0;
                if(this.deg <= -40){
                    this.mode = 2;
                    this.count = 0;
                }
            }else if(this.mode == 2){
                if(this.deg >= 0){
                    this.count += dt/1000.0;
                    if(this.count >= 1.5){
                        this.mode = 0;
                    }
                }else{
                    this.deg += this.rotateSpeed * dt/1000.0;

                }
            }
        }

        if(this.dead && !this.change){
            this.count += dt/1000.0;

            if(this.count >= 1){
                this.change = true;
                this.stage.currentColor = -1;
                this.stage.generateRandomColor();
            }
        }
        
    }

    render(ctx){
        ctx.fillStyle = (this.hover || this.dead)? "#eaebd8": "#fff";
        ctx.fillRect(this.pos.x, this.pos.y, this.pos.width, this.pos.height);

        if(!this.dead && this.stage.currentColor === this){
            ctx.translate(this.img.x + (this.pos.width* 0.8)/2,this.img.y + (this.pos.height * 0.8)/2);
            ctx.rotate(this.deg*Math.PI/180);
            ctx.translate(-(this.img.x + (this.pos.width* 0.8)/2),-(this.img.y + (this.pos.height * 0.8)/2));
            
            ctx.drawImage(this.image, this.img.x, this.img.y, this.pos.width* 0.8, this.pos.height * 0.8);

            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }else if(!this.dead){
            ctx.drawImage(this.image, this.img.x, this.img.y, this.pos.width* 0.8, this.pos.height * 0.8);

        }
    }

}