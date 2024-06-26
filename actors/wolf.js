class Wolf {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.type = 'wolf';
        this.age = 0;
        this.lastAteTick = -1;
        this.fed = false;
    }

    draw(ctx) {
        ctx.fillStyle = 'gray';
        ctx.fillRect(this.x, this.y, 10, 10);
    }

    update(tick) {
        this.age++;
        this.move();
        if (this.age > 10) this.die();
        else if (this.age > 5 && this.lastAteTick === -1) this.die();
    }

    move() {
        let speed = 15;
        let target = this.fed ? simulation.findNearest(this, 'wolf') : simulation.findNearest(this, 'sheep');
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
        const index = simulation.entities.indexOf(this);
        if (index > -1) {
            simulation.entities.splice(index, 1);
        }
    }
}