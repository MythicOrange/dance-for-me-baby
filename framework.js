const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const NUM_GRASS = 150;
const NUM_WOLVES = 50;
const NUM_SHEEP = 5;

const TICK_INTERVAL = 712;

class Simulation {
    constructor() {
        this.entities = [];
        this.init();
    }

    init() {
        for (let i = 0; i < NUM_GRASS; i++) {
            this.entities.push(new Grass(Math.random() * WIDTH, Math.random() * HEIGHT));
        }
        for (let i = 0; i < NUM_WOLVES; i++) {
            this.entities.push(new Wolf(Math.random() * WIDTH, Math.random() * HEIGHT));
        }
        for (let i = 0; i < NUM_SHEEP; i++) {
            this.spawnSheepCluster();
        }
        this.animate();
        setInterval(() => this.tick(), TICK_INTERVAL);
    }

    animate() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        this.entities.forEach(entity => entity.draw(ctx));
        requestAnimationFrame(() => this.animate());
    }

    tick() {
        let currentTick = Math.floor(Date.now() / TICK_INTERVAL);
        this.entities.forEach(entity => entity.update(currentTick));
        let newEntities = [];
        this.entities.forEach(entity => {
            if (entity instanceof Wolf) {
                let nearestSheep = this.findNearest(entity, 'sheep');
                if (nearestSheep && this.distance(entity, nearestSheep) < 10) {
                    nearestSheep.die();
                    entity.lastAteTick = currentTick;
                    entity.fed = true;
                }
                let otherWolf = this.findNearest(entity, 'wolf');
                if (entity.fed && otherWolf && this.distance(entity, otherWolf) < 50 && currentTick - entity.lastAteTick <= 3) {
                    newEntities.push(new Wolf(entity.x, entity.y));
                }
            } else if (entity instanceof Sheep) {
                let nearestGrass = this.findNearest(entity, 'grass');
                if (nearestGrass && this.distance(entity, nearestGrass) < 10) {
                    nearestGrass.die();
                    let otherSheep = this.findNearest(entity, 'sheep');
                    if (otherSheep && this.distance(entity, otherSheep) < 50) {
                        this.spawnSheepCluster(entity.x, entity.y);
                    }
                }
                let nearestWolf = this.findNearest(entity, 'wolf');
                if (nearestWolf && this.distance(entity, nearestWolf) < 200) {
                    entity.panicTick = 1;
                }
                }
                });
                this.entities = this.entities.concat(newEntities);
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
                }
                
                const simulation = new Simulation();