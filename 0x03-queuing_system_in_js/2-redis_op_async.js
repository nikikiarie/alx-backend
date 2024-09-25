import { promisify } from 'util';
import { createClient, print } from 'redis';

const cli = createClient();

cli.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

const setNewSchool = (schoolName, value) => {
  cli.SET(schoolName, value, print);
};

const displaySchoolValue = async (schoolName) => {
  console.log(await promisify(cli.GET).bind(cli)(schoolName));
};

async function main() {
  await displaySchoolValue('Holberton');
  setNewSchool('HolbertonSanFrancisco', '100');
  await displaySchoolValue('HolbertonSanFrancisco');
}

cli.on('connect', async () => {
  console.log('Redis client connected to the server');
  await main();
});
