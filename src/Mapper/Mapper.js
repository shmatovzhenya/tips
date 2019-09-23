import get from 'lodash-es/get';

import { loadValues, splitDataByDepends } from './utils';


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
    const { withDependencies, withoutDependencies } = splitDataByDepends(queue);
    const firstData = await loadValues(withoutDependencies);

    if (!withDependencies || Object.keys(withDependencies).length === 0) {
      return firstData;
    }

    const nextQueue = Object.keys(withDependencies).reduce((result, key) => {
      const { use, options, method } = withDependencies[key];
      const useKeys = Object.keys(use);
      const nextOptions = {...options};
      const nextUse = {};

      useKeys.forEach((key) => {
        const path = use[key];
        const computedData = get(firstData, path, null);

        if (!computedData) {
          nextUse[key] = use[key];

          return;
        }

        nextOptions[key] = computedData;
      });

      result[key] = { method };

      if (nextUse && Object.keys(nextUse).length > 0) {
        result[key].use = nextUse;
      }

      if (nextOptions && Object.keys(nextOptions).length > 0) {
        result[key].options = nextOptions;
      }

      return result;
    }, {});

    const mergedQueue = {...withoutDependencies, ...nextQueue};
    
    return await this._loadDataWithDependecies(mergedQueue);
  }

  async values() {
    return await this._loadDataWithDependecies(this.queue);
  }
}

export default Mapper;
