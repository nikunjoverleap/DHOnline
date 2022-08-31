import currency from 'currency.js';

export const espTransform = (
  value,

  {precision = 0} = {},
) => {
  const val = !isNaN(Number(value)) ? Number(value) : value;

  return currency(val, {
    precision: precision,

    symbol: '',

    decimal: ',',

    separator: ',',
  }).format();
};


