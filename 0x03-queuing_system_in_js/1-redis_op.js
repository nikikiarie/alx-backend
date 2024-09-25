import { createClient, print } from 'redis';

const cli = createClient();

cli.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

cli.on('connect', () => {
  console.log('Redis client connected to the server');
});

const setNewSchool = (schoolName, value) => {
  cli.SET(schoolName, value, print);
};

const displaySchoolValue = (schoolName) => {
  cli.GET(schoolName, (_err, reply) => {
    console.log(reply);
  });
};

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
