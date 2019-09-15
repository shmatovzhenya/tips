import test from 'ava';

import { loadValues } from './utils';


test('Testing load values util', async (t) => {
  const fixture = {
    345: {
      method: () => Promise.resolve(42),
    }, 
    123: {
      method: ({ a, b }) => Promise.resolve({ b: a, a: b }),
      options: { a: 2, b: 3 },
    },
  };

  const data = await loadValues(fixture);

  t.deepEqual(data, {
    123: { a: 3, b: 2 },
    345: 42,
  });
});
