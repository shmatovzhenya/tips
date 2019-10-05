const cache = new Map();

class IdentityMap {
  constructor(method) {
    if (!cache.has(method)) {
      cache.set(method, {});
    }

    return options => {
      const methodCalls = cache.get(method);
      const serialized = JSON.stringify(options);

      if (!(serialized in methodCalls)) {
        methodCalls[serialized] = method(options);
      }

      return methodCalls[serialized];
    };
  }
}

export default IdentityMap;
