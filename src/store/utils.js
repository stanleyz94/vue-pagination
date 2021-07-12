import { range as _range } from 'lodash';

const Paginator = (totalItems, currentPage, perPage) => {
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage - 1, totalItems - 1);

  return {
    currentPage: currentPage,
    startIndex: startIndex,
    endIndex: endIndex,
    range: _range(1, Math.ceil(totalItems / perPage) + 1),
  };
};

export { Paginator };
