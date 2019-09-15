import test from 'ava';

import objectPromiseAll from './objectPromiseAll';


test('Testing object promise all', async (t) => {
  const f1 = Promise.resolve(100);
  const f2 = Promise.resolve(150);
  const options = { f1, f2 };

  const result = await objectPromiseAll(options);

  t.deepEqual(result, {
    f1: 100,
    f2: 150,
  });
});
