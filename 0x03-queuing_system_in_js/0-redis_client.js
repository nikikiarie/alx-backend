import { createClient } from 'redis';

const cli = createClient();

cli.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

cli.on('connect', () => {
  console.log('Redis client connected to the server');
});