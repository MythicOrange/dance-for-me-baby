class Grass {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.type = 'grass';
        this.active = true;
        this.age = 0;
    }

    draw(ctx) {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, 10, 10);
    }

    update() {
        this.age++;
        if (Math.random() < 0.1) {
            this.die();
        } else if (this.active && Math.random() < 0.5) {
            this.spawnGrass();
        }
        if (this.checkSurroundings()) {
            this.active = false;
        }
    }

    die() {
        const index = simulation.entities.indexOf(this);
        if (index > -1) {
            simulation.entities.splice(index, 1);
        }
    }

    spawnGrass() {
        let attempts = 0;
        while (attempts < 10) {
            let newX = this.x + (Math.random() - 0.5) * 80;
            let newY = this.y + (Math.random() - 0.5) * 80;
            if (newX >= 0 && newX < WIDTH && newY >= 0 && newY < HEIGHT && !simulation.checkOverlap(newX, newY, 'grass')) {
                simulation.entities.push(new Grass(newX, newY));
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
            if (simulation.entities.some(e => e.type === 'grass' && Math.abs(e.x - (this.x + pos.x)) < 10 && Math.abs(e.y - (this.y + pos.y)) < 10)) {
                covered++;
            }
        });
        return covered >= 5;
    }
}