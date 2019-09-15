import objectPromiseAll from '../utils/objectPromiseAll';


class Mapper {
  queue = {};

  constructor(api, queue) {
    this.api = api;

    if (queue) {
      this.queue = queue;
    }
  }

  load({ method, key, options, use }) {
    this.queue[key] = {
      method: this.api[method],
      options, use,
    };

    return new Mapper(this.api, this.queue);
  }

  async values() {
    const keys = Object.keys(this.queue);
    
    const options = keys.reduce((result, key) => {
      const { method, options } = this.queue[key];

      result[key] = method(options);

      return result;
    }, {});

    return await objectPromiseAll(options);
  }
}

export default Mapper;
