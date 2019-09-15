import get from 'lodash-es/get';
import set from 'lodash-es/set';

import { loadValues } from './utils';
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
    };

    if (options) {
      this.queue[key].options = options;
    }

    if (use) {
      this.queue[key].use = use;
    }

    return new Mapper(this.api, this.queue);
  }

  async _loadDataWithDependecies(queue) {
    const keys = Object.keys(queue);

    const { withDependencies, withoutDependencies } = keys.reduce((result, key) => {
      const item = queue[key];
      const field = 'use' in item ? 'withDependencies' : 'withoutDependencies';

      result[field][key] = item;

      return result;
    }, { withDependencies: {}, withoutDependencies: {} });

    const firstData = await this.loadValues(withoutDependencies);

    const nextIndependedData = Object.keys(withDependencies).reduce((result, key) => {
      const { use, options, method } = withDependencies[key];
      const useKeys = Object.keys(use);

      const computedOptions = useKeys.reduce((result, key) => {
        const computedData = get(firstData, key, null);

        if (computedData) {
          set(result, key, computedData);
        }

        return result;
      }, {});

      return result;
    }, {});
  }

  async values() {
    const keys = Object.keys(this.queue);

    const { withDependencies, withoutDependencies } = keys.reduce((result, key) => {
      const item = this.queue[key];
      const field = 'use' in item ? 'withDependencies' : 'withoutDependencies';

      result[field][key] = item;

      return result;
    }, { withDependencies: {}, withoutDependencies: {} });

    return await loadValues(withoutDependencies);
  }
}

export default Mapper;
