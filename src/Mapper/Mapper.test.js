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

test('Testing use mixing data', async (t) => {
  const mapper = new Mapper(METHODS);

  const response = mapper
    .load({ method: API.LOADER1, key: '123', options: { a: 2, b: 3 } })
    .load({ method: API.LOADER2, key: '123.4' });

  const data = await response.values();

  t.deepEqual(data, {
    123: {
      a: 3,
      b: 2,
      4: 42,
    },
  });
});

test('Testing correct saving order result for function calls', async (t) => {
  const mapper = new Mapper(METHODS);

  const response = mapper
    .load({ method: API.LOADER2, key: '123.4' })
    .load({ method: API.LOADER1, key: '123', options: { a: 2, b: 3 } });

    const data = await response.values();
  
    t.deepEqual(data, {
      123: {
        a: 3,
        b: 2,
        4: 42,
      },
    });
});

test('Testing correct order result for function calls', async (t) => {
  const mapper = new Mapper(METHODS);

  const response = mapper
    .load({ method: API.LOADER2, key: '123.4' })
    .load({ method: API.LOADER1, key: '123', options: { a: 2, b: 3 } })
    .load({ method: API.LOADER1, key: '123', options: { a: 4, b: 5 } });

    const data = await response.values();
  
    t.deepEqual(data, {
      123: {
        a: 5,
        b: 4,
        4: 42,
      },
    });
});

test('Testing using previous calls result', async (t) => {
  const mapper = new Mapper(METHODS);

  const response = mapper
    .load({ method: API.LOADER2, key: '123.4' })
    .load({ method: API.LOADER1, key: '123', options: { a: 2, b: 3 }, use: { a: '123.4' } });

    const data = await response.values();

    t.deepEqual(data, {
      123: {
        a: 3,
        b: 42,
        4: 42,
      },
    });
});
