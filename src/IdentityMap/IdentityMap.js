import DummyInMemoryStrategy from './strategies/DummyInMemoryStrategy';


const defaultStrategy = new DummyInMemoryStrategy();

class IdentityMap {
  constructor(method, strategy = defaultStrategy) {
    return options => {
      if (!strategy.has(method, options)) {
        strategy.set(method, options);
      }

      return strategy.get(method, options);
    };
  }
}

export default IdentityMap;
