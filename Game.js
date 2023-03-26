import { Rect } from "./RectUtils.js";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let currentKey = new Map();
let navKey = new Map();
let mode = "menu"
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
                ctx.fillRect(part.pos.x, part.pos.y, 10, 10);
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
        this.mouseClicked = false;
    }
    init() {
        addEventListener("mousemove", (event) => {
            this.bounds.x = (event.offsetX-6);
            this.bounds.y = (event.offsetY-6);
        });
        document.addEventListener("mousedown", (e) => {
            if (e.button === 0) {
                this.mouseClicked = true
            }
          });
          document.addEventListener("mouseup", (e) => {
            this.mouseClicked = false;
          });

    }
    clickOn(item) {
        if (this.bounds.intersects(item.bounds) && this.mouseClicked === true) {
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
        this.bounds = new Rect(10,canvas.height/2-50,10,100)
    }
    draw() {
        ctx.fillStyle = "black"
        ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
    }
    check_switch() {
        if (this.sideOn === 1) {
            this.bounds.x = canvas.width/100
        }
        if (this.sideOn === -1) {
            this.bounds.x = canvas.width-20
        }
    }
}
class Ball {
    constructor() {
        this.speed = 3;
        this.spin = 0;
        this.bounds = new Rect(canvas.width/2-5,canvas.height/2-5,10,10)
    }
    draw() {
        ctx.fillStyle = "black"
        ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
    }
    update() {
        this.bounds.x -= this.speed;
        this.bounds.y += this.spin;
    }
    collision() {
        if (this.bounds.intersects(padel.bounds)) {
            this.speed *= -1;
            if (padel.direction === 0) {
                this.spin = -1;
            }
            console.log(padel.direction)
            if (padel.direction === 1) {
                this.spin = padel.direction;
            }
            if (padel.direction === -1) {
                this.spin = padel.direction;
            }
            if (this.speed >= 0) {
                this.speed += 0.5;
            }
            if (this.speed <= 0) {
                this.speed -= 0.5;
            }
            particalEngine.start_particles(ball.bounds.x,ball.bounds.y)

        }
    }
}
class Button {
    constructor(text,x,y) {
        this.clickedOn = false;
        this.image = new Image();
        this.text = text;
        this.bounds = new Rect(10,10,100,30)
    }
    draw(x,y) {
        this.bounds.x = x;
        this.bounds.y = y;
        ctx.fillStyle = "black"
        ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
        ctx.fillStyle = "white"
        ctx.font = "bold 20px serif";
            ctx.textAlign = "center";
        ctx.fillText(this.text,this.bounds.x+this.bounds.w/2,this.bounds.y+this.bounds.h/2+5)
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
class Powerup {
    constructor() {
        this.bounds = new Rect(Math.floor(Math.random() * canvas.width),Math.floor(Math.random() * canvas.height),20,20)
    }
    draw() {
        ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
    }
    collision() {
        if (ball.bounds.intersects(this.bounds)) {
            powerups.pop();
        }
    }
}
class HotBar {
    constructor() {
        this.bounds = new Rect(10,10,250,100)
    }
    draw() {
        for (let i = 0; i < powerups.length; i++) {
            ctx.fillRect(this.bounds.x+i*20,this.bounds.y,10,10)
        }
        this.bounds.x = canvas.width/2-700
        this.bounds.y = canvas.height/2+290
        ctx.lineWidth = 5
        ctx.strokeRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
    }
}
let powerups = []
let powerup = new Powerup
powerups.push(powerup)
let particalEngine = new ParticleSource();
let hotbar = new HotBar();
let mouse = new Mouse();
let startButton = new Button("Start");
let retryButton = new Button("Retry");
let menu = new Scene("./Assets/BG.png");
let ball = new Ball();
let padel = new Padel();
function keyboardLoop() {
    if (currentKey.get("w")) {
        padel.bounds.y -= padel.speed
        padel.direction = -1   
    }
    if (currentKey.get("s")) {
        padel.bounds.y += padel.speed
        padel.direction = 1
    }
    if (navKey.get("a")) {
        padel.sideOn = 1
    }
    if (navKey.get("d")) {
        padel.sideOn = -1
    }
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

    }
    if (ball.bounds.y <= 0) {
        ball.spin = 1;
        particalEngine.start_particles(ball.bounds.x,ball.bounds.y)
    }
    if (ball.bounds.x <= 0) {
        mode = "dead"
    }
    if (ball.bounds.x >= canvas.width) {
        mode = "dead"
    }
}
function dottedLine() {
    for (let i = 0; i < 20;i ++) {
        ctx.fillStyle = "#a3a3a3"
        ctx.fillRect(canvas.width/2+5,10+i*50,10,15)
    }
}
function loop() {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    if (mode === "menu") {
        menu.draw();
        startButton.draw(canvas.width/2-20,10);
        if (mouse.clickOn(startButton)) {
            mode = "game"
        }
    }
    if (mode === "dead") {
        ctx.font = "bold 48px serif";     
        retryButton.draw(canvas.width/2-20,10);
        if (mouse.clickOn(retryButton))  {
            mode = "game"
            ball.speed = 2;
            ball.bounds.x = canvas.width/2-5
            ball.bounds.y = canvas.height/2-5
        }
    }
    if (mode === "game") {
        padel.draw();
        ball.draw();
        hotbar.draw();
        for (let i = 0; i < powerups.length; i++) {
            powerups[i].draw();
            powerups[i].collision();
        }
        dottedLine();
        particalEngine.draw_particles(ctx,238, 134, 149)
        padel.check_switch();
        particalEngine.update_particles();
        ball.update();
        ball.collision();
        WorldColision();
    }
    keyboardLoop();
    navKey.clear();
    requestAnimationFrame(loop)
}
function ResizeCanvas() {
    canvas.width = window.innerWidth -30
    canvas.height = window.innerHeight -30
}
function init() {
    window.addEventListener("load", (e) => {
        ResizeCanvas()
      })
      window.addEventListener("resize", (e) => {
        ResizeCanvas();
    
    })
    mouse.init();
    keyboardInit();
    loop();
}
init();