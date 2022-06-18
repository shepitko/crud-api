import { boot } from './src/main';

// I'm using NODE_ENV because it's croslatform variables;
const scale = process.env.NODE_ENV || false;
boot({ scale: Boolean(scale) });
