import Entity from './entity.js';

class Sheep extends Entity {
    constructor(x, y) {
        super(x, y);
        this.type = 'sheep';
        this.age = 0;
        this.panicTick = 0;
    }

    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2, false);
        ctx.fill();
    }

    update(tick) {
        this.age++;
        this.move();
        if (this.age > 3) this.die();
        if (this.panicTick > 0) this.panicTick--;
    }

    move() {
        let speed = 8;
        if (this.panicTick > 0) speed *= 2.5;
        let target = this.findNearest(this, 'grass');
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

    die() {
        const index = this.simulation.entities.indexOf(this);
        if (index > -1) {
            this.simulation.entities.splice(index, 1);
        }
    }

    findNearest(entity, type) {
        let nearestEntity = null;
        let minDist = Infinity;
        this.simulation.entities.forEach(e => {
            if (e.type === type) {
                let dist = Math.sqrt(Math.pow(e.x - entity.x, 2) + Math.pow(e.y - entity.y, 2));
                if (dist < minDist) {
                    minDist = dist;
                    nearestEntity = e;
                }
            }
        });
        return nearestEntity;
    }
}

export default Sheep;