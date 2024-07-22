import SimStart from './simStart.js';
import Simulation from './simulation.js';

const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const simulation = new Simulation();
const simStart = new SimStart(simulation);
simStart.start();