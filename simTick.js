class SimTick {
    constructor(simulation) {
        this.simulation = simulation;
        this.entityCounts = {
            grass: 0,
            wolf: 0,
            sheep: 0
        };
    }

    start() {
        for (let entity of this.simulation.entities) {
            if (!entity.dead) {
                this.entityCounts[entity.type]++;
            }
        }
        this.updateEntities();
    }

    updateEntities() {
        for (let entity of this.simulation.entities) {
            if (!entity.dead) {
                entity.update(Math.floor(Date.now() / 712));
                if (entity.dead) {
                    this.entityCounts[entity.type]--;
                }
            }
        }
        this.checkEntityCounts();
        requestAnimationFrame(() => this.updateEntities());
    }

    checkEntityCounts() {
        if (this.entityCounts.grass === 0 || this.entityCounts.wolf === 0 || this.entityCounts.sheep === 0) {
                        if (confirm('One or more entity types have reached zero. Do you want to end the simulation or continue?')) {
                this.simulation.endSimulation();
            } else {
                this.addEntities();
            }
        }
    }

    addEntities() {
        for (let type in this.entityCounts) {
            if (this.entityCounts[type] === 0) {
                for (let i = 0; i < 5; i++) {
                    let x = Math.random() * WIDTH;
                    let y = Math.random() * HEIGHT;
                    if (type === 'grass') {
                        this.simulation.entities.push(new Grass(x, y));
                    } else if (type === 'wolf') {
                        this.simulation.entities.push(new Wolf(x, y));
                    } else if (type === 'sheep') {
                        this.simulation.spawnSheepCluster(x, y);
                    }
                }
            }
        }
    }
}

export default SimTick;