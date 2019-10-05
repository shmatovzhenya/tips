import test from 'ava';

import IdentityMap from './IdentityMap';


test('Testing result identical after add to identity map', async t => {
  const m1 = a => Promise.resolve(123 + a);
  const im = new IdentityMap(m1);
  
  const rawResult = await m1('1');
  const cachedResult = await im('1');

  t.deepEqual(rawResult, '1231');
  t.deepEqual(rawResult, cachedResult);
});

test('Testing caching functional for identity map', async t => {
  let counter = 0;

  const m1 = a => {
    counter++;
    return Promise.resolve(123 + a);
  };

  const im = new IdentityMap(m1);

  const firstCall = await im('1');
  const secondCall = await im('1');
  const thirdCall = await im('1');

  t.deepEqual(counter, 1);
  t.deepEqual(firstCall, secondCall);
  t.deepEqual(secondCall, thirdCall);
});


test('Testing function calling with different parameters', async t => {
  let counter = 0;

  const m1 = a => {
    counter++;
    return Promise.resolve(123 + a);
  };

  const im = new IdentityMap(m1);

  const firstCall = await im('1');
  const differentCall = await im('2');
  const secondCall = await im('1');

  t.deepEqual(counter, 2);
  t.deepEqual(firstCall, secondCall);
  t.deepEqual(differentCall, '1232');
});
