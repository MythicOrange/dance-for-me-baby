import SimTick from './simTick.js';
import SimEnd from './simEnd.js';

class Simulation {
    constructor() {
        this.entities = [];
        this.initiativeOrder = [];
    }

    animate() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        this.entities.forEach(entity => entity.draw(ctx));
        requestAnimationFrame(() => this.animate());
    }

    tick() {
        let currentTick = Math.floor(Date.now() / 712);
        this.initiativeOrder = this.shuffle(this.entities.filter(entity =>!entity.dead));
        for (let entity of this.initiativeOrder) {
            entity.update(currentTick);
        }
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    findNearest(entity, type) {
        let minDist = Infinity;
        let nearest = null;
        this.entities.forEach(e => {
            if (e.type === type) {
                let dist = this.distance(entity, e);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = e;
                }
            }
        });
        return nearest;
    }

    distance(a, b) {
        return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
    }

    checkOverlap(x, y, type) {
        return this.entities.some(e => e.type === type && Math.abs(e.x - x) < 10 && Math.abs(e.y - y) < 10);
    }

    spawnSheepCluster(x = Math.random() * WIDTH, y = Math.random() * HEIGHT) {
        for (let i = 0; i < 3; i++) {
            let angle = (i / 3) * 2 * Math.PI;
            let newX = x + Math.cos(angle) * 20;
            let newY = y + Math.sin(angle) * 20;
            if (newX >= 0 && newX < WIDTH && newY >= 0 && newY < HEIGHT) {
                this.entities.push(new Sheep(newX, newY));
            }
        }
    }

    startTick() {
        const simTick = new SimTick(this);
        simTick.start();
    }

    endSimulation() {
        const simEnd = new SimEnd(this);
        simEnd.end();
    }
}

export default Simulation;