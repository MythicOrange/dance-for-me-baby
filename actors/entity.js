class Entity {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dead = false;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = this.getColor();
        ctx.fill();
    }

    update(tick) {
        // update entity
    }

    die() {
        this.dead = true;
    }

    getColor() {
        // default color is black
        return 'black';
    }
}

export default Entity;