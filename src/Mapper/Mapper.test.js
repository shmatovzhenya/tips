import test from 'ava';

import Mapper from './Mapper';

const API = {
  LOADER1: 'LOADER1',
  LOADER2: 'LOADER2',
};

const METHODS = {
  [API.LOADER1]: ({ a, b }) => Promise.resolve({ b: a, a: b }),
  [API.LOADER2]: () => Promise.resolve(42),
};

test('Testing create method chaining', (t) => {
  const mapper = new Mapper(METHODS);

  const response = mapper
    .load({ method: API.LOADER1, key: '123', options: { a: 2, b: 3 } })
    .load({ method: API.LOADER2, key: '345' });

  t.true(response instanceof Mapper);
});

test('Testing async get values', async (t) => {
  const mapper = new Mapper(METHODS);

  const response = mapper
    .load({ method: API.LOADER1, key: '123', options: { a: 2, b: 3 } })
    .load({ method: API.LOADER2, key: '345' });

  const data = await response.values();

  t.deepEqual(data, {
    123: { a: 3, b: 2 },
    345: 42,
  });
});
