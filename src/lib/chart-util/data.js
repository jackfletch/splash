import {createAccessor} from './helpers';

/**
 * Sanitize data values that break logarithmic scales (i.e., set 0 to a really
 * small number) if a given scale is logarithmic.
 * @param {Array} dataset the original unsanitized dataset.
 * @param {Object} props the props object.
 * @returns {Array} the sanitized data.
 */
function cleanData(dataset, props) {
  // TODO: implement function to sanitize log scales with values of 0
  return dataset;
}

/**
 * Format data. Data accessors are applied, and string values are replaced.
 * @param {Array} dataset the original dataset.
 * @param {Object} props the props object.
 * @returns {Array} the formatted data.
 */
function formatData(dataset, props) {
  if (!Array.isArray(dataset) || dataset.length < 1) {
    return [];
  }

  const keys = ['x', 'y', 'y0'];

  const createAccessorFromProp = name =>
    createAccessor(props[name] !== undefined ? props[name] : name);

  const accessor = keys.reduce((memo, type) => {
    memo[type] = createAccessorFromProp(type);
    return memo;
  }, {});

  const data = dataset.reduce((acc, datum, i, src) => {
    const fallbackValues = {
      x: i,
      y: datum,
    };
    const processedValues = keys.reduce((memo, type) => {
      const processedValue = accessor[type](datum, i, src);
      const value = processedValue ?? fallbackValues[type];

      if (value !== undefined) {
        memo[`_${type}`] = value;
      }

      return memo;
    }, {});

    const formattedDatum = {...processedValues, ...datum};

    if (Object.keys(formattedDatum).length) {
      acc.push(formattedDatum);
    }

    return acc;
  }, []);
  const cleanedData = cleanData(data, props);
  return cleanedData;
}

export {formatData, cleanData};
