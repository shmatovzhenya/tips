import test from 'ava';

import FlatQueue from './FlatQueue';


test('Testing addition new task', async (t) => {
  const task = () => new Promise(resolve => setTimeout(() => resolve()), 100);
  const queue = new FlatQueue();

  queue.addTaskToQueue(task());

  t.true(queue.tasks.size === 1);
});

test('Testing wait complete', async (t) => {
  const task = (s = 100) => new Promise(resolve => setTimeout(() => resolve()), s);
  const queue = new FlatQueue();

  queue.addTaskToQueue(task());
  queue.addTaskToQueue(task());

  t.true(queue.tasks.size === 2);

  setTimeout(() => {
    queue.addTaskToQueue(task());
    t.true(queue.tasks.size === 3);
  }, 40);
  
  await queue.waitAllTasksComplete();

  t.true(queue.tasks.size === 0);
});
