import set from 'lodash-es/set';


class Mapper {
  queue = {};

  constructor(api, queue) {
    this.api = api;

    if (queue) {
      this.queue = queue;
    }
  }

  load({ method, key, options }) {
    this.queue[key] = {
      method: this.api[method],
      options,
    };

    return new Mapper(this.api, this.queue);
  }

  async values() {
    const keys = Object.keys(this.queue);
    
    const asyncQueue = keys.map(key => {
      const { method, options } = this.queue[key];
      
      return method(options);
    });
    
    const responses = await Promise.all(asyncQueue);

    return responses.reduce((result, response, index) => {
      const responseName = keys[index] || '';

      set(result, responseName, response);

      return result;
    }, {});
  }
}

export default Mapper;
