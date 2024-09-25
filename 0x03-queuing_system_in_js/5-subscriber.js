import { createClient } from 'redis';

const cli = createClient();
const EXIT_MSG = 'KILL_SERVER';

cli.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

cli.on('connect', () => {
  console.log('Redis client connected to the server');
});

cli.subscribe('holberton school channel');

cli.on('message', (error, info) => {
  console.log(info);
  if (info === EXIT_MSG) {
    cli.unsubscribe();
    cli.quit();
  }
});
