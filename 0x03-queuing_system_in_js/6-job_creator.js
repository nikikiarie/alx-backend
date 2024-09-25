import { createQueue } from 'kue';

const notificationQueue = createQueue();

const notificationData = {
  'phoneNumber': '4153518780',
  'message': 'This is the code to verify your account',
};

const notificationJob = notificationQueue.create('push_notification_code', notificationData).save((err) => {
  if (!err) {
    console.log(`Notification job created with ID: ${notificationJob.id}`);
  }
});

notificationJob
  .on('complete', () => {
    console.log('Notification job completed successfully');
  })
  .on('failed', () => {
    console.log('Notification job failed');
  });
