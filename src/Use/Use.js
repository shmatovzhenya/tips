import isEmptyObject from '../utils/isEmptyObject';


const compute = async ({ method, options, update, computed }, result = {}) => {
  let data = {};

  if (!computed || isEmptyObject(computed)) {
    data = await method(options);
  }

  if (typeof computed === 'string') {
    const computedValue = result[computed];

    data = await method(computedValue);
  }

  if (!isEmptyObject(update)) {
    for (let [key, useInstance] of Object.entries(update)) {
      data[key] = await compute(useInstance, {...result, ...data});
    }
  }

  return data;
};

/**
 * Data transfer object for Data Mapper.
 */
class Use {
  #method = undefined;
  #options = undefined;
  #update = undefined;
  #fallback = undefined;
  #computed = undefined;

  constructor({ method, options, update, fallback, computed }) {
    if (typeof method !== 'function') {
      throw new Error('Method parameter must be a function');
    }

    this.#method = method;

    if (!isEmptyObject(options)) {
      this.#options = options;
    }

    if (!isEmptyObject(update)) {
      this.#update = update;
    }

    if (!isEmptyObject(fallback)) {
      this.#fallback = fallback;
    }

    Object.freeze(this);
  }

  get method() {
    return this.#method;
  }

  get options() {
    return this.#options;
  }

  get update() {
    return this.#update;
  }

  get fallback() {
    return this.#fallback;
  }

  get computed() {
    return this.#computed;
  }

  async getResult() {
    return await compute(this);
  }
}

export default Use;
