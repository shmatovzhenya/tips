import isEmptyObject from '../utils/isEmptyObject';

class Use {
  constructor({ method, options, update, fallback }) {
    if (typeof method !== 'function') {
      throw new Error('Method parameter must be a function');
    }

    Object.defineProperty(this, 'method', {
      enumerable: false,
      writable: false,
      get: () => method,
    });

    if (!isEmptyObject(options)) {
      Object.defineProperty(this, 'options', {
        enumerable: false,
        writable: false,
        get: () => options,
      });
    }

    if (!isEmptyObject(update)) {
      Object.defineProperty(this, 'update', {
        enumerable: false,
        writable: false,
        get: () => update,
      });
    }

    if (!isEmptyObject(fallback)) {
      Object.defineProperty(this, 'fallback', {
        enumerable: false,
        writable: false,
        get: () => fallback,
      });
    }
  }
}

export default Use;
