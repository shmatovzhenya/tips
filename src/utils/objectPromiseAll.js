import set from 'lodash-es/set';


export default async (options) => {
  const keys = Object.keys(options);
  const values = Object.values(options);
  const responses = await Promise.all(values);

  return responses.reduce((result, response, index) => {
    const responseName = keys[index];

    set(result, responseName, response);

    return result;
  }, {});
};
