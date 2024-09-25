#!/usr/bin/yarn dev
import { Queue, Job } from 'kue';

export const createPushNotificationsJobs = (jobs, queue) => {
  if (!(jobs instanceof Array)) {
    throw new Error('Jobs is not an array');
  }
  for (const j of jobs) {
    const jb = queue.create('push_notification_code_3', j);

    jb
      .on('enqueue', () => {
        console.log('Notification job created:', jb.id);
      })
      .on('complete', () => {
        console.log('Notification job', jb.id, 'completed');
      })
      .on('failed', (error) => {
        console.log('Notification job', jb.id, 'failed:', error.message || error.toString());
      })
      .on('progress', (progress, _data) => {
        console.log('Notification job', jb.id, `${progress}% complete`);
      });
    jb.save();
  }
};

export default createPushNotificationsJobs;