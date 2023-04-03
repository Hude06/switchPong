import { Rect } from "./RectUtils.js";
import { levels } from "./Game.js";
export class Level {
    constructor(padle,ball) {
        this.DisplayBounds = new Rect(canvas.width/2-32,620,64,64)
        this.DisplayText = ""
    }
    draw(ctx) {
        ctx.fillRect(10,10,100,100)
    }
}
export class LevelSelector {
    constructor() {
        this.image = new Image();
        this.image.src = "./Assets/LevelSelectorIcon.png"
    }
    draw(ctx) {
        ctx.lineWidth = 5   
        for (let i = 0; i < levels.length; i++) {
            ctx.imageSmoothingEnabled = false;
            levels[i].DisplayBounds.y = i* 80+550
            ctx.drawImage(this.image,levels[i].DisplayBounds.x,levels[i].DisplayBounds.y,levels[i].DisplayBounds.w,levels[i].DisplayBounds.h,)
            ctx.font = "bold 40px Verdana";
            ctx.fillText(levels[i].DisplayText,levels[i].DisplayBounds.x+17,levels[i].DisplayBounds.y+46)

        }
    }
}