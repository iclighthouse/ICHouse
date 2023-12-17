import BigNumber from 'bignumber.js';
export const bigintToFloat = (
  val: bigint | string,
  num = 4,
  decimal = 8
): string => {
  if (val === '-') {
    return val;
  }
  try {
    if (val || (val !== null && val.toString())) {
      // BigNumber.ROUND_DOWN: 1
      return new BigNumber(val.toString())
        .div(10 ** decimal)
        .decimalPlaces(num, 1)
        .toString(10); // Calling toString with a base argument, e.g. toString(10), will also always return normal notation.
    } else {
      return '-';
    }
  } catch (e) {
    return '';
  }
};
