import objectPromiseAll from '../utils/objectPromiseAll';


const loadValues = async (queue) => {
  const keys = Object.keys(queue);
  
  const options = keys.reduce((result, key) => {
    const { method, options } = queue[key];

    result[key] = method(options);

    return result;
  }, {});

  return await objectPromiseAll(options);
};

const splitDataByDepends = (queue) => {
  const keys = Object.keys(queue);
  
  const { withDependencies, withoutDependencies } = keys.reduce((result, key) => {
    const item = queue[key];
    const field = 'use' in item ? 'withDependencies' : 'withoutDependencies';

    if (!result[field]) {
      result[field] = {};
    }

    result[field][key] = item;

    return result;
  }, {});

  return {
    withDependencies,
    withoutDependencies,
  };
};

export {
  loadValues,
  splitDataByDepends,
};
