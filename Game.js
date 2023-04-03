import { Rect } from "./RectUtils.js";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
class ParticleSource {
    constructor() {
        this.parts = [];
        this.particles_enabled = true;
    }
    start_particles(x, y) {
        if (!this.particles_enabled) return;
        this.parts = [];
        for (let i = 0; i < 50; i++) {
            this.parts.push({
                pos: {
                    x: x,
                    y: y,
                },
                vel: {
                    x: (Math.random() - 0.5) * 5,
                    y: (Math.random() - 0.5) * 5,
                },
                alive: true,
                age: 0,
            });
        }
    }
    draw_particles(ctx,color) {
        for (let i = 0; i < this.parts.length; i++) {
            let part = this.parts[i];
            if (part.alive) {
                let a = Math.floor(100 - part.age * 2);
                ctx.save();
                ctx.beginPath();
                ctx.fillStyle = "red"
                ctx.fillStyle = `rgba(238,134,149,${a}%)`;
                ctx.fillRect(part.pos.x, part.pos.y, 15,15);
                ctx.restore();
            }
        }
    }
    update_particles() {
        this.parts.forEach((part) => {
            part.pos.x += part.vel.x;
            part.pos.y += part.vel.y;
            part.age += 1;
            if (part.age > 50) {
                part.alive = false;
            }
        });
    }
}
class Mouse {
    constructor() {
        this.bounds = new Rect(10,10,10,10)
    }
    init() {
        addEventListener("mousemove", (event) => {
            this.bounds.x = (event.offsetX-6);
            this.bounds.y = (event.offsetY-6);
        });
        document.addEventListener("mousedown", (e) => {
                currentMouse.set(e.button, true);
          });
          document.addEventListener("mouseup", (e) => {
            currentMouse.set(e.button, false);
        });

    }
    clickOn(item) {
        if (this.bounds.intersects(item.bounds) && currentMouse.get(0) === true) {
            return true;
        }
    }
    click() {
        if (this.mouseClicked === true) {
            return true;
        }
    }
    posY() {
        return this.bounds.y
    }
    posX() {
        return this.bounds.x
    }
}
class Padel {
    constructor() {
        this.speed = 4;
        this.sideOn = 1;
        this.direction = 0;
        this.bounds = new Rect(10,canvas.height/2+50,15,125)
    }
    draw() {
        ctx.fillStyle = "#eb8c34"
        ctx.shadowBlur = 10;
        ctx.shadowColor = "gray";
        ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
        ctx.shadowBlur = 0;
    }
    check_switch() {
        if (this.sideOn === 1) {
            this.bounds.x = canvas.width/100
        }
        if (this.sideOn === -1) {
            this.bounds.x = canvas.width-20
        }
    }
    reset() {
        this.speed = 4;
        this.sideOn = 1;
        this.direction = 0;
        this.bounds.x = 10;
        this.bounds.y = canvas.height/2-50
        this.bounds.h = 100
    }
    update() {
        // if (ball.launched === true) {
        //     this.bounds.h -= score/10;
        // }
    }
}
class Ball {
    constructor() {
        this.launched = false;
        this.speed = 2*gloabalSpeed;
        this.spin = 0;
        this.spinSpeed = 3;
        this.bounds = new Rect(canvas.width-100,canvas.height-150,10,10)
    }
    draw() {
        ctx.fillStyle = "#ff6973"
        ctx.shadowBlur = 10;
        ctx.shadowColor = "gray";
        ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
        ctx.shadowBlur = 0;
    }
    update() {
        if (this.launched === true) {
            this.bounds.x -= this.speed*gloabalSpeed;
            this.bounds.y += this.spin; 
        }
    }
    collision() {
        if (this.launched === true) {
            if (this.bounds.intersects(padel.bounds)) {
                hit.play();
                Shake = true
                  
                setTimeout(() => {
                    Shake = false
                  }, 150);
                score += 1;
                this.speed *= -1;
                if (padel.direction === 0) {
                    this.spin = -this.spinSpeed;
                }
                if (padel.direction === 1) {
                    this.spin = this.spinSpeed;
                }
                if (padel.direction === -1) {
                    this.spin = -this.spinSpeed;
                }
                if (this.speed >= 0) {
                    this.speed += 1;
                }
                if (this.speed <= 0) {
                    this.speed -= 1;
                }
                particalEngine.start_particles(ball.bounds.x,ball.bounds.y)
            }
        }
    }
    reset() {
        this.speed = 3;
        this.spin = 0;
        this.bounds.x = canvas.width/2-5
        this.bounds.y = canvas.height/2-5
    }
}
class Button {
    constructor(text,src,width,height) {
        this.clickedOn = false;
        this.image = new Image();
        this.image.src = src
        this.text = text;
        this.scale = 0.5;
        this.bounds = new Rect(10,10,width*this.scale,height*this.scale)

    }
    draw(x,y,StartPageX,StartPageY, EndPageX, EndPageY) {
        this.bounds.x = x;
        this.bounds.y = y;
        ctx.fillStyle = "black"
        // ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
        ctx.drawImage(this.image,StartPageX,StartPageY,EndPageX,EndPageY,this.bounds.x + this.bounds.w/2-this.scale*500,this.bounds.y + this.bounds.h/2-this.scale*155,this.bounds.w*this.scale*2.6,this.bounds.h*this.scale*2.6)
        ctx.fillStyle = "white"
        ctx.font = "60px Inter-Thin";
        ctx.textAlign = "center";
        ctx.fillText(this.text,this.bounds.x+this.bounds.w/2,this.bounds.y+this.bounds.h/2+this.scale*50)
    }
}
class Scene {
    constructor(src) {
        this.image = new Image()
        this.image.src = src
        this.bounds = new Rect(0,0,3000,1800);
    }
    draw() {
        ctx.drawImage(this.image,this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
    }
}
class BallSpeedPowerup {
    constructor() {
        this.bounds = new Rect(canvas.width/2,Math.floor(Math.random() * canvas.height) + 1,20,20)
        this.hit = false;
        this.direction = Math.floor(Math.random()*2 + 1);
        this.timeLength = 10;
        this.timeStarted = false;
    }
    draw() {
        if (ball.launched) {
            ctx.shadowBlur = 10
            ctx.shadowColor = "#15788c";
            ctx.fillStyle = " #00b9be "
            ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
            ctx.shadowBlur = 0

        }
    }
    update() {
        if (ball.launched) {
            if (this.bounds.intersects(padel.bounds)) {
                this.hit = true
                padel.bounds.h *= 1.1
                powerup.play();
            }
            if (this.direction === 1) {
                this.bounds.x -= (score+1)*gloabalSpeed
            }
            if (this.direction === 2) {
                this.bounds.x += (score+1)*gloabalSpeed
            }
        }
        console.log(this.timeLength)
    }
}
// class Obstical {
//     constructor() {
//         this.bounds = new Rect(canvas.width,10,12,100);
//         this.speed = 2;
//     }
//     update() {

//     }
//     draw() {
//         ctx.fillStyle = "black"
//         ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h,);

//     }
// }
class Accesories {
    constructor(padel,src) {
        this.bounds = new Rect(padel.bounds.x,0,16*1.5,16*1.5)
        this.image = new Image();
        this.image.src = src
    }
    draw() {
        // this.bounds.y = padel.bounds.y-20
        // ctx.imageSmoothingEnabled = false;
        // ctx.drawImage(this.image,this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
    }
}
let accesories = []
//Global Variabls
let currentKey = new Map();
let navKey = new Map();
let currentMouse = new Map();
let mode = "menu"
let music = new Audio("./Assets/Helios.mp3");
let hit = new Audio("./Assets/Hit.mp3");
let powerup = new Audio("./Assets/powerUp.mp3")
let score = 0;
let Shake = false;
let vollumeLevel = true;
let timmer = 0;
let highScore = 0;
let SpawnTime = Math.floor(Math.random() * 10 + 1);
let gloabalSpeed = 1;
let powerUps = []
let tutorial = true;
//CLASSES
// let obstical = new Obstical();
let particalEngine = new ParticleSource();
let mouse = new Mouse();
let storyButton = new Button("Story","./Assets/Button.png",600,250);
let optionButton = new Button("Options","./Assets/Button.png",600,250);
let endlessButton = new Button("Endless","./Assets/Button.png",600,250);
let backButton = new Button("Back","./Assets/Button.png",600,250);
let controllButton = new Button("Controlls","./Assets/Button.png",600,250);
backButton.scale = 0.3
let vollume = new Button("","./Assets/Button.png",550,300);
let vollumeOff = new Button("","./Assets/Button.png",550,300);
let retryButton = new Button("MENU","./Assets/Button.png",600,300);
retryButton.scale = 0.45
let menu = new Scene("./Assets/BG.png");
let option = new Scene("./Assets/BG.png");
let controlls = new Scene("./Assets/BG.png");
let ball = new Ball();
let padel = new Padel();
let cheffHat = new Accesories(padel,"./Assets/ChefHat.png")

function ShowTutorial() {
    if (ball.bounds.x >= canvas.width-400 && tutorial === true) {
        if (padel.sideOn === 1) {
            gloabalSpeed = 0.5;
            ctx.font = "bold 40px Verdana";
            ctx.globalAlpha = 0.5;
            ctx.fillText("Use A and D To switch Sides",canvas.width/2-300,300)
            ctx.globalAlpha = 1;
        }
        if (padel.sideOn === -1) {
            gloabalSpeed = 1;
            tutorial = false;
        }
    }
}
function keyboardLoop() {
    if (mode === "endless" || mode === "story") {
        if (currentKey.get("w") || currentKey.get("ArrowUp")) {
            if (ball.launched === false) {
                ball.launched = true;
            }
            padel.bounds.y -= padel.speed*gloabalSpeed
            padel.direction = -1   
        }
        if (currentKey.get("s") || currentKey.get("ArrowDown")) {
            if (ball.launched === false) {
                ball.launched = true;
            }
            padel.bounds.y += padel.speed*gloabalSpeed
            padel.direction = 1
        }
        if (navKey.get("a") || currentKey.get("ArrowLeft")) {
            if (ball.launched === false) {
                ball.launched = true;
            }
            padel.sideOn = 1
        }
        if (navKey.get("d") || currentKey.get("ArrowRight")) {
            if (ball.launched === false) {
                ball.launched = true;
            }
            padel.sideOn = -1
        }
    }
}
function postShake() {
    ctx.restore();
}
function keyboardInit() {
    window.addEventListener("keydown", function (event) {
        currentKey.set(event.key, true);
        navKey.set(event.key, true);

    });
    window.addEventListener("keyup", function (event) {
        currentKey.set(event.key, false);
        navKey.set(event.key, false);


    });
}
function WorldColision() {
    if (ball.bounds.y >= canvas.height-20) {
        ball.spin = -1;
        particalEngine.start_particles(ball.bounds.x,ball.bounds.y)
        hit.play();
        Shake = true
        setTimeout(() => {
            Shake = false
          }, 150);

    }
    if (ball.bounds.y <= 0) {
        ball.spin = 1;
        particalEngine.start_particles(ball.bounds.x,ball.bounds.y)
        hit.play();
        Shake = true
        setTimeout(() => {
            Shake = false
          }, 150);
    }
    if (ball.bounds.x <= 0) {
        mode = "dead"
    }
    if (ball.bounds.x >= canvas.width) {
        mode = "dead"

    }
    if (padel.bounds.y <= 0) {
        padel.bounds.y = 0;
    }
    if (padel.bounds.y >= canvas.height-padel.bounds.h) {
        padel.bounds.y = canvas.height-padel.bounds.h;
    }
}
function SpawnPowerup() {
    if ((timmer/60) === SpawnTime)  {
            let ballPowerUp = new BallSpeedPowerup();
            powerUps.push(ballPowerUp)
            SpawnTime = Math.floor(Math.random() * 10 +1)
            timmer = 0;
        }
}
function DrawScore() {
    ctx.font = "bold 80px Verdana";
    ctx.fillStyle = " #ff6973 "
    ctx.shadowBlur = 10;
    ctx.shadowColor = " #ffb0a3  ";
    ctx.fillText(score,canvas.width/2-20,canvas.height/2-20)
    ctx.shadowBlur = 0;
}
function loop() {
    ctx.save();
    ctx.clearRect(0,0,canvas.width,canvas.height)
    if (vollumeLevel) {
        music.play();
        music.loop = true;
        music.volume = 0.3;
    }
    if (vollumeLevel === false) {
        music.pause();
    }
    if (Shake) {
        var dx = Math.random()*15;
        var dy = Math.random()*15;
        ctx.translate(dx, dy);
    }
    if (mode === "menu") {
        gloabalSpeed = 1;
        timmer = 0;
        if (powerUps.length != 0) {
            powerUps.length = 0;
        }
        menu.draw();
        storyButton.draw(canvas.width/2-120,100,0,400,600,250);
        endlessButton.draw(canvas.width/2-120,250,0,400,600,250);
        optionButton.draw(canvas.width/2-120,400,0,400,600,250);
        controllButton.draw(canvas.width/2-120,550,0,400,600,250)
        if (mouse.clickOn(endlessButton)) {
            mode = "endless"
        }
        if (mouse.clickOn(optionButton)) {
            mode = "option"
        }
        if (mouse.clickOn(controllButton)) {
            mode = "controlls"
        }
    }
    if (mode === "controlls") {
        controlls.draw();
        backButton.draw(-50,-20,0,400,600,250);
        ctx.font = "bold 50px Inter-Thin";
        ctx.fillText("W = Move Up",canvas.width/2,150);
        ctx.fillText("S = Move Down",canvas.width/2,250);
        ctx.fillText("A = Switch To The Left Side",canvas.width/2,350);
        ctx.fillText("D = Switch To The Right Side",canvas.width/2,450);
        ctx.fillText("Green Squares = Paddle Bigger",canvas.width/2,550);
        ctx.fillText("Stay alive and Have FUN!!!!",canvas.width/2,650);





        if (mouse.clickOn(backButton)) {
            mode = "menu"
        }
    }
    if (mode === "option") {
        option.draw();
        backButton.draw(-50,-20,0,400,600,250);
        if (mouse.clickOn(backButton)) {
            mode = "menu"
        }
        if (vollumeLevel) {
            vollume.draw(canvas.width/2-120,150,2000,2050,345,195);
        }
        if (vollumeLevel === false) {
            vollumeOff.draw(canvas.width/2-120,150,2945.5,525,345,195);
        }
        if (mouse.clickOn(vollume)) {                
            vollumeLevel = !vollumeLevel;
        }
        
    }
    if (mode === "dead") {
        if (score >= highScore) {
            highScore = score;
            
        }
        ctx.textAlign = "center"
        ctx.font = "bold 40px Verdana";
        ctx.fillStyle = "gray"
        ctx.fillText("SCORE " + score,canvas.width/2,canvas.height/2-100)
        ctx.fillText("HIGH SCORE " + highScore,canvas.width/2,canvas.height/2+225-100)
        retryButton.draw(canvas.width/2-150,canvas.height/2-100,0,400,600,250);

        if (mouse.clickOn(retryButton))  {
                padel.reset();
                ball.reset();
                score = 0;
                mode = "menu"
        }
    }
    if (mode === "endless") {
        timmer += 1;
        ShowTutorial();
        SpawnPowerup();
        DrawScore();
        padel.draw();
        ball.draw();
        padel.update();
        cheffHat.draw();
        for (let i = 0; i < powerUps.length; i++) {
            powerUps[i].draw();
            powerUps[i].update();
            if (powerUps[i].hit === true) {
                powerUps.shift();
            }
        }
        particalEngine.draw_particles(ctx,238, 134, 149)
        padel.check_switch();
        particalEngine.update_particles();
        ball.update();
        ball.collision();
        WorldColision();
    }
    keyboardLoop();
    navKey.clear();
    postShake();
    currentMouse.clear();
    requestAnimationFrame(loop)
}
function init() {
    mouse.init();
    keyboardInit();
    loop();
}
init();