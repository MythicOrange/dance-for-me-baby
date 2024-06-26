// BASIC VARIABLES AND INCLUDES //
// BASIC VARIABLES AND INCLUDES //
// BASIC VARIABLES AND INCLUDES //
// BASIC VARIABLES AND INCLUDES //
// BASIC VARIABLES AND INCLUDES //
    //DEFINE CANVAS
const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
    //DEFINE TICK INTERVAL
const TICK_INTERVAL = 712;

// STARTUP SEQUENCE //



// TICKY TICKER //


const GRASS_COLOR = 'green';
const WOLF_COLOR = 'gray';
const SHEEP_COLOR = 'white';

const NUM_GRASS = 150;
const NUM_WOLVES = 50;
const NUM_SHEEP = 5;


let entities = [];

class Entity {
    constructor(x, y, type, active = true) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.age = 0;
        this.lastAteTick = -1;
        this.panicTick = 0;
        this.active = active;
    }

    draw() {
        ctx.beginPath();
        switch (this.type) {
            case 'grass':
                ctx.fillStyle = GRASS_COLOR;
                ctx.fillRect(this.x, this.y, 10, 10);
                break;
            case 'wolf':
                ctx.fillStyle = WOLF_COLOR;
                ctx.fillRect(this.x, this.y, 10, 10);
                break;
            case 'sheep':
                ctx.fillStyle = SHEEP_COLOR;
                ctx.arc(this.x, this.y, 5, 0, Math.PI * 2, false);
                ctx.fill();
                break;
        }
        ctx.closePath();
    }

    update(tick) {
        this.age++;
        if (this.type === 'wolf' || this.type === 'sheep') {
            this.move();
        }
        if (this.type === 'wolf') {
          if (this.age > 10) this.die();
          else if (this.age > 5 && this.lastAteTick === -1) this.die();
        } else if (this.type === 'sheep') {
          if (this.age > 3) this.die();
        } else if (this.type === 'grass') {
            if (Math.random() < 0.1) this.die();
            else if (this.active && Math.random() < 0.5) this.spawnGrass();
            if (this.checkSurroundings()) {
                this.active = false;
            }
        } else if (this.type === 'sheep' && this.panicTick > 0) {
            this.panicTick--;
        }
    }

    move() {
        if (this.type === 'wolf' || this.type === 'sheep') {
            let speed = (this.type === 'wolf') ? 15 : 8;
            if (this.panicTick > 0) speed *= 2.5;
            let target = null;
            if (this.type === 'wolf') {
                target = this.fed ? findNearest(this, 'wolf') : findNearest(this, 'sheep');
            } else if (this.type === 'sheep') {
                target = findNearest(this, 'grass');
            }
            if (target) {
                let dx = target.x - this.x;
                let dy = target.y - this.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 1) dist = 1;
                this.x += (dx / dist) * speed;
                this.y += (dy / dist) * speed;
            } else {
                let dx = (Math.random() - 0.5) * speed * 10;
                let dy = (Math.random() - 0.5) * speed * 10;
                this.x = Math.max(0, Math.min(WIDTH, this.x + dx));
                this.y = Math.max(0, Math.min(HEIGHT, this.y + dy));
            }
        }
    }

    die() {
        const index = entities.indexOf(this);
        if (index > -1) {
            entities.splice(index, 1);
        }
    }

    spawnGrass() {
        let attempts = 0;
        while (attempts < 10) {
            let newX = this.x + (Math.random() - 0.5) * 80;
            let newY = this.y + (Math.random() - 0.5) * 80;
            if (newX >= 0 && newX < WIDTH && newY >= 0 && newY < HEIGHT && !checkOverlap(newX, newY, 'grass')) {
                entities.push(new Entity(newX, newY, 'grass'));
                break;
            }
            attempts++;
        }
    }

    checkSurroundings() {
        let covered = 0;
        let positions = [
            { x: -10, y: -10 }, { x: 0, y: -10 }, { x: 10, y: -10 },
            { x: -10, y: 0 }, { x: 10, y: 0 },
            { x: -10, y: 10 }, { x: 0, y: 10 }, { x: 10, y: 10 }
        ];
        positions.forEach(pos => {
            if (entities.some(e => e.type === 'grass' && Math.abs(e.x - (this.x + pos.x)) < 10 && Math.abs(e.y - (this.y + pos.y)) < 10)) {
                covered++;
            }
        });
        return covered >= 5;
    }
}

function init() {
    for (let i = 0; i < NUM_GRASS; i++) {
        entities.push(new Entity(Math.random() * WIDTH, Math.random() * HEIGHT, 'grass'));
    }
    for (let i = 0; i < NUM_WOLVES; i++) {
        entities.push(new Entity(Math.random() * WIDTH, Math.random() * HEIGHT, 'wolf'));
    }
    for (let i = 0; i < NUM_SHEEP; i++) {
        spawnSheepCluster();
    }
    animate();
    setInterval(tick, TICK_INTERVAL);
}

function animate() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    entities.forEach(entity => entity.draw());
    requestAnimationFrame(animate);
}

function tick() {
    let currentTick = Math.floor(Date.now() / TICK_INTERVAL);
    entities.forEach(entity => entity.update(currentTick));

    let newEntities = [];
    entities.forEach(entity => {
        if (entity.type === 'wolf') {
            let nearestSheep = findNearest(entity, 'sheep');
            if (nearestSheep && distance(entity, nearestSheep) < 10) {
                nearestSheep.die();
                entity.lastAteTick = currentTick;
                entity.fed = true;
            }
            let otherWolf = findNearest(entity, 'wolf');
            if (entity.fed && otherWolf && distance(entity, otherWolf) < 50 && currentTick - entity.lastAteTick <= 3) {
                newEntities.push(new Entity(entity.x, entity.y, 'wolf'));
            }
        } else if (entity.type === 'sheep') {
            let nearestGrass = findNearest(entity, 'grass');
            if (nearestGrass && distance(entity, nearestGrass) < 10) {
                nearestGrass.die();
                let otherSheep = findNearest(entity, 'sheep');
                if (otherSheep && distance(entity, otherSheep) < 50) {
                    spawnSheepCluster(entity.x, entity.y);
                }
            }
            let nearestWolf = findNearest(entity, 'wolf');
            if (nearestWolf && distance(entity, nearestWolf) < 200) {
                entity.panicTick = 1;
            }
        }
    });
    entities = entities.concat(newEntities);
}

function findNearest(entity, type) {
    let minDist = Infinity;
    let nearest = null;
    entities.forEach(e => {
        if (e.type === type) {
            let dist = distance(entity, e);
            if (dist < minDist) {
                minDist = dist;
                nearest = e;
            }
        }
    });
    return nearest;
}

function distance(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function checkOverlap(x, y, type) {
    return entities.some(e => e.type === type && Math.abs(e.x - x) < 10 && Math.abs(e.y - y) < 10);
}

function spawnSheepCluster(x = Math.random() * WIDTH, y = Math.random() * HEIGHT) {
    for (let i = 0; i < 3; i++) {
        let angle = (i / 3) * 2 * Math.PI;
        let newX = x + Math.cos(angle) * 20;
        let newY = y + Math.sin(angle) * 20;
        if (newX >= 0 && newX < WIDTH && newY >= 0 && newY < HEIGHT) {
            entities.push(new Entity(newX, newY, 'sheep'));
        }
    }
}

init();