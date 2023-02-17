export default class Button{
    
    constructor(x,y,text,size,game){
        this.position = {x:x, y:y};
        this.cornerRadius = size/3;
        this.game = game;
        this.text = text;
        this.size = size;
        this.dimentions = {
            width:0,
            height:this.size* 1.286
        }
        this.color = "#444444";
        this.hover = false;

        this.clickListener = undefined;
        
    }

    update(dt){
        this.hover = this.game.mx > this.position.x+(this.cornerRadius/2) - this.dimentions.width/4 && this.game.mx < this.position.x+(this.cornerRadius/2) - this.dimentions.width/4+this.dimentions.width*1.5-this.cornerRadius && this.game.my < this.position.y+(this.cornerRadius/2)+this.dimentions.height-this.cornerRadius && this.game.my > this.position.y+(this.cornerRadius/2);
       
        if(this.game.click && this.hover){
            if(this.clickListener){
                this.clickListener();
            }
        }
    }

    render(ctx){
        ctx.font = this.size + "px Arial Rounded MT";

        this.dimentions.width = ctx.measureText(this.text).width;

        ctx.lineJoin = "round";
        ctx.lineWidth = this.cornerRadius;

        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.strokeRect(this.position.x+(this.cornerRadius/2) - this.dimentions.width/4, this.position.y+(this.cornerRadius/2), this.dimentions.width*1.5-this.cornerRadius, this.dimentions.height-this.cornerRadius);
        ctx.fillRect(this.position.x+(this.cornerRadius/2) - this.dimentions.width/4, this.position.y+(this.cornerRadius/2), this.dimentions.width*1.5-this.cornerRadius, this.dimentions.height-this.cornerRadius);

        ctx.fillStyle = "#eaebd8";
        ctx.fillText(this.text,this.position.x,this.position.y + this.size);

        
        
    }

    isInside(pos, rect){
        return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y
    }

    
}