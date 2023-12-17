export const formatNum = (num: bigint | string): string => {
  const tag = (num || 0).toString(10).split('.');
  tag[0] = tag[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return tag.join('.');
};
