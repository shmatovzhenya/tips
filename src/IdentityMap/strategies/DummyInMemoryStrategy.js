const cache = new Map();

class DummyInMemoryStrategy {
  constructor() {}

  set(method, parameters) {
    const serialized = JSON.stringify(parameters);

    if (!cache.has(method)) {
      cache.set(method, {});
    }

    const methodCall = cache.get(method);

    if (!(serialized in methodCall)) {
      methodCall[serialized] = method(parameters);
    }
  }

  has(method, parameters) {
    return cache.has(method) && cache.get(method)[JSON.stringify(parameters)];
  }

  get(method, parameters) {
    return cache.get(method)[JSON.stringify(parameters)];
  }
}

export default DummyInMemoryStrategy;
