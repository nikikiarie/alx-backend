#!/usr/bin/yarn dev
import express from 'express';
import { promisify } from 'util';
import { createQueue } from 'kue';
import { createClient } from 'redis';

const app = express();
const cli = createClient({ name: 'reserve_seat' });
const list = createQueue();
const SEATS_AT_FIRST = 50;
let reservationEnabled = false;
const prt = 1245;

const reserveSeat = async (number) => {
  return promisify(cli.SET).bind(cli)('available_seats', number);
};

const getCurrentAvailableSeats = async () => {
  return promisify(cli.GET).bind(cli)('available_seats');
};

app.get('/available_seats', (_, res) => {
  getCurrentAvailableSeats()
    .then((seats_available) => {
      res.json({ seats_available })
    });
});

app.get('/reserve_seat', (_req, res) => {
  if (!reservationEnabled) {
    res.json({ status: 'Reservation are blocked' });
    return;
  }
  try {
    const job = list.create('reserve_seat');

    job.on('failed', (error) => {
      console.log(
        'Seat reservation job',
        job.id,
        'failed:',
        error.message || error.toString(),
      );
    });
    job.on('complete', () => {
      console.log(
        'Seat reservation job',
        job.id,
        'completed'
      );
    });
    job.save();
    res.json({ status: 'Reservation in process' });
  } catch {
    res.json({ status: 'Reservation failed' });
  }
});

app.get('/process', (_req, res) => {
  res.json({ status: 'Queue processing' });
  list.process('reserve_seat', (_job, done) => {
    getCurrentAvailableSeats()
      .then((res) => Number.parseInt(res || 0))
      .then((availableSeats) => {
        reservationEnabled = availableSeats <= 1 ? false : reservationEnabled;
        if (availableSeats >= 1) {
          reserveSeat(availableSeats - 1)
            .then(() => done());
        } else {
          done(new Error('Not enough seats available'));
        }
      });
  });
});

const resetAvailableSeats = async (seats_first) => {
  return promisify(cli.SET)
    .bind(cli)('available_seats', Number.parseInt(seats_first));
};

app.listen(prt, () => {
  resetAvailableSeats(process.env.SEATS_AT_FIRST || SEATS_AT_FIRST)
    .then(() => {
      reservationEnabled = true;
      console.log(`API available on localhost port ${prt}`);
    });
});

export default app;
