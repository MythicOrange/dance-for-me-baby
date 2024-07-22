import Simulation from './simulation.js';

class SimStart {
    constructor(simulation) {
        this.simulation = simulation;
    }

    start() {
        for (let i = 0; i < 150; i++) {
            this.simulation.entities.push(new Grass(Math.random() * WIDTH, Math.random() * HEIGHT));
        }
        for (let i = 0; i < 50; i++) {
            this.simulation.entities.push(new Wolf(Math.random() * WIDTH, Math.random() * HEIGHT));
        }
        for (let i = 0; i < 5; i++) {
            this.simulation.spawnSheepCluster();
        }
        this.simulation.animate();
        setInterval(() => this.simulation.tick(), 712);
    }
}

export default SimStart;