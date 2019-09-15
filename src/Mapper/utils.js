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

export {
  loadValues,
};
