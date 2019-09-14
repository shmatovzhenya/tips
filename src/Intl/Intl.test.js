import test from 'ava';

import Intl from './Intl';
import FlatQueue from '../AsyncQueue/FlatQueue';


test('Testing deferred load keys', async (t) => {
  const task = (keys) => new Promise(resolve => setTimeout(() => resolve(keys)), 100);
  const queue = new FlatQueue();
  const intl = new Intl({ queue, request: task });

  queue.addTaskToQueue(task(10));

  intl.addMessage('123');
  intl.addMessage('345');

  const result = await intl.getValues();

  t.deepEqual(result, ['123', '345']);
});
