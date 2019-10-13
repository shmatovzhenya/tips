import test from 'ava';

import Use from './Use';


test('Correct creating use object', t => {
  const use = new Use({
    method: async () => {},
    options: [],
    update: { a: 1 },
  });

  t.deepEqual(use.options, undefined);
  t.deepEqual(use.update, { a: 1 });
});

test('Testing most trivial case', async (t) => {
  const use = new Use({
    method: ({ a, b }) => Promise.resolve({ a: b, b: a }),
    options: { a: 2, b: 3 },
  });

  const result = await use.getResult();

  t.deepEqual({ a: 3, b: 2 }, result);
});

test('Testing correct update data in nesting instances', async (t) => {
  const nestedUse = new Use({
    method: () => Promise.resolve(42),
  });

  const use = new Use({
    method: ({ a, b }) => Promise.resolve({ a: b, b: a }),
    options: { a: 2, b: 3 },
    update: {
      b: nestedUse,
    },
  });

  const result = await use.getResult();

  t.deepEqual({ a: 3, b: 42 }, result);
});

test('Testing use previous computed value', async (t) => {
  const nestedUse = new Use({
    method: a => Promise.resolve(-a),
    computed: 'b',
  });

  const use = new Use({
    method: ({ a, b }) => Promise.resolve({ a: b, b: a }),
    options: { a: 2, b: 3 },
    update: {
      b: nestedUse,
    },
  });

  const result = await use.getResult();

  t.deepEqual({ a: 3, b: -2 }, result);
});

test('Testing use previous flat object computed value', async (t) => {
  const nestedUse = new Use({
    method: ({ a }) => Promise.resolve(-a),
    computed: {
      a: 'b',
    },
  });

  const use = new Use({
    method: ({ a, b }) => Promise.resolve({ a: b, b: a }),
    options: { a: 2, b: 3 },
    update: {
      b: nestedUse,
    },
  });

  const result = await use.getResult();

  t.deepEqual({ a: 3, b: -2 }, result);
});
