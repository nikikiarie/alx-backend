import { createClient, print } from 'redis';

const cli = createClient();

cli.on('connect', function() {
  console.log('Redis client connected to the server');
});

cli.on('error', function(error) {
  console.log(`Redis client not connected to the server: ${error}`);
});

cli.hset('HolbertonSchools', 'Portland', '50', print);
cli.hset('HolbertonSchools', 'Seattle', '80', print);
cli.hset('HolbertonSchools', 'New York', '20', print);
cli.hset('HolbertonSchools', 'Bogota', '20', print);
cli.hset('HolbertonSchools', 'Cali', '40', print);
cli.hset('HolbertonSchools', 'Paris', '2', print);

cli.hgetall('HolbertonSchools', function (error, res) {
  if (error) {
    console.log(error);
    throw error;
  }
  console.log(res);
});
